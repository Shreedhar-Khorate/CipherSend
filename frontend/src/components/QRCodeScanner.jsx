import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QrScanner from "qr-scanner";
import { X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function QRCodeScanner({ onScan, isOpen, onClose }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const initScanner = async () => {
      try {
        setError(null);
        setScannedResult(null);
        
        // Check if QrScanner.hasCamera is available
        if (QrScanner.hasCamera) {
          const hasCamera = await QrScanner.hasCamera();
          if (!hasCamera) {
            setError("No camera found on this device");
            return;
          }
        }

        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            setScannedResult(result.data);
            setScanning(false);
            onScan(result.data);
          },
          {
            onDecodeError: () => {
              // Silently ignore decode errors
            },
            preferredCamera: "environment",
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        scannerRef.current = scanner;
        setScanning(true);
        await scanner.start();
      } catch (err) {
        setError(err.message || "Failed to initialize camera");
        setScanning(false);
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [isOpen, onScan]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setScanning(false);
    setScannedResult(null);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl border border-border p-6 max-w-sm w-full space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Scan QR Code</h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close scanner"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3 text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="relative overflow-hidden rounded-lg border border-border aspect-square bg-muted">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    style={{ display: scanning ? "block" : "none" }}
                  />
                  {!scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                    </div>
                  )}
                  
                  {/* QR frame overlay */}
                  {scanning && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-1/4 border-2 border-primary rounded-lg" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
                    </div>
                  )}
                </div>

                {scannedResult && (
                  <div className="rounded-lg border border-primary/50 bg-primary/10 p-3">
                    <p className="text-sm font-medium text-foreground">
                      QR Code Scanned
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      {scannedResult}
                    </p>
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center">
                  {scanning && !scannedResult
                    ? "Position the QR code in the frame to scan"
                    : "Failed to scan. Please try again."}
                </p>
              </>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              {error && (
                <Button
                  onClick={() => {
                    setError(null);
                    setScannedResult(null);
                  }}
                  className="flex-1 glow-green"
                >
                  Retry
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
