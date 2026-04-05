-- =============================================================================
-- Enable Row Level Security (RLS) on Files Table
-- =============================================================================
-- This script enables RLS on the files table and creates appropriate policies

-- 1. Enable RLS on files table
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- 2. Create policy: Anyone can read files (they'll verify password/limits in backend)
-- This allows the share link flow to work for public file access
CREATE POLICY "Public read access" ON files
    AS PERMISSIVE
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 3. Create policy: Nobody else can insert/update/delete (only backend with service role)
CREATE POLICY "Prevent direct inserts" ON files
    AS RESTRICTIVE
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (false);

CREATE POLICY "Prevent direct updates" ON files
    AS RESTRICTIVE
    FOR UPDATE
    TO anon, authenticated
    WITH CHECK (false);

CREATE POLICY "Prevent direct deletes" ON files
    AS RESTRICTIVE
    FOR DELETE
    TO anon, authenticated
    USING (false);

-- 5. Also enable RLS on access_logs (activity log table)
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for access_logs (similar structure)
CREATE POLICY "Public read access" ON access_logs
    AS PERMISSIVE
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Prevent direct inserts" ON access_logs
    AS RESTRICTIVE
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (false);

CREATE POLICY "Prevent direct updates" ON access_logs
    AS RESTRICTIVE
    FOR UPDATE
    TO anon, authenticated
    WITH CHECK (false);

CREATE POLICY "Prevent direct deletes" ON access_logs
    AS RESTRICTIVE
    FOR DELETE
    TO anon, authenticated
    USING (false);

-- =============================================================================
-- Result:
-- - Files table: Protected by RLS, backend can do anything via service role,
--   frontend can READ to support share link downloads, but cannot INSERT/UPDATE/DELETE
-- - All write operations go through backend API only
-- - Activity logs: Same protection - reads enabled, writes blocked for non-service roles
-- =============================================================================
