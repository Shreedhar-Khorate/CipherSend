# 🔐 CipherSend - Complete Project Structure & Configuration

Comprehensive overview of the entire project including all files, configurations, and environment setup.

---

## 📂 Project Directory Tree

```
CipherSend/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules (includes .env files)
├── LICENSE                        # Project license
├── README.md                      # Project README
├── prd.md                         # Product Requirements Document
├── ENV_SETUP_GUIDE.md            # Environment setup instructions
│
├── backend/                       # Python FastAPI Backend
│   ├── .env                       # Backend environment variables (SECRET)
│   ├── .env.example               # Backend environment template
│   ├── requirements.txt           # Python dependencies
│   ├── backend.md                 # Backend documentation
│   ├── DATABASE_SCHEMA.md         # Database table structures
│   │
│   └── app/
│       ├── __init__.py
│       ├── main.py                # FastAPI application entry point
│       │
│       ├── api/                   # API Route Handlers
│       │   ├── __init__.py
│       │   ├── download.py        # GET /download/{file_id}
│       │   ├── upload.py          # POST /upload
│       │   ├── verify.py          # POST /verify-password
│       │   └── health.py          # GET /health
│       │
│       ├── core/                  # Core Application Logic
│       │   ├── __init__.py
│       │   ├── config.py          # Pydantic Settings (loads .env)
│       │   ├── encryption.py      # AES-256-GCM encryption/decryption
│       │   └── security.py        # Password hashing (bcrypt)
│       │
│       ├── models/                # Pydantic Models (Serialization)
│       │   ├── __init__.py
│       │   └── file_model.py      # FileRecord, UploadResponse, etc.
│       │
│       ├── services/              # Business Logic Services
│       │   ├── __init__.py
│       │   ├── file_service.py    # Upload/download pipeline
│       │   ├── hash_service.py    # SHA-256 integrity verification
│       │   └── storage_service.py # Supabase Storage interaction
│       │
│       ├── utils/                 # Utility Functions
│       │   ├── __init__.py
│       │   └── helpers.py         # Common helper functions
│       │
│       └── __pycache__/           # Python cache (ignored)
│
├── frontend/                      # React + Vite Frontend
│   ├── .env                       # Frontend environment variables (semi-safe)
│   ├── .env.example               # Frontend environment template
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js             # Vite bundler configuration
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── postcss.config.js          # PostCSS configuration
│   ├── eslint.config.js           # ESLint configuration
│   ├── index.html                 # HTML entry point
│   ├── frontend.md                # Frontend documentation
│   ├── front-prompt.md            # Frontend prompts/instructions
│   │
│   └── src/
│       ├── main.jsx               # React root (renders App into #root)
│       ├── App.jsx                # Main App component (routes)
│       ├── App.css                # App styles
│       ├── index.css              # Global styles
│       │
│       ├── assets/                # Images, icons, static assets
│       │
│       ├── components/            # Reusable React Components
│       │   ├── Navbar.jsx         # Navigation bar
│       │   ├── FileUpload.jsx     # File upload component
│       │   ├── FileCard.jsx       # File card display
│       │   ├── CopyLinkButton.jsx # Copy link button
│       │   ├── CipherSendLogo.jsx # Logo component
│       │   ├── SecurityBadge.jsx  # Security badge
│       │   │
│       │   └── ui/                # Shadcn UI Components
│       │       ├── button.jsx
│       │       ├── input.jsx
│       │       ├── progress.jsx
│       │       ├── select.jsx
│       │       ├── switch.jsx
│       │       ├── toast.jsx
│       │       ├── toaster.jsx
│       │       ├── tooltip.jsx
│       │       └── sonner.jsx
│       │
│       ├── pages/                 # Page Components (Routes)
│       │   ├── Home.jsx           # Home page (/)
│       │   ├── Upload.jsx         # Upload page (/upload)
│       │   ├── Share.jsx          # Share page (/share/:fileId)
│       │   ├── Download.jsx       # Download page (/download/:fileId)
│       │   ├── Error.jsx          # Error page (/error)
│       │   └── NotFound.jsx       # 404 page
│       │
│       ├── hooks/                 # Custom React Hooks
│       │   └── use-toast.js       # Toast notification hook
│       │
│       └── lib/                   # Utility Libraries
│           └── utils.js           # Helper functions
│
└── node_modules/                  # Node dependencies (gitignored)
    public/                        # Static files
```

---

## ⚙️ Backend Configuration (.env)

**File**: `backend/.env`

```env
# =========================
# SUPABASE CONFIGURATION
# =========================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key_here
SUPABASE_STORAGE_BUCKET=encrypted-files

# =========================
# ENCRYPTION (AES-256-GCM)
# =========================
AES_SECRET_KEY=a7f3c9e2b1d4f6a8e9c2d1f4a7b3c6e9f2a5d8b1c4e7f0a3d6c9f1e4b7a0d3

# =========================
# AUTHENTICATION & SECURITY
# =========================
JWT_SECRET=your_super_secure_jwt_secret_key_change_me_in_production
PASSWORD_HASH_SCHEME=bcrypt

# =========================
# FILE MANAGEMENT
# =========================
MAX_FILE_SIZE_MB=100
DEFAULT_EXPIRY_HOURS=24
MAX_DOWNLOAD_LIMIT=10

# =========================
# APPLICATION CONFIG
# =========================
APP_NAME=CipherSend API
ENVIRONMENT=development
DEBUG=False
BASE_URL=http://localhost:8000
API_PREFIX=/api/v1
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# =========================
# LOGGING
# =========================
LOG_LEVEL=INFO
```

### Backend Settings Explanation

| Variable                  | Value                            | Purpose                            |
| ------------------------- | -------------------------------- | ---------------------------------- |
| `SUPABASE_URL`            | https://your-project.supabase.co | Supabase project endpoint          |
| `SUPABASE_KEY`            | service_role_key                 | Backend-only service role (SECRET) |
| `SUPABASE_STORAGE_BUCKET` | encrypted-files                  | Storage bucket name for files      |
| `AES_SECRET_KEY`          | 64-char hex string               | 256-bit encryption key (CRITICAL)  |
| `JWT_SECRET`              | Random string                    | JWT signing secret (CRITICAL)      |
| `PASSWORD_HASH_SCHEME`    | bcrypt                           | Password hashing algorithm         |
| `MAX_FILE_SIZE_MB`        | 100                              | Max upload file size               |
| `DEFAULT_EXPIRY_HOURS`    | 24                               | Default file expiry                |
| `MAX_DOWNLOAD_LIMIT`      | 10                               | Max downloads per file             |
| `APP_NAME`                | CipherSend API                   | API name in docs                   |
| `ENVIRONMENT`             | development                      | dev/staging/production             |
| `DEBUG`                   | False                            | FastAPI debug mode                 |
| `BASE_URL`                | http://localhost:8000            | Backend URL for links              |
| `API_PREFIX`              | /api/v1                          | API version prefix                 |
| `ALLOWED_ORIGINS`         | localhost ports                  | CORS allowed origins               |
| `LOG_LEVEL`               | INFO                             | Logging verbosity                  |

---

## 🎨 Frontend Configuration (.env)

**File**: `frontend/.env`

```env
# =========================
# SUPABASE CONFIGURATION (FRONTEND - SAFE)
# =========================
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_STORAGE_BUCKET=cipher-files

# =========================
# BACKEND API CONFIGURATION
# =========================
VITE_API_BASE_URL=http://localhost:8000/api/v1

# =========================
# APPLICATION CONFIGURATION
# =========================
VITE_APP_NAME=CipherSend
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE_MB=100
VITE_ENABLE_ANALYTICS=false
VITE_ENVIRONMENT=development
```

### Frontend Settings Explanation

| Variable                       | Value                            | Purpose                         |
| ------------------------------ | -------------------------------- | ------------------------------- |
| `VITE_SUPABASE_URL`            | https://your-project.supabase.co | Supabase endpoint (public safe) |
| `VITE_SUPABASE_ANON_KEY`       | anon_public_key                  | Supabase public key (safe)      |
| `VITE_SUPABASE_STORAGE_BUCKET` | cipher-files                     | Storage bucket for downloads    |
| `VITE_API_BASE_URL`            | http://localhost:8000/api/v1     | Backend API endpoint            |
| `VITE_APP_NAME`                | CipherSend                       | Application name                |
| `VITE_APP_VERSION`             | 1.0.0                            | App version                     |
| `VITE_MAX_FILE_SIZE_MB`        | 100                              | Frontend file size limit        |
| `VITE_ENABLE_ANALYTICS`        | false                            | Analytics toggle                |
| `VITE_ENVIRONMENT`             | development                      | Environment type                |

### 🔴 CRITICAL: Frontend vs Backend Keys

**Frontend receives (SAFE TO EXPOSE)**:

- ✅ `VITE_SUPABASE_URL` - Project URL
- ✅ `VITE_SUPABASE_ANON_KEY` - Public anonymous key
- ✅ `VITE_API_BASE_URL` - Backend endpoint

**Frontend NEVER receives (SECRET)**:

- ❌ Service role key
- ❌ AES encryption key
- ❌ JWT secret
- ❌ Database credentials

---

## 📦 Backend Dependencies

**File**: `backend/requirements.txt`

```
fastapi                 # Web framework
uvicorn[standard]       # ASGI server
python-multipart        # File upload handling
python-dotenv           # Load .env files
pydantic                # Data validation
pydantic-settings       # Settings management
passlib[bcrypt]         # Password hashing
pycryptodome            # AES encryption
supabase                # Supabase client
slowapi                 # Rate limiting
```

---

## 📦 Frontend Dependencies

**File**: `frontend/package.json`

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^6.28.0",
    "react-dropzone": "^14.3.5",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.1",
    "class-variance-authority": "^0.7.1",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "vite": "^7.3.1",
    "@vitejs/plugin-react-swc": "^4.2.2",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.5.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.39.1"
  }
}
```

---

## 🔄 API Routes

### Backend Endpoints

| Method | Path                  | Purpose               | Authentication    |
| ------ | --------------------- | --------------------- | ----------------- |
| `GET`  | `/health`             | Health check          | None              |
| `POST` | `/upload`             | Upload & encrypt file | None              |
| `GET`  | `/files/{file_id}`    | Get file metadata     | None              |
| `GET`  | `/download/{file_id}` | Download & decrypt    | Optional password |
| `POST` | `/verify-password`    | Verify file password  | None              |

**API Prefix**: `/api/v1`

**Base URL**: `http://localhost:8000`

---

## 🗄️ Database Schema

**Table**: `files`

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  hash_sha256 TEXT NOT NULL,
  password_hash TEXT,
  encryption_key TEXT,
  download_limit INTEGER DEFAULT 10,
  downloads INTEGER DEFAULT 0,
  expiry_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns**:

- `id` - Unique file identifier
- `file_name` - Original filename
- `storage_path` - Path in Supabase Storage
- `file_size` - Size in bytes
- `hash_sha256` - SHA-256 integrity hash
- `password_hash` - Bcrypt hashed password (optional)
- `encryption_key` - Per-file AES key
- `download_limit` - Max downloads allowed
- `downloads` - Current download count
- `expiry_time` - When file expires
- `created_at` - Upload timestamp

---

## 🔐 Security Architecture

### Encryption Flow

**Upload**:

1. File received via HTTP POST
2. SHA-256 hash computed (integrity)
3. AES-256-GCM encryption applied
4. Encrypted file → Supabase Storage
5. Metadata → Supabase Database

**Download**:

1. Metadata fetched from database
2. Expiry & download limit verified
3. Password checked (if set)
4. Encrypted file retrieved from storage
5. AES-256-GCM decryption applied
6. SHA-256 hash verified
7. File streamed to user

### Encryption Keys

**AES Key Derivation**:

```
secret_key (from .env)
    ↓
SHA-256 hash
    ↓
32-byte AES-256 key
```

**Password Protection**:

- User password → hashed with bcrypt
- Hash stored in database
- Plain password sent via HTTPS header during download
- Verified before decryption allowed

---

## 🚀 Startup Checklist

### Backend Setup

```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Configure environment
cp backend/.env.example backend/.env
# Edit .env with Supabase credentials and keys

# 3. Run migrations (create database tables in Supabase)
# SQL script in DATABASE_SCHEMA.md

# 4. Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp frontend/.env.example frontend/.env
# Edit .env with Supabase and API endpoint

# 3. Start dev server
npm run dev
# Runs at http://localhost:5173
```

---

## 📊 Key Files Overview

### Backend Core Files

**`app/main.py`**

- FastAPI application setup
- CORS configuration
- Rate limiting setup
- Route registration

**`app/core/config.py`**

- Pydantic Settings
- Loads .env variables
- Configuration validation

**`app/core/encryption.py`**

- AES-256-GCM encryption/decryption
- Nonce + tag + ciphertext handling
- Key derivation from secret

**`app/core/security.py`**

- Password hashing (bcrypt)
- Password verification

**`app/services/file_service.py`**

- Upload pipeline orchestration
- Download pipeline orchestration
- Expiry/limit checks
- Password validation

### Frontend Core Files

**`src/main.jsx`**

- React DOM initialization
- Root component mounting

**`src/App.jsx`**

- BrowserRouter setup
- Route definitions
- Navigation structure

**`src/pages/Upload.jsx`**

- File upload interface
- Encryption options
- Link generation

**`src/pages/Download.jsx`**

- Download page UI
- Password input
- File info display

---

## 🧪 Testing

### Test Backend Health

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{ "status": "ok", "service": "CipherSend API" }
```

### Test Encryption Key

```bash
python3 -c "from app.core.config import get_settings; print(get_settings().aes_secret_key)"
```

Should output 64-character hex string.

---

## 📝 Environment Comparison

| Aspect              | Development           | Production                 |
| ------------------- | --------------------- | -------------------------- |
| `ENVIRONMENT`       | development           | production                 |
| `DEBUG`             | True                  | False                      |
| `BASE_URL`          | http://localhost:8000 | https://api.ciphersend.com |
| `VITE_API_BASE_URL` | http://localhost:8000 | https://api.ciphersend.com |
| `ALLOWED_ORIGINS`   | localhost:5173,3000   | https://ciphersend.com     |
| `LOG_LEVEL`         | DEBUG                 | WARNING                    |
| `docs_url`          | /docs                 | None                       |
| `redoc_url`         | /redoc                | None                       |

---

## 🔧 Configuration Files

### Vite Config (`frontend/vite.config.js`)

- React SWC plugin
- Development server setup
- Build optimization

### Tailwind Config (`frontend/tailwind.config.js`)

- Custom theme
- Typography utilities
- Animation configs

### ESLint Config (`frontend/eslint.config.js`)

- React linting rules
- Code quality checks

---

## 📋 Summary

| Component         | Status        | Details                                   |
| ----------------- | ------------- | ----------------------------------------- |
| **Backend**       | ✅ Ready      | FastAPI, Supabase integration, Encryption |
| **Frontend**      | ✅ Ready      | React, Vite, Tailwind                     |
| **Database**      | 📋 Pending    | SQL schema needs to be run in Supabase    |
| **Environment**   | ✅ Configured | .env files created with templates         |
| **Documentation** | ✅ Complete   | PRD, setup guides, code comments          |

---

## ⏭️ Next Steps

1. **Get Supabase Credentials**
   - Create project at supabase.com
   - Copy project URL and keys
   - Update .env files

2. **Create Database Tables**
   - Run SQL from DATABASE_SCHEMA.md
   - Create storage bucket

3. **Start Development**

   ```bash
   # Terminal 1: Backend
   cd backend && uvicorn app.main:app --reload

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

4. **Test Upload/Download**
   - Navigate to http://localhost:5173
   - Upload test file
   - Verify encryption/decryption

5. **Deploy**
   - Backend → Render
   - Frontend → Vercel
   - Database → Supabase (managed)
