import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Link2, FileCheck, Clock, Github, BookOpen, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import CipherSendLogo from "../components/CipherSendLogo";

const features = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Your files are encrypted using AES-256 before they ever leave your device.",
  },
  {
    icon: Link2,
    title: "Secure Shareable Links",
    description:
      "Generate unique, expiring links to share files with anyone safely.",
  },
  {
    icon: FileCheck,
    title: "File Integrity Verification",
    description:
      "SHA-256 hash verification ensures your files arrive untampered.",
  },
  {
    icon: Clock,
    title: "Temporary File Expiry",
    description:
      "Files auto-delete after a set time — no traces left behind.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero section */}
      <section className="relative flex items-center justify-center overflow-hidden px-4 py-32 text-center bg-grid">
        {/* Radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-3xl space-y-6"
        >
          {/* Logo mark */}
          <div className="flex justify-center">
            <div className="rounded-2xl bg-primary/10 p-4 glow-green-strong">
              <CipherSendLogo size={64} />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Shield className="h-4 w-4" />
            Military-grade encryption
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl text-foreground">
            Secure File Sharing with{" "}
            <span className="text-gradient">CipherSend</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
            Send files safely using end-to-end encryption and secure, expiring
            links. No accounts required. No compromises.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="glow-green h-12 px-8 text-base"
              onClick={() => navigate("/upload")}
              aria-label="Upload a file"
            >
              Upload File
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
              onClick={scrollToFeatures}
              aria-label="Learn more about CipherSend"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features section */}
      <section
        id="features"
        ref={featuresRef}
        className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Why <span className="text-gradient">CipherSend</span>?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built with security-first principles, so your files stay yours.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="gradient-card group rounded-xl border border-border p-6 space-y-4 transition-all duration-200 hover:border-primary/30 hover:glow-green"
            >
              <div className="inline-flex rounded-lg bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CipherSendLogo size={18} />
            CipherSend · Secure file transfer
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="#features"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              aria-label="Documentation"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              aria-label="Privacy Policy"
            >
              <FileText className="h-4 w-4" />
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
