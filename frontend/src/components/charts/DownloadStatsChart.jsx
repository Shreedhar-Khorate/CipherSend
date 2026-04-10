import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartCard from './ChartCard';
import { API_BASE_URL } from '../../lib/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Real-time download activity chart.
 * Shows total downloads per day over the last N days.
 */
export const DownloadStatsChart = ({ days = 30, refreshInterval = 30000 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/charts/download-stats?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch download stats');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching download stats:', err);
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
      label: 'Downloads',
      data: data.data,
      backgroundColor: 'hsla(142, 71%, 45%, 0.8)',
      borderColor: 'hsl(142, 71%, 45%)',
      borderWidth: 1,
      borderRadius: 4,
      hoverBackgroundColor: 'hsla(142, 71%, 45%, 1)',
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
          text: 'Number of Downloads',
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
    <ChartCard title="Daily Download Activity" loading={loading} error={error}>
      {chartData && (
        <div>
          <Bar data={chartData} options={options} />
          {data && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Total Downloads: <span className="font-semibold text-foreground">{data.total}</span>
            </p>
          )}
        </div>
      )}
    </ChartCard>
  );
};

export default DownloadStatsChart;
