# CipherSend - Analytics Dashboard Setup

This document explains how to set up and use the new real-time analytics dashboard with Chart.js.

## What's New

### Backend API Endpoints (`/api/v1/charts/`)

- `GET /charts/upload-stats` - Daily file upload statistics
- `GET /charts/storage-stats` - Cumulative storage usage over time
- `GET /charts/download-stats` - Daily download activity
- `GET /charts/top-files` - Most downloaded files
- `GET /charts/summary` - Quick summary statistics

### Frontend Components

- **Analytics Page** - Full dashboard at `/analytics`
- **DashboardSummary** - Summary stats cards (total files, storage, downloads, avg file size)
- **UploadStatsChart** - Line chart of daily uploads
- **StorageStatsChart** - Area chart of cumulative storage
- **DownloadStatsChart** - Bar chart of daily downloads
- **TopFilesChart** - Horizontal bar chart of most downloaded files

## Configuration

### Backend (Python)

No additional configuration needed. The charts API automatically queries your Supabase database.

### Frontend (React)

1. Create a `.env.local` file in the frontend directory (optional):

```
VITE_API_URL=http://localhost:8000/api/v1
```

2. If not set, it defaults to: `http://localhost:8000/api/v1`

For production, update to your deployed backend URL:

```
VITE_API_URL=https://your-backend-domain.com/api/v1
```

## Features

### Real-Time Updates

- Charts automatically refresh every 30 seconds
- Summary stats update in real-time
- No manual refresh needed

### Time Range Selection

- View analytics for 7, 14, 30, 60, or 90 day periods
- Charts automatically update when you change the time range

### Database Integration

- All data fetched directly from Supabase
- No caching - always shows live data
- Supports all active files in your database

## Usage

### Access the Analytics Dashboard

1. Click "Analytics" in the navbar
2. Select your desired time range (7, 14, 30, 60, or 90 days)
3. View real-time statistics and charts

### Charts Explained

#### Upload Stats

- **Type**: Line chart
- **Shows**: Number of files uploaded each day
- **Use Case**: Track upload trends and activity patterns

#### Storage Usage

- **Type**: Area chart
- **Shows**: Cumulative MB used over time
- **Use Case**: Monitor storage growth and capacity planning

#### Download Activity

- **Type**: Bar chart
- **Shows**: Total downloads per day
- **Use Case**: Understand usage patterns and peak times

#### Top Files

- **Type**: Horizontal bar chart
- **Shows**: Most downloaded files with counts
- **Use Case**: Identify popular files and shared content

#### Summary Stats

- **Total Files**: Number of active files in system
- **Storage Used**: Total MB consumed
- **Total Downloads**: Cumulative downloads across all files
- **Avg File Size**: Average size of uploaded files

## Technical Details

### Backend Architecture

```
backend/app/api/charts.py
├── /charts/upload-stats     (daily upload counts)
├── /charts/storage-stats    (cumulative storage)
├── /charts/download-stats   (daily downloads)
├── /charts/top-files        (ranked by downloads)
└── /charts/summary          (quick stats)
```

### Frontend Architecture

```
frontend/src/
├── components/charts/
│   ├── ChartCard.jsx           (reusable wrapper)
│   ├── UploadStatsChart.jsx    (line chart)
│   ├── StorageStatsChart.jsx   (area chart)
│   ├── DownloadStatsChart.jsx  (bar chart)
│   ├── TopFilesChart.jsx       (horizontal bar)
│   └── DashboardSummary.jsx    (stats cards)
└── pages/
    └── Analytics.jsx           (main dashboard page)
```

### Chart.js Integration

- Using `react-chartjs-2` for React components
- Chart.js v4.5.1 for rendering
- Responsive design with Tailwind CSS
- Real-time data fetching with React hooks

## Database Queries

The analytics endpoints perform light queries on the `files` table:

- Selects: `id, file_name, file_size, downloads, created_at, download_limit`
- Filters: By date range (created_at)
- Sorting: By download count (top files) and date

## Performance Considerations

- Chart data is computed on-the-fly from latest DB state
- No aggregation tables required
- Lightweight queries suitable for production use
- 30-second refresh interval balances freshness with performance

## Troubleshooting

### Charts not loading?

1. Check browser console for errors
2. Verify backend API is running
3. Check VITE_API_URL is correctly configured
4. Ensure CORS is enabled on backend

### API returning 500 errors?

1. Check database connection
2. Verify Supabase credentials
3. Ensure `files` table exists and has data
4. Check backend logs

### Charts showing no data?

1. Upload some files first (charts need data)
2. Ensure files have `created_at` timestamps
3. Check selected time range is correct
4. Wait for chart refresh (30 seconds)

## Future Enhancements

Possible improvements:

- Export charts as PDF/PNG
- Custom date range picker
- Hourly data granularity
- Download history by user
- File type analytics
- Encryption overhead stats
