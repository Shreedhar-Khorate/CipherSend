import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as QRCodeLib from "qrcode.react";
import { Download, X } from "lucide-react";
import { Button } from "./ui/button";

const QRCodeComp = QRCodeLib.QRCode || QRCodeLib.default || Object.values(QRCodeLib)[0];

export default function QRCodeGenerator({ shareLink, fileName }) {
  const [isOpen, setIsOpen] = useState(false);
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${fileName}-qrcode.png`;
        link.href = url;
        link.click();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl border border-border p-8 max-w-sm w-full space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Share via QR Code</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close QR code modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              ref={qrRef}
              className="flex justify-center bg-white p-6 rounded-lg"
            >
              <QRCodeComp
                value={shareLink}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to access the shared file
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={downloadQRCode}
                className="flex-1 glow-green"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
          aria-label="Show QR code"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 11h8V3H3v8zm0 10h8v-8H3v8zm10 0h8v-8h-8v8zm-5-5h3v3h-3v-3z"/>
          </svg>
          QR Code
        </button>
      )}
    </AnimatePresence>
  );
}
