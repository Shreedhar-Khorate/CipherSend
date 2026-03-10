# CipherSend Frontend Specification

## Project Overview

CipherSend is a secure file transfer platform that enables users to upload, encrypt, and share files safely across networks.

The frontend provides a modern, dark-themed, cybersecurity-inspired UI that allows users to:

- Upload files securely via drag & drop
- Configure encryption & security options (password, expiry, download limits)
- Generate encrypted shareable links
- Download and decrypt files safely
- Verify file integrity (SHA-256)
- Manage file access and errors gracefully

---

## Tech Stack

| Technology            | Purpose                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| **React 18**          | UI library                                                                |
| **Vite**              | Build tool & dev server                                                   |
| **JavaScript (ES6+)** | Language                                                                  |
| **Tailwind CSS**      | Utility-first styling                                                     |
| **React Router v6**   | Client-side routing                                                       |
| **Framer Motion**     | Animations & transitions                                                  |
| **React Dropzone**    | Drag & drop file uploads                                                  |
| **Lucide React**      | Icon library                                                              |
| **Shadcn/UI**         | Base component primitives (Button, Input, Switch, Select, Progress, etc.) |

---

## Design System

### Color Palette (HSL)

| Token                    | HSL Value     | Usage                                |
| ------------------------ | ------------- | ------------------------------------ |
| `--background`           | `222 47% 3%`  | Page background (near-black navy)    |
| `--foreground`           | `214 32% 91%` | Primary text                         |
| `--card`                 | `217 33% 10%` | Card / surface background            |
| `--card-foreground`      | `214 32% 91%` | Card text                            |
| `--primary`              | `142 71% 45%` | Green accent (buttons, icons, glows) |
| `--primary-foreground`   | `222 47% 3%`  | Text on primary surfaces             |
| `--secondary`            | `217 33% 17%` | Secondary surfaces                   |
| `--secondary-foreground` | `214 32% 91%` | Secondary text                       |
| `--muted`                | `217 33% 14%` | Muted backgrounds                    |
| `--muted-foreground`     | `215 20% 55%` | Muted/subtle text                    |
| `--accent`               | `142 71% 45%` | Accent (matches primary green)       |
| `--destructive`          | `0 84% 60%`   | Error/danger red                     |
| `--warning`              | `38 92% 50%`  | Warning amber                        |
| `--border`               | `217 33% 17%` | Border color                         |
| `--ring`                 | `142 71% 45%` | Focus ring color                     |

### Custom Utilities (Tailwind)

```css
.glow-green        /* box-shadow: 0 0 20px hsl(142 71% 45% / 0.3) */
.glow-green-strong /* box-shadow: 0 0 40px hsl(142 71% 45% / 0.4) */
.gradient-card     /* linear-gradient(135deg, hsl(217 33% 12%), hsl(217 33% 8%)) */
.gradient-accent   /* linear-gradient(135deg, hsl(142 71% 45%), hsl(160 60% 40%)) */
.text-gradient     /* green gradient text via bg-clip-text */
.border-glow       /* border-color with green at 30% opacity */
.bg-grid           /* subtle grid background pattern */
```

### Typography

| Element      | Font           | Weight               |
| ------------ | -------------- | -------------------- |
| Body         | Inter          | 400 (Regular)        |
| Subheading   | Inter          | 500 (Medium)         |
| Heading      | Inter          | 700-900 (Bold/Black) |
| Code / Links | JetBrains Mono | 400-600              |

Load via Google Fonts:

```
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap
```

---

## Directory Structure

```
ciphersend/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder.svg
│
├── src/
│   ├── assets/                     # Static assets (images, icons)
│   │
│   ├── components/
│   │   ├── ui/                     # Shadcn/UI base components
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── switch.jsx
│   │   │   ├── select.jsx
│   │   │   ├── progress.jsx
│   │   │   ├── toast.jsx
│   │   │   ├── toaster.jsx
│   │   │   ├── tooltip.jsx
│   │   │   └── sonner.jsx
│   │   │
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── FileUpload.jsx          # Drag & drop upload + security options
│   │   ├── FileCard.jsx            # File info display card
│   │   ├── CopyLinkButton.jsx      # Copy-to-clipboard button
│   │   └── SecurityBadge.jsx       # Encryption badge pill
│   │
│   ├── pages/
│   │   ├── Home.jsx                # Landing page with hero + features
│   │   ├── Upload.jsx              # Upload page wrapper
│   │   ├── Share.jsx               # Share link display page
│   │   ├── Download.jsx            # Download + decrypt page
│   │   ├── Error.jsx               # Error states page
│   │   └── NotFound.jsx            # 404 fallback
│   │
│   ├── hooks/
│   │   └── use-toast.js            # Toast notification hook
│   │
│   ├── lib/
│   │   └── utils.js                # Utility functions (cn, etc.)
│   │
│   ├── App.jsx                     # Root app with routes
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Design system (all tokens + utilities)
│
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## Pages

### 1. Home Page (`/`)

**File:** `src/pages/Home.jsx`

**Sections:**

#### Hero Section

- Grid background pattern (`.bg-grid`) with blurred green radial glow
- Badge pill: "Military-grade encryption" with Shield icon
- Heading: `Secure File Sharing with CipherSend` (CipherSend in `.text-gradient`)
- Subtitle: "Send files safely using end-to-end encryption and secure, expiring links. No accounts required. No compromises."
- Two buttons:
  - **Primary:** "Upload File" → navigates to `/upload` (with `.glow-green` shadow)
  - **Outline:** "Learn More" → scrolls to `#features`
- Framer Motion: fade-in + slide-up on mount

#### Features Section (`#features`)

- Section heading: "Why CipherSend?"
- 4-column grid (responsive: 1 col mobile, 2 col tablet, 4 col desktop)
- Each feature card (`.gradient-card`):
  - Icon in rounded `bg-primary/10` container
  - Title + description
  - Hover: `border-primary/30` + `.glow-green`
  - Framer Motion: staggered fade-in (0.1s delay per card)

**Feature cards:**

| Icon      | Title                       | Description                                                                |
| --------- | --------------------------- | -------------------------------------------------------------------------- |
| Lock      | End-to-End Encryption       | Your files are encrypted using AES-256 before they ever leave your device. |
| Link2     | Secure Shareable Links      | Generate unique, expiring links to share files with anyone safely.         |
| FileCheck | File Integrity Verification | SHA-256 hash verification ensures your files arrive untampered.            |
| Clock     | Temporary File Expiry       | Files auto-delete after a set time — no traces left behind.                |

#### Footer

- Border-top separator
- Left: Shield icon + "CipherSend · Secure file transfer"
- Right: Links — GitHub, Documentation, Privacy Policy

---

### 2. Upload Page (`/upload`)

**File:** `src/pages/Upload.jsx`

- Centered layout, `max-w-2xl`
- Badge: "Encrypted Upload"
- Heading: "Upload Your File"
- Subtitle: "Your file will be encrypted before upload. Only the link holder can access it."
- Renders `<FileUpload />` component

---

### 3. Share Page (`/share/:fileId`)

**File:** `src/pages/Share.jsx`

**Components:**

1. **Success animation**: Green CheckCircle2 icon with spring animation + `.glow-green`
2. **Heading**: "File Uploaded Successfully!"
3. **Link display card**:
   - Label: "Secure Share Link" with Link2 icon
   - Monospace link in muted background
   - `<CopyLinkButton />` inline
4. **Share options** (3 buttons):
   - Copy (clipboard)
   - Email (mailto: link)
   - QR Code (toggle visibility)
5. **QR Code panel**: Expandable with QrCode icon placeholder
6. **Security badges**: "AES-256 Encrypted" + "SHA-256 Verified"

---

### 4. Download Page (`/download/:fileId`)

**File:** `src/pages/Download.jsx`

**Components:**

1. **File info header**:
   - FileText icon in `bg-primary/10` container
   - File name (e.g., "document.pdf")
   - File size + upload date with icons
2. **SecurityBadge** component
3. **Password input**:
   - Label: "Enter password to decrypt" with Lock icon
   - Password input field
4. **Download button**: "Decrypt & Download"
   - Loading state: spinner + "Verifying integrity..."
5. **Verification result** (appears after download):
   - Green success banner: "File verified using SHA-256 · Integrity confirmed"
   - Framer Motion fade-in

---

### 5. Error Page (`/error?type=expired|invalid|limit`)

**File:** `src/pages/Error.jsx`

**Error types:**

| Type      | Title                  | Message                                                                |
| --------- | ---------------------- | ---------------------------------------------------------------------- |
| `expired` | File Expired           | This file has exceeded its expiration time and is no longer available. |
| `invalid` | Invalid Link           | The link you followed is invalid or has been revoked.                  |
| `limit`   | Download Limit Reached | This file has reached its maximum number of downloads.                 |
| `default` | File Unavailable       | This file is no longer available.                                      |

- AlertTriangle icon in `bg-destructive/10` circle
- "Return Home" outline button

---

### 6. Not Found Page (`*`)

**File:** `src/pages/NotFound.jsx`

- Generic 404 fallback

---

## Reusable Components

### Navbar (`src/components/Navbar.jsx`)

- Fixed top, `backdrop-blur-xl`, semi-transparent background
- **Left:** Logo (Shield icon in green glow box) + "CipherSend" text (Send in gradient)
- **Right (desktop):** Home, Upload links + "Upload File" CTA button
- **Mobile:** Hamburger menu with AnimatePresence slide-down
- Active link detection via `useLocation()`

### FileUpload (`src/components/FileUpload.jsx`)

- **Dropzone** (react-dropzone):
  - Dashed border, Upload icon
  - Drag active state: green border + glow + scale animation
  - Text: "Drag & drop your file" / "or click to browse"
- **File preview** (AnimatePresence):
  - File icon + name + size + remove (X) button
- **Security options panel** (appears after file selected):
  - Password toggle (Switch) + conditional password Input
  - Expiration Select (24 hours / 7 days / Custom)
  - Download limit number Input
- **Upload progress**:
  - Progress bar with percentage (mono font)
  - Label: "Encrypting & uploading..."
- **Upload button**: "Encrypt & Upload File" with Lock icon
  - Full width, large size
  - Navigates to `/share/:fileId` on complete

### FileCard (`src/components/FileCard.jsx`)

- `.gradient-card` with hover glow
- File icon + name + size + date
- SecurityBadge + Download button
- Props: `fileName`, `fileSize`, `uploadDate`, `onDownload`

### SecurityBadge (`src/components/SecurityBadge.jsx`)

- Inline pill: Shield icon + label text
- Styled: `border-primary/20`, `bg-primary/5`, `text-primary`
- Default label: "AES-256 Encrypted"
- Props: `label`

### CopyLinkButton (`src/components/CopyLinkButton.jsx`)

- Outline button with Copy/Check icon
- Copies `link` prop to clipboard
- Shows "Copied!" for 2 seconds after click
- Props: `link`

---

## Animations (Framer Motion)

| Element              | Animation                                           |
| -------------------- | --------------------------------------------------- |
| Hero content         | `opacity: 0→1, y: 30→0` (0.7s)                      |
| Feature cards        | Staggered `opacity: 0→1, y: 20→0` (0.1s delay each) |
| Success icon (Share) | `scale: 0→1` spring with 0.2s delay                 |
| File preview         | `opacity + height` expand/collapse                  |
| Security options     | `opacity: 0→1, y: 10→0`                             |
| Upload progress      | `opacity: 0→1`                                      |
| Mobile menu          | `height: 0→auto, opacity: 0→1`                      |
| Error page content   | `opacity: 0→1, y: 20→0`                             |
| Dropzone icon        | `scale: 1→1.1, y: 0→-5` on drag active              |

---

## Routing

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/upload" element={<UploadPage />} />
    <Route path="/share/:fileId" element={<SharePage />} />
    <Route path="/download/:fileId" element={<DownloadPage />} />
    <Route path="/error" element={<ErrorPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

---

## Responsive Breakpoints

| Breakpoint            | Layout                                                      |
| --------------------- | ----------------------------------------------------------- |
| Mobile (`<640px`)     | Single column, hamburger nav, full-width buttons            |
| Tablet (`640-1024px`) | 2-column feature grid, stacked share options                |
| Desktop (`>1024px`)   | 4-column feature grid, horizontal nav, max-width containers |

---

## UI States

| State           | Visual                                                  |
| --------------- | ------------------------------------------------------- |
| **Idle**        | Default component appearance                            |
| **Drag active** | Green border + glow + scale on dropzone                 |
| **Uploading**   | Progress bar + percentage + "Encrypting & uploading..." |
| **Success**     | Green CheckCircle animation + share link display        |
| **Verifying**   | Spinner + "Verifying integrity..." on download button   |
| **Verified**    | Green banner: "File verified using SHA-256"             |
| **Error**       | Red AlertTriangle + contextual error message            |
| **Copied**      | Check icon + "Copied!" text for 2 seconds               |

---

## Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.x",
    "react-dom": "^18.3.x",
    "react-router-dom": "^6.x",
    "framer-motion": "^11.x",
    "react-dropzone": "^14.x",
    "lucide-react": "^0.460+",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "tailwindcss-animate": "^1.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react-swc": "^3.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

---

## Notes

- All colors use **HSL** format defined as CSS custom properties in `index.css`
- **No hardcoded colors** in components — everything uses semantic tokens (`bg-background`, `text-foreground`, `text-primary`, etc.)
- Custom Tailwind utilities (`.glow-green`, `.gradient-card`, `.text-gradient`, `.bg-grid`) are defined in `index.css` `@layer utilities`
- The UI is **dark mode only** — no light/dark toggle
- File upload/download flows are **simulated** (no real backend) — ready for API integration
- All interactive elements have proper `aria-label` attributes for accessibility
