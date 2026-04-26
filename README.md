# 🔐 CipherSend

A modern, secure file transfer platform designed to enable users to share files safely over the internet with **end-to-end encryption**, strong authentication, and complete access control.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with FastAPI + React](https://img.shields.io/badge/Built%20with-FastAPI%20%2B%20React-blue.svg)](https://fastapi.tiangolo.com/)

---

## ✨ Features

### 🔒 Security First

- **AES-256 Encryption**: End-to-end encryption for all files
- **Secure Hashing**: SHA-256 integrity verification
- **Access Control**: Password-protected file downloads
- **Temporary Links**: Files expire after configurable time period
- **Download Limits**: Set maximum downloads before file deletion
- **Activity Logging**: Complete audit trail of file access

### 🚀 User-Friendly Interface

- **Modern React UI**: Built with Tailwind CSS for responsive design
- **Drag-and-Drop Upload**: Easy file uploading experience
- **QR Code Support**: Share files via QR codes
- **Real-time Analytics**: View upload/download statistics
- **File Management**: Track and manage shared files

### ⚙️ Developer-Friendly

- **RESTful API**: Clean, well-documented endpoints
- **FastAPI Backend**: High-performance Python framework
- **Supabase Integration**: Serverless database and storage
- **Environment Configuration**: Easy setup with .env files
- **Docker Ready**: Containerized deployment support

---

## 🛠️ Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **Supabase** - PostgreSQL database + object storage
- **AES Encryption** - Cryptography library
- **Bcrypt** - Password hashing

### Frontend

- **React 19** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend build tool
- **Chart.js** - Data visualization
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

---

## 📋 Prerequisites

- **Python 3.8+** - Backend runtime
- **Node.js 16+** - Frontend build tool & npm
- **Supabase Account** - Free tier available at [supabase.com](https://supabase.com)
- **Git** - Version control

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/CipherSend.git
cd CipherSend
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Backend

Create `backend/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-secret-key
SUPABASE_STORAGE_BUCKET=encrypted-files

# Encryption
AES_SECRET_KEY=your-32-byte-hex-key

# Security
JWT_SECRET=your-super-secure-jwt-secret-key

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

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Run Application

**Terminal 1 - Backend:**

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```
CipherSend/
├── backend/                       # FastAPI Backend
│   ├── app/
│   │   ├── api/                  # Route handlers
│   │   │   ├── upload.py         # File upload endpoint
│   │   │   ├── download.py       # File download endpoint
│   │   │   ├── verify.py         # Password verification
│   │   │   └── health.py         # Health check
│   │   ├── core/                 # Core logic
│   │   │   ├── encryption.py     # AES-256-GCM encryption
│   │   │   ├── security.py       # Password hashing
│   │   │   └── config.py         # Configuration management
│   │   ├── models/               # Data models
│   │   ├── services/             # Business logic
│   │   └── main.py               # FastAPI app entry
│   ├── requirements.txt           # Python dependencies
│   └── verify_db.py              # Database verification
│
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── charts/           # Analytics components
│   │   │   └── ui/               # UI components
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Download.jsx
│   │   │   └── Analytics.jsx
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities
│   │   └── main.jsx              # Entry point
│   ├── package.json              # npm dependencies
│   └── vite.config.js            # Vite configuration
│
├── prd.md                         # Product Requirements Document
└── README.md                      # This file
```

---

## 🔌 API Endpoints

### Health Check

```
GET /api/v1/health
```

### Upload File

```
POST /api/v1/upload
Content-Type: multipart/form-data

Request:
- file: <binary>
- password: <string> (optional)
- expires_in_hours: <integer> (default: 24)
- max_downloads: <integer> (default: 10)

Response:
{
  "file_id": "abc123",
  "share_link": "http://localhost:5173/download/abc123",
  "expires_at": "2026-04-27T10:00:00",
  "max_downloads": 10
}
```

### Download File

```
GET /api/v1/download/{file_id}?password=<optional>

Response: Binary file content
```

### Verify Password

```
POST /api/v1/verify-password
{
  "file_id": "abc123",
  "password": "user_password"
}

Response:
{
  "valid": true,
  "access_token": "jwt_token"
}
```

---

## 🔐 Security Features

### Encryption

- **AES-256-GCM**: Industry-standard symmetric encryption
- **Key Generation**: Secure random key generation per file
- **Integrity**: HMAC verification prevents tampering

### Authentication

- **Bcrypt Hashing**: Password hashing with salt
- **JWT Tokens**: Stateless authentication
- **HTTPS/TLS**: Secure transport layer

### Access Control

- **File Expiry**: Automatic deletion after configured time
- **Download Limits**: Prevent unlimited access
- **Password Protection**: Optional password for downloads
- **Access Logging**: Track all file access events

---

## 📊 Analytics Dashboard

Monitor your file sharing activity with:

- **Upload Statistics**: Track uploads over time
- **Download Statistics**: View download patterns
- **Storage Usage**: Monitor storage consumption
- **Top Files**: See most downloaded files
- **Activity Timeline**: Complete access history

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact & Support

For questions, bug reports, or feature requests, please open an issue on GitHub.

---

## Research & References

This project is informed by current security research and best practices:

- **[Research Paper: Secure File Transfer Protocols](https://drive.google.com/file/d/13J2XHsZdzpnXc9Cfj5RpLKLE2cuwjmbh/view?usp=drive_link)** - Comprehensive analysis of encryption and secure data transfer methodologies

---

## Acknowledgments

Built with modern web technologies and security best practices.
