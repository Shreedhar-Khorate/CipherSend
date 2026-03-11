CipherSend Backend Specification
Overview

CipherSend backend is responsible for handling all secure file transfer operations, including:

File encryption before storage

Secure file uploads

Generating shareable links

Password protection

File integrity verification

Expiry and download limits

Secure file decryption during download

The backend exposes a REST API built with FastAPI and integrates with Supabase PostgreSQL and Storage.

Security is the primary focus, implementing modern cryptographic techniques such as:

AES-256 encryption

SHA-256 hashing

bcrypt password hashing

Secure tokenized links

Tech Stack
Technology	Purpose
FastAPI	Backend API framework
Python 3.11+	Programming language
Supabase PostgreSQL	Database
Supabase Storage	File storage
PyCryptodome	AES encryption
Passlib (bcrypt)	Password hashing
python-multipart	File upload support
Uvicorn	ASGI server
Pydantic	Data validation
python-dotenv	Environment variables
Project Structure
backend/
│
├── app/
│
│   ├── api/
│   │   ├── upload.py
│   │   ├── download.py
│   │   ├── verify.py
│   │   └── health.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── encryption.py
│   │
│   ├── models/
│   │   └── file_model.py
│   │
│   ├── services/
│   │   ├── file_service.py
│   │   ├── hash_service.py
│   │   └── storage_service.py
│   │
│   ├── utils/
│   │   └── helpers.py
│   │
│   └── main.py
│
├── requirements.txt
├── .env
└── backend.md
Environment Variables

Create .env file inside /backend.

Example:

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key

# Encryption
AES_SECRET_KEY=your_super_secure_aes_key_32bytes
HASH_ALGORITHM=SHA256

# Security
JWT_SECRET=super_secret_key
PASSWORD_HASH_SCHEME=bcrypt

# File Settings
MAX_FILE_SIZE_MB=100
DEFAULT_EXPIRY_HOURS=24
MAX_DOWNLOAD_LIMIT=10

# App
APP_NAME=CipherSend API
ENVIRONMENT=development
Requirements

requirements.txt

fastapi
uvicorn
python-multipart
python-dotenv
passlib[bcrypt]
pycryptodome
pydantic
supabase

Install dependencies:

pip install -r requirements.txt
Core Security Mechanisms
AES-256 Encryption

Files are encrypted before being stored.

Encryption mode:

AES-256 GCM

Benefits:

Authenticated encryption

Confidentiality

Integrity protection

Encryption process:

Generate random IV

Encrypt file using AES

Store encrypted file

Store metadata in database

SHA-256 File Integrity

When a file is uploaded:

SHA-256 hash generated

Hash stored in database

When downloaded:

File hash recalculated

Compared with stored hash

If mismatch occurs → download blocked.

Password Protection

If user enables password:

Password hashed using bcrypt

Stored in database

Verified before download

Database Schema

Using Supabase PostgreSQL

Table: files
Column	Type
id	UUID
file_name	TEXT
storage_path	TEXT
file_size	INTEGER
hash_sha256	TEXT
password_hash	TEXT
download_limit	INTEGER
downloads	INTEGER
expiry_time	TIMESTAMP
created_at	TIMESTAMP
Storage

Files stored in:

supabase storage bucket: encrypted-files

Stored format:

encrypted_<uuid>.bin
API Endpoints

Base URL:

/api/v1
1 Health Check

Endpoint:

GET /api/v1/health

Response:

{
 "status": "ok",
 "service": "CipherSend API"
}
2 Upload File

Endpoint:

POST /api/v1/upload

Form Data:

Field	Type
file	File
password	Optional string
expiry_hours	Optional integer
download_limit	Optional integer

Process:

Validate file size

Generate file UUID

Compute SHA-256 hash

Encrypt file

Upload to Supabase storage

Save metadata to database

Return share link

Response:

{
 "file_id": "uuid",
 "share_link": "/share/uuid"
}
3 Download File

Endpoint:

GET /api/v1/download/{file_id}

Process:

Validate file exists

Check expiry

Check download limit

Verify password if required

Download encrypted file

Decrypt file

Verify SHA-256 integrity

Return file

Response:

Binary file stream.

4 Verify Password

Endpoint:

POST /api/v1/verify-password

Body:

{
 "file_id": "uuid",
 "password": "string"
}

Response:

{
 "valid": true
}
Encryption Service

Location:

app/core/encryption.py

Responsibilities:

AES encryption

AES decryption

Methods:

encrypt_file(file_bytes)
decrypt_file(encrypted_bytes)
Hash Service

Location:

app/services/hash_service.py

Responsibilities:

Generate SHA-256 hash.

Example:

hash_file(file_bytes)
File Service

Location:

app/services/file_service.py

Handles:

upload logic

download validation

expiry checks

download counter

Storage Service

Location:

app/services/storage_service.py

Handles:

upload encrypted files to Supabase

retrieve files

Expiry System

Files automatically expire after:

expiry_time < current_time

Expired files return:

410 Gone
Download Limits

Each file tracks:

downloads
download_limit

If exceeded:

403 Forbidden
Rate Limiting (Recommended)

Protect endpoints from abuse.

Example limit:

100 requests per minute per IP

Library recommendation:

slowapi
CORS Configuration

Allow frontend access.

Example:

http://localhost:5173
https://ciphersend.vercel.app
Running the Backend

Start development server:

uvicorn app.main:app --reload

Server runs on:

http://localhost:8000

API docs available at:

http://localhost:8000/docs
Deployment
Backend Hosting

Recommended:

Render

or

Railway

Start command:

uvicorn app.main:app --host 0.0.0.0 --port 10000
Security Best Practices

Implemented protections:

Threat	Protection
Man-in-the-middle	HTTPS
Data theft	AES-256 encryption
File tampering	SHA-256 verification
Brute force	Rate limiting
Unauthorized access	Password protection
Expired links	Expiry validation
Future Backend Enhancements

Possible improvements:

End-to-End client-side encryption

File chunking for large uploads

Virus scanning

WebSocket upload progress

Secure audit logs

Public/private sharing modes

Goal

The CipherSend backend must provide a secure, scalable, and reliable file transfer system that ensures:

Confidentiality

Integrity

Controlled access

Secure sharing

while remaining fast, modern, and production ready.