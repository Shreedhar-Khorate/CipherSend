# 🔐 CipherSend - Setup & Database Configuration Guide

## Overview

CipherSend requires a Supabase database with two tables:
- **files** - Store encrypted file metadata
- **access_logs** - Log all file access activities

## Prerequisites

✅ **Supabase Account** - Get one at https://supabase.com  
✅ **Python 3.8+** - Backend runtime  
✅ **Node.js 16+** - Frontend build tool  

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Supabase

#### Get Your Supabase Credentials:
1. Go to https://supabase.com/dashboard
2. Create a new project
3. Go to **Settings → API**
4. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → Keep for reference (we use service_key in backend)
   - `service_role secret` → `SUPABASE_KEY`

### 3. Update `.env` File

Create/update `backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-secret-key
SUPABASE_STORAGE_BUCKET=encrypted-files

# Encryption
AES_SECRET_KEY=a7f3c9e2b1d4f6a8e9c2d1f4a7b3c6e9f2a5d8b1c4e7f0a3d6c9f1e4b7a0d3

# Security
JWT_SECRET=your_super_secure_jwt_secret_key_change_me_in_production

# File Management
MAX_FILE_SIZE_MB=100
DEFAULT_EXPIRY_HOURS=24
MAX_DOWNLOAD_LIMIT=10

# Application
APP_NAME=CipherSend API
ENVIRONMENT=development
DEBUG=False
BASE_URL=http://localhost:8000
API_PREFIX=/api/v1
```

### 4. Create Database Tables

Choose ONE of the following methods:

#### Option A: Using SQL Editor in Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy-paste contents of `backend/sql/00_create_tables.sql`
4. Click "Run" button

#### Option B: Using Verification Script

```bash
python backend/verify_db.py
```

### 5. Storage Bucket Setup

CipherSend uses Supabase Storage for encrypted files.

1. Go to **Supabase Dashboard → Storage**
2. Click **Create a new bucket**
3. Name: `encrypted-files`
4. Set to **Private** (important for security!)
5. Click **Create**

---

## Verification

### Test Database Connection

```bash
cd backend
python verify_db.py
```

This script will:
✅ Check environment variables  
✅ Test Supabase connection  
✅ Verify tables exist  
✅ Insert test data  
✅ Retrieve test data  
✅ Clean up  

### Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload
```

Visit: http://localhost:8000/docs (Swagger API docs)
Test endpoint: http://localhost:8000/api/v1/health/db

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create/update `frontend/.env`:

```env
# Supabase Configuration (Public/Anon key is safe here)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SUPABASE_STORAGE_BUCKET=encrypted-files

# Backend API
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Application
VITE_APP_NAME=CipherSend
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE_MB=100
VITE_ENVIRONMENT=development
```

### 3. Start Development Server

```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## Database Tables Structure

### `files` Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `file_name` | TEXT | Original filename |
| `file_size` | BIGINT | File size in bytes |
| `storage_path` | TEXT | Path in storage bucket |
| `hash_sha256` | TEXT | SHA-256 hash for integrity |
| `password_hash` | TEXT | Optional bcrypt hash |
| `encryption_key` | TEXT | Unique per-file encryption key |
| `download_limit` | INT | Max downloads allowed |
| `downloads` | INT | Current download count |
| `expiry_time` | TIMESTAMP | When file expires |
| `created_at` | TIMESTAMP | Upload timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### `access_logs` Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `file_id` | UUID | Reference to file |
| `event_type` | TEXT | 'upload', 'download', or 'failed_attempt' |
| `status` | TEXT | 'success' or 'failed' |
| `ip_address` | INET | Client IP address |
| `user_agent` | TEXT | Browser/client info |
| `attempt_count` | INT | Number of attempts |
| `created_at` | TIMESTAMP | Log timestamp |

---

## API Endpoints

### Upload File
```
POST /api/v1/upload
Content-Type: multipart/form-data

Body:
  - file: (binary file)
  - password: (optional string)
  - expiry_hours: (optional int, default 24)
  - download_limit: (optional int, default 10)

Response:
{
  "file_id": "uuid",
  "share_link": "/share/uuid"
}
```

### Download File
```
GET /api/v1/download/{file_id}
Headers:
  - X-File-Password: (optional password)

Response: (binary file)
```

### Get File Info
```
GET /api/v1/files/{file_id}

Response:
{
  "file_id": "uuid",
  "file_name": "filename",
  "file_size": 1024,
  "expiry_time": "ISO-8601 timestamp",
  "password_protected": boolean,
  "downloads": 5,
  "download_limit": 10
}
```

### Health Check
```
GET /api/v1/health
GET /api/v1/health/db  (includes database info)
```

---

## Troubleshooting

### ❌ "Database connection failed"

Check:
- ✅ SUPABASE_URL is correct and includes `https://`
- ✅ SUPABASE_KEY is the **service_role secret** (not anon key)
- ✅ Internet connection is working
- ✅ Supabase project is not paused

### ❌ "Table does not exist"

Run:
```bash
python backend/verify_db.py
```

Or manually run `backend/sql/00_create_tables.sql` in Supabase Dashboard.

### ❌ "Upload fails silently"

Check:
- ✅ Backend is running (`http://localhost:8000/docs`)
- ✅ Frontend `.env` has correct `VITE_API_BASE_URL`
- ✅ CORS is enabled (it is by default)
- ✅ Storage bucket `encrypted-files` exists and is private

### ❌ "502 Bad Gateway" on frontend

- Check backend is running: `http://localhost:8000/api/v1/health`
- Verify CORS middleware is configured
- Check browser console for CORS errors

---

## Security Checklist

Before Production:

- [ ] Change `AES_SECRET_KEY` to a random string
- [ ] Change `JWT_SECRET` to a random string
- [ ] Set `ENVIRONMENT=production`
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_ORIGINS` with your domain
- [ ] Use strong `SUPABASE_KEY` (service role)
- [ ] Enable RLS on tables (see `backend/sql/enable_rls.sql`)
- [ ] Backup Supabase regularly
- [ ] Enable HTTPS/TLS
- [ ] Monitor access logs for abuse

---

## Generate Secure Keys

```bash
# Generate AES key (256-bit = 64 hex chars):
python3 -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT secret:
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## Development Workflow

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database verification (optional)
cd backend
python verify_db.py
```

---

## Support

For issues:
1. Check logs in terminal where you started the backend
2. Run `python backend/verify_db.py` to diagnose database issues
3. Check Supabase Dashboard → Logs → Edge Functions
4. Review `.env` files for correct credentials

---

**Happy secure sharing! 🚀**
