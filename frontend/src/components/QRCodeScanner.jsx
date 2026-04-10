import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QrScanner from "qr-scanner";
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function QRCodeScanner({ onScan, isOpen, onClose }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const initScanner = async () => {
      try {
        setError(null);
        setScannedResult(null);
        setLoading(true);
        setIsScanning(false);

        // Check if getUserMedia is supported
        const mediaDevices = navigator.mediaDevices;
        if (!mediaDevices || !mediaDevices.getUserMedia) {
          setError("Camera access is not supported in your browser. Please use a modern browser like Chrome, Firefox, or Safari.");
          setLoading(false);
          return;
        }

        // Check camera availability
        if (QrScanner.hasCamera) {
          try {
            const hasCamera = await QrScanner.hasCamera();
            if (!hasCamera) {
              setError("No camera found on this device");
              setLoading(false);
              return;
            }
          } catch (err) {
            // Continue anyway, camera might still be available
          }
        }

        // Create scanner instance
        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            console.log("QR Code detected:", result.data);
            setScannedResult(result.data);
            setIsScanning(false);
            // Give user a moment to see the success message
            setTimeout(() => {
              onScan(result.data);
            }, 1000);
          },
          {
            onDecodeError: (err) => {
              // Silently ignore decode errors
            },
            preferredCamera: "environment",
            highlightScanRegion: true,
            highlightCodeOutline: true,
            maxScansPerSecond: 5,
            returnDetailedScanResult: false,
            videoConstraints: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          }
        );

        scannerRef.current = scanner;
        setLoading(false);
        setIsScanning(true);
        await scanner.start();
      } catch (err) {
        console.error("Scanner error:", err);
        
        // Provide better error messages for common issues
        let errorMessage = "Failed to access camera. Please check permissions.";
        
        if (err.name === "NotAllowedError" || err.message?.includes("Permission denied")) {
          errorMessage = "Camera permission denied. Please grant camera access in your device settings.";
        } else if (err.name === "NotFoundError" || err.message?.includes("No camera")) {
          errorMessage = "No camera found on this device.";
        } else if (err.name === "NotSupportedError") {
          errorMessage = "Camera access is not supported on this device or browser.";
        } else if (err.name === "AbortError") {
          errorMessage = "Camera access was aborted. Please try again.";
        }
        
        setError(errorMessage);
        setLoading(false);
        setIsScanning(false);
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
          scannerRef.current.destroy();
        } catch (err) {
          console.error("Error stopping scanner:", err);
        }
        scannerRef.current = null;
      }
    };
  }, [isOpen, onScan]);

  const handleClose = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setLoading(true);
    setError(null);
    setScannedResult(null);
    setIsScanning(false);
    onClose();
  };

  const handleRetry = () => {
    setError(null);
    setScannedResult(null);
    setLoading(true);
    
    // Restart scanner
    if (scannerRef.current) {
      try {
        scannerRef.current.start().then(() => {
          setLoading(false);
          setIsScanning(true);
        });
      } catch (err) {
        setError("Failed to restart scanner");
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
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl border border-border p-6 max-w-lg w-full space-y-4"
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
                  <p className="font-medium">Camera Error</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-xs mt-2 opacity-75">
                    Make sure you've granted camera permissions and try again.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Camera Preview Container */}
                <div className="relative overflow-hidden rounded-lg border-2 border-border bg-black aspect-square w-full">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />

                  {/* Loading overlay */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center space-y-3">
                        <Loader2 className="h-10 w-10 text-white animate-spin mx-auto" />
                        <p className="text-white text-sm font-medium">Initializing camera...</p>
                      </div>
                    </div>
                  )}

                  {/* QR Scan Frame Overlay */}
                  {isScanning && !loading && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Dimmed corners */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 opacity-50" />

                      {/* Scan frame */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          {/* Corner markers */}
                          <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-primary" />
                          <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-primary" />
                          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-primary" />
                          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-primary" />

                          {/* Center crosshair */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-24 bg-primary opacity-40" />
                            <div className="w-24 h-1 bg-primary opacity-40 absolute" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success state */}
                  {scannedResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur">
                      <div className="text-center space-y-3">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto animate-bounce" />
                        <p className="text-white font-semibold">QR Code Scanned!</p>
                        <p className="text-green-300 text-xs break-all max-w-xs">
                          {scannedResult}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                {!scannedResult && isScanning && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-primary/10 border border-primary/30 p-3 text-center text-sm text-foreground"
                  >
                    <p>📱 Position the QR code in the frame</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Make sure there's enough light and the code is clearly visible
                    </p>
                  </motion.div>
                )}
              </>
            )}

            {/* Action Buttons */}
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
                  onClick={handleRetry}
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
