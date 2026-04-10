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
 * Real-time top files chart.
 * Shows the most downloaded files with their download counts.
 */
export const TopFilesChart = ({ limit = 5, refreshInterval = 30000 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/charts/top-files?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch top files');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching top files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [limit, refreshInterval]);

  const chartData = data ? {
    labels: data.files.map(f => f.name),
    datasets: [{
      label: 'Downloads',
      data: data.files.map(f => f.downloads),
      backgroundColor: [
        'hsla(142, 71%, 45%, 0.9)',
        'hsla(142, 71%, 45%, 0.85)',
        'hsla(160, 60%, 40%, 0.8)',
        'hsla(160, 60%, 40%, 0.75)',
        'hsla(142, 71%, 45%, 0.7)',
      ],
      borderColor: [
        'hsl(142, 71%, 45%)',
        'hsl(142, 71%, 45%)',
        'hsl(160, 60%, 40%)',
        'hsl(160, 60%, 40%)',
        'hsl(142, 71%, 45%)',
      ],
      borderWidth: 2,
      borderRadius: 6,
    }]
  } : null;

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
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
          text: 'Downloads',
          color: 'hsl(214, 32%, 91%)'
        }
      },
      y: {
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
    <ChartCard title="Top Downloaded Files" loading={loading} error={error}>
      {chartData && (
        <div>
          <Bar data={chartData} options={options} />
          {data && (
            <div className="mt-4 space-y-2">
              {data.files.map((file, idx) => (
                <div key={file.id} className="flex justify-between items-center text-sm p-3 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <span className="font-medium text-foreground">
                    #{idx + 1} {file.name}
                  </span>
                  <span className="text-muted-foreground">
                    {file.downloads} <span className="text-xs">downloads</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ChartCard>
  );
};

export default TopFilesChart;
