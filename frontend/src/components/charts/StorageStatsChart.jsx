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
 * Real-time storage usage chart.
 * Shows cumulative storage used over the last N days.
 */
export const StorageStatsChart = ({ days = 30, refreshInterval = 30000 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/charts/storage-stats?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch storage stats');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching storage stats:', err);
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
      label: 'Storage Used (MB)',
      data: data.data,
      borderColor: 'hsl(160, 60%, 40%)',
      backgroundColor: 'hsla(160, 60%, 40%, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: 'hsl(160, 60%, 40%)',
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
          text: 'Storage (MB)',
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
    <ChartCard title="Storage Usage Over Time" loading={loading} error={error}>
      {chartData && (
        <div>
          <Line data={chartData} options={options} />
          {data && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Current: <span className="font-semibold text-foreground">{data.totalMB} MB</span>
            </p>
          )}
        </div>
      )}
    </ChartCard>
  );
};

export default StorageStatsChart;
