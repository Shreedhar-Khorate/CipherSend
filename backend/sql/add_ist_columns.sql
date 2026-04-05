-- =============================================================================
-- Add Indian Standard Time (IST) Columns to Files and Access Logs Tables
-- =============================================================================
-- Adds computed columns that automatically convert UTC timestamps to IST (UTC+5:30)

-- 1. Add IST column to files table
ALTER TABLE files 
ADD COLUMN created_at_ist TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
  created_at AT TIME ZONE 'Asia/Kolkata'
) STORED;

-- 2. Add IST column to access_logs table
ALTER TABLE access_logs 
ADD COLUMN timestamp_ist TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
  timestamp AT TIME ZONE 'Asia/Kolkata'
) STORED;

-- =============================================================================
-- Result:
-- - Files table: created_at_ist column now shows time in India timezone
--   Example: 2026-04-05 15:30:00+05:30 (IST is UTC+5:30)
-- - Access logs: timestamp_ist shows activity logs in India time
-- - These are GENERATED ALWAYS AS STORED, so they update automatically
-- - In code, you can now access file.created_at_ist to get IST formatted time
-- - Format: YYYY-MM-DD HH:MM:SS (e.g., 2026-04-05 15:30:00)
-- =============================================================================

-- Optional: If you want to DROP these columns later, use:
-- ALTER TABLE files DROP COLUMN created_at_ist;
-- ALTER TABLE access_logs DROP COLUMN timestamp_ist;
