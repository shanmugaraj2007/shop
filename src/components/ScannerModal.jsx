import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import './ScannerModal.css';

const ScannerModal = ({ onClose, onSuccess }) => {
  useEffect(() => {
    // Create the scanner instance
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Stop scanning after success
        scanner.clear();
        onSuccess(decodedText);
      },
      (error) => {
        // Ignore errors to not spam the console while scanning
      }
    );

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onSuccess]);

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Scan QR Code</h2>
        <p>Point your camera at the dashboard QR Code to login.</p>
        <div id="qr-reader" className="qr-reader-container"></div>
      </div>
    </div>
  );
};

export default ScannerModal;
