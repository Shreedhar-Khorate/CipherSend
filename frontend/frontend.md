CipherSend Frontend Specification
Project Overview

CipherSend is a secure file transfer platform that enables users to upload, encrypt, and share files safely across networks.

The frontend is responsible for providing a modern, secure, and intuitive user interface that allows users to:

Upload files securely

Generate encrypted shareable links

Download files safely

Verify file integrity

Manage file access

The UI must be clean, modern, and security-focused, emphasizing trust and privacy.

Tech Stack

Frontend should be built using:

React

Vite

Tailwind CSS

React Router

Axios

Lucide Icons

Optional libraries:

React Dropzone (drag & drop uploads)

Framer Motion (animations)

UI Design Principles

The interface must follow these principles:

Security-first UI

Users must feel that the platform is secure.

Minimalist design

Simple and clean interface.

Fast interactions

Quick file upload and link generation.

Responsive layout

Must work on:

Desktop

Tablet

Mobile

Color Theme

Primary color palette:

Primary:

#0F172A

Secondary:

#1E293B

Accent (security highlight):

#22C55E

Warning:

#F59E0B

Background:

#020617

Text:

#E2E8F0

Style inspiration:

Modern SaaS dashboard

Cybersecurity tools

Developer platforms

Typography

Font recommendations:

Primary Font:

Inter

Fallback:

System UI

Font hierarchy:

Heading:
Bold

Subheading:
Medium

Body:
Regular

Pages

The frontend must include the following pages.

1. Home Page

Route:

/

Purpose:
Introduce the platform and guide users to upload files.

Components:

Hero Section

Title:

Secure File Sharing with CipherSend

Subtitle:

Send files safely using encryption and secure links.

Primary button:

Upload File

Secondary button:

Learn More

Features Section

Cards displaying:

End-to-End Encryption

Secure Shareable Links

File Integrity Verification

Temporary File Expiry

Footer

Links:

GitHub

Documentation

Privacy Policy

2. Upload Page

Route:

/upload

Purpose:

Allow users to upload files securely.

Components:

Drag & Drop Upload Box

Features:

Drag file

Click to upload

Show file preview

Show file size

File Security Options

Toggle options:

Enable password protection

Input field:

Enter file password

Set expiration

Dropdown:

24 hours
7 days
Custom

Set download limit

Input:

Max downloads

Upload Button

Text:

Encrypt & Upload File

Upload Progress

Progress bar while uploading.

3. Share Page

Route:

/share/:fileId

Purpose:

Display generated secure file link.

Components:

Success Message

File uploaded successfully

Secure Link Display

Example:

https://ciphersend.app/share/abc123

Buttons:

Copy Link

Generate QR Code

Share Options

Copy

Email

QR Code

Security Details

Display:

Encryption: AES-256

Integrity: SHA-256

4. Download Page

Route:

/download/:fileId

Purpose:

Allow users to securely download files.

Components:

File Details Card

Displays:

File name

File size

Upload date

Password Input (if protected)

Field:

Enter password to decrypt

Download Button

Text:

Decrypt & Download

Integrity Verification

Message:

Verifying file integrity...

Result:

File verified using SHA-256
5. Error Page

Route:

/error

Shows errors such as:

File expired

Invalid link

Download limit reached

Message example:

This file is no longer available.

Button:

Return Home
Components

Frontend must include reusable components.

Navbar

Contains:

Logo

Links:

Home

Upload

CTA button:

Upload File

FileUpload Component

Features:

Drag & drop upload

File preview

Upload progress

Security options

FileCard

Displays:

File name

Size

Upload date

Download button

SecurityBadge

Displays encryption information:

Example:

AES-256 Encrypted

CopyLinkButton

Copies generated share link to clipboard.

API Integration

Frontend communicates with FastAPI backend.

Base URL:

/api

Endpoints:

Upload file

POST /api/upload

Generate share link

POST /api/generate-link

Download file

GET /api/download/{file_id}

Verify password

POST /api/verify-password
UI States

Loading state

Example:

Uploading file...

Success state

File uploaded successfully

Error state

Upload failed. Please try again.
Accessibility

The interface must support:

Keyboard navigation

Screen readers

Accessible button labels

Performance Requirements

Lazy load pages.

Compress images.

Optimize bundle size.

Ensure fast load times.

Animations

Use subtle animations for:

Upload progress

Button hover

Page transitions

Suggested library:

Framer Motion

Folder Structure

Recommended frontend structure:

frontend
│
├── src
│   ├── components
│   │   ├── Navbar.jsx
│   │   ├── FileUpload.jsx
│   │   ├── FileCard.jsx
│   │   ├── CopyLinkButton.jsx
│   │   └── SecurityBadge.jsx
│   │
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Upload.jsx
│   │   ├── Share.jsx
│   │   ├── Download.jsx
│   │   └── Error.jsx
│   │
│   ├── services
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
Future UI Enhancements

Possible improvements:

Drag & drop multi-file upload

File preview before download

Dark/light mode

File transfer progress tracking

Secure messaging with files

Goal

The goal of the CipherSend frontend is to create a secure, fast, and user-friendly interface that makes encrypted file sharing simple and trustworthy for users.