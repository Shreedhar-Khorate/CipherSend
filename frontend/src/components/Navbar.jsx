import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import CipherSendLogo from "./CipherSendLogo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Upload", to: "/upload" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label="CipherSend home"
        >
          <div className="rounded-lg bg-primary/10 p-1 glow-green">
            <CipherSendLogo size={28} />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Cipher
            <span className="text-gradient">Send</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                location.pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {label}
            </Link>
          ))}
          <Button
            size="sm"
            className="ml-3 glow-green"
            onClick={() => navigate("/upload")}
            aria-label="Upload file"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            Upload File
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border sm:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname === to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {label}
                </Link>
              ))}
              <Button
                size="sm"
                className="mt-2 w-full glow-green"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/upload");
                }}
                aria-label="Upload file"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Upload File
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
