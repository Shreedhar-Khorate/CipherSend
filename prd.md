
# 🔐 CipherSend — Product Requirements Document (PRD)

## 1. Product Overview

**CipherSend** is a modern **secure file transfer platform** designed to enable users to share files safely over the internet while ensuring **confidentiality, integrity, and controlled access**.

The platform leverages **strong encryption, secure authentication, and modern cryptographic hashing algorithms** to protect files during transmission and storage.

CipherSend is built for scenarios where **data security and privacy are critical**, such as:

* Academic environments
* Corporate file exchange
* Secure document sharing
* Confidential data transmission

The system ensures that files remain **protected against interception, tampering, and unauthorized access**.

---

# 2. Problem Statement

Traditional file sharing systems suffer from several security issues:

* Files transmitted without encryption
* Vulnerability to **man-in-the-middle attacks**
* Lack of **data integrity verification**
* Unauthorized access to shared files
* Poor access control and auditing

CipherSend solves these problems by implementing **modern cryptographic protocols and secure architecture**.

---

# 3. Product Goals

### Primary Goals

* Enable **secure file sharing across networks**
* Protect files using **end-to-end encryption**
* Prevent unauthorized access to files
* Ensure **data integrity using cryptographic hashing**
* Provide **temporary secure links for sharing**

### Secondary Goals

* Provide a **fast and intuitive user interface**
* Enable **secure authentication**
* Ensure **scalability and cloud deployment**

---

# 4. Target Users

| User Type     | Use Case                      |
| ------------- | ----------------------------- |
| Students      | Securely submit assignments   |
| Professionals | Share confidential documents  |
| Teams         | Secure internal file exchange |
| Researchers   | Transfer sensitive datasets   |

---

# 5. Core Features

## 5.1 Secure File Upload

Users can upload files which are automatically:

* **Encrypted before storage**
* Assigned a **unique secure identifier**
* Stored securely in cloud storage

Supported files include:

* Documents
* Images
* Videos
* Archives
* Code files

---

# 5.2 End-to-End Encryption

CipherSend ensures **end-to-end security** using modern encryption standards.

Encryption Process:

1. File is encrypted using **AES-256 symmetric encryption**
2. Encryption keys are generated securely
3. Secure transmission via **HTTPS/TLS**
4. Only authorized users can decrypt the file

Benefits:

* Prevents data interception
* Protects files even if storage is compromised

---

# 5.3 File Integrity Verification

To ensure files are not altered during transfer, CipherSend uses:

**SHA-256 hashing**

Process:

1. Hash generated when file is uploaded
2. Hash stored in database
3. When downloaded, file hash is rechecked
4. If mismatch occurs → file flagged as corrupted

Benefits:

* Detects tampering
* Guarantees data integrity

---

# 5.4 Secure Shareable Links

After upload, users receive a **secure sharing link**.

Example:

```
https://ciphersend.app/share/8fj39skd92
```

Features:

* Unique link ID
* Expiration timer
* Optional password protection
* Limited download attempts

---

# 5.5 Password Protected Files

Users can optionally add **additional password protection**.

Security Process:

* Password hashed using **bcrypt**
* Stored securely
* Required before file download

---

# 5.6 Temporary File Expiry

Files automatically delete after:

* 24 hours
* 7 days
* Custom expiration time

Benefits:

* Reduces storage
* Improves security

---

# 5.7 Secure Download Process

When downloading a file:

1. Access link validation
2. Password verification (if enabled)
3. Integrity check using SHA-256
4. File decrypted
5. File sent to user

---

# 5.8 Activity Logging

System logs important events:

* File uploads
* File downloads
* Failed authentication attempts
* Expired file deletions

Benefits:

* Security monitoring
* Audit tracking

---

# 6. Advanced Security Features

CipherSend integrates modern security mechanisms:

### AES-256 Encryption

For encrypting files before storage.

### SHA-256 Hashing

Ensures file integrity.

### TLS Encryption

All network traffic secured using **HTTPS/TLS**.

### Secure Key Management

Encryption keys handled securely in backend environment.

### Rate Limiting

Prevents brute-force attacks on file links.

### Input Validation

Prevents injection attacks.

---

# 7. System Architecture

```
User
  │
  ▼
Frontend (React + Vite + Tailwind)
  │
  ▼
API Gateway (FastAPI)
  │
  ├── Encryption Service
  ├── File Upload Service
  ├── Authentication Service
  │
  ▼
Supabase Database + Storage
```

---

# 8. Tech Stack

## Frontend

* **React**
* **Vite**
* **Tailwind CSS**
* Axios (API communication)
* React Router

Features:

* Responsive UI
* Secure file upload interface
* Link generation dashboard

---

## Backend

**FastAPI**

Responsibilities:

* API endpoints
* Encryption handling
* File management
* Authentication
* Hash verification

Libraries:

* PyCryptodome
* Passlib (bcrypt)
* FastAPI security modules

---

## Database

**Supabase**

Used for:

* File metadata
* User authentication
* Link tracking
* Activity logs

Storage handled via:

* Supabase Storage buckets

---

# 9. API Endpoints

### Upload File

```
POST /api/upload
```

Uploads and encrypts file.

---

### Generate Share Link

```
POST /api/generate-link
```

Creates secure access link.

---

### Download File

```
GET /api/download/{file_id}
```

Verifies permissions and decrypts file.

---

### Verify Password

```
POST /api/verify-password
```

Validates protected file access.

---

# 10. Database Schema

### Files Table

| Field          | Type      |
| -------------- | --------- |
| file_id        | UUID      |
| file_name      | Text      |
| encrypted_path | Text      |
| hash_value     | Text      |
| upload_date    | Timestamp |
| expiry_date    | Timestamp |

---

### Share Links Table

| Field         | Type      |
| ------------- | --------- |
| link_id       | UUID      |
| file_id       | UUID      |
| password_hash | Text      |
| max_downloads | Integer   |
| expiry_time   | Timestamp |

---

# 11. Deployment Architecture

Frontend deployed on:

**Vercel**

Benefits:

* Fast CDN
* Edge delivery
* Automatic builds

Backend deployed on:

**Render**

Benefits:

* Python-friendly deployment
* Scalable backend hosting

Database & Storage:

**Supabase**

Benefits:

* Managed PostgreSQL
* Built-in authentication
* Secure file storage

---

# 12. Performance Considerations

* Chunked file uploads
* Compression for large files
* CDN delivery via Vercel
* Asynchronous FastAPI processing

---

# 13. Security Considerations

CipherSend protects against:

| Threat              | Protection               |
| ------------------- | ------------------------ |
| Data interception   | TLS encryption           |
| Unauthorized access | Secure links + passwords |
| Data tampering      | SHA-256 hashing          |
| Brute force attacks | Rate limiting            |
| Data leakage        | Encrypted storage        |

---

# 14. Future Enhancements

Possible improvements:

* End-to-End Client Side Encryption
* Drag & Drop Upload UI
* QR Code File Sharing
* Multi-user collaboration
* Secure messaging with file transfer
* File preview support
* Blockchain based integrity verification

---

# 15. Success Metrics

Project success will be evaluated based on:

* Upload and download success rate
* File transfer speed
* Security audit results
* User experience feedback

---

# 16. Conclusion

CipherSend provides a **modern secure alternative to traditional file sharing systems** by integrating **advanced encryption, secure authentication, and integrity verification mechanisms**.

By leveraging **React, FastAPI, Supabase, and modern cryptographic techniques**, CipherSend ensures that files are **transferred safely, efficiently, and privately across networks**.
