import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import ChartCard from './ChartCard';
import { API_BASE_URL } from '../../lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/**
 * Real-time upload statistics chart.
 * Shows daily file upload count over the last 30 days.
 */
export const UploadStatsChart = ({ days = 30, refreshInterval = 30000 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/charts/upload-stats?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch upload stats');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching upload stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [days, refreshInterval]);

  const chartData = data ? {
    labels: data.labels,
    datasets: [{
      label: 'Files Uploaded',
      data: data.data,
      borderColor: 'hsl(142, 71%, 45%)',
      backgroundColor: 'hsla(142, 71%, 45%, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: 'hsl(142, 71%, 45%)',
      pointBorderColor: 'hsl(222, 47%, 3%)',
      pointBorderWidth: 2,
    }]
  } : null;

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: 'hsl(214, 32%, 91%)',
          font: { size: 12, weight: '500' }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsla(217, 33%, 17%, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: 'hsl(215, 20%, 55%)',
          font: { size: 11 }
        },
        title: {
          display: true,
          text: 'Number of Files',
          color: 'hsl(214, 32%, 91%)'
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(215, 20%, 55%)',
          font: { size: 11 }
        }
      }
    }
  };

  return (
    <ChartCard title="Daily Uploads" loading={loading} error={error}>
      {chartData && (
        <div>
          <Line data={chartData} options={options} />
          {data && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Total: <span className="font-semibold text-foreground">{data.total}</span> files in {days} days
            </p>
          )}
        </div>
      )}
    </ChartCard>
  );
};

export default UploadStatsChart;
