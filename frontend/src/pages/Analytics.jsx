import React, { useState } from 'react';
import DashboardSummary from '../components/charts/DashboardSummary';
import UploadStatsChart from '../components/charts/UploadStatsChart';
import StorageStatsChart from '../components/charts/StorageStatsChart';
import DownloadStatsChart from '../components/charts/DownloadStatsChart';
import TopFilesChart from '../components/charts/TopFilesChart';

/**
 * Analytics Dashboard Page
 * Displays real-time charts and statistics about file uploads, downloads, and storage.
 */
const Analytics = () => {
  const [days, setDays] = useState(30);
  const [refreshInterval] = useState(30000); // 30 seconds

  return (
    <div className="min-h-screen bg-[hsl(222,47%,3%)] pt-16 bg-grid">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black sm:text-5xl text-gradient mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Real-time insights into your file transfer activity</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-sm font-semibold text-foreground">Time Period:</label>
          <div className="flex flex-wrap gap-2">
            {[7, 14, 30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  days === d
                    ? 'gradient-accent text-primary-foreground shadow-lg glow-green'
                    : 'border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <DashboardSummary refreshInterval={refreshInterval} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <UploadStatsChart days={days} refreshInterval={refreshInterval} />
          <StorageStatsChart days={days} refreshInterval={refreshInterval} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DownloadStatsChart days={days} refreshInterval={refreshInterval} />
          <TopFilesChart limit={5} refreshInterval={refreshInterval} />
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 gradient-card rounded-xl border border-border text-center">
          <p className="text-sm text-foreground">
            Charts update automatically every 30 seconds. 
            <span className="block mt-2 text-xs text-muted-foreground">
              All data is fetched in real-time from your Supabase database.
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
