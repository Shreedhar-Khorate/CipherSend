import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../lib/utils';

/**
 * Dashboard summary stats component.
 * Shows key metrics: total files, storage used, total downloads, avg file size.
 */
export const DashboardSummary = ({ refreshInterval = 30000 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/charts/summary`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const StatCard = ({ icon: Icon, label, value, unit = '' }) => (
    <div className="gradient-card rounded-xl border border-border shadow-lg p-6 flex items-start space-x-4 transition-all duration-200 hover:border-primary/30 hover:glow-green">
      <div className="p-3 bg-primary/10 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-1">
          {loading ? '...' : value}
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );

  // Simple icon components
  const FileIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
    </svg>
  );

  const StorageIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );

  const DownloadIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 6H9V4a1 1 0 10-2 0v2H5.5a2.5 2.5 0 000 5H9v2a1 1 0 102 0v-2h3.5a3.5 3.5 0 001-6.87A3.5 3.5 0 1013.5 13H11v2a1 1 0 102 0v-2h2.5a1 1 0 100-2H13V9.5a1 1 0 10-2 0v1H5.5A1.5 1.5 0 014 9.5z" clipRule="evenodd" />
    </svg>
  );

  const AverageIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M2 4a2 2 0 012-2h12a2 2 0 012 2v4a1 1 0 11-2 0V4H4v10h6a1 1 0 110 2H4a2 2 0 01-2-2V4zm12.293 5.293a1 1 0 111.414 1.414L12 15.414l-1.707-1.707a1 1 0 00-1.414 1.414l2.414 2.414a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={FileIcon}
        label="Total Files"
        value={data?.total_files || 0}
      />
      <StatCard
        icon={StorageIcon}
        label="Storage Used"
        value={data?.total_storage_mb || 0}
        unit="MB"
      />
      <StatCard
        icon={DownloadIcon}
        label="Total Downloads"
        value={data?.total_downloads || 0}
      />
      <StatCard
        icon={AverageIcon}
        label="Avg File Size"
        value={data?.avg_file_size_mb || 0}
        unit="MB"
      />
    </div>
  );
};

export default DashboardSummary;
