import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
    onResult: (result: string) => void;
    onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult, onClose }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 150 },
                aspectRatio: 1.0
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                onResult(decodedText);
                scanner.clear();
            },
            (error) => {
                // Silently ignore scan errors
            }
        );

        return () => {
            scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        };
    }, [onResult]);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-xl" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-primary p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Scanner de Câmera</h3>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 mt-2 font-black">Posicione o código de barras no centro</p>
                    </div>
                    <button onClick={onClose} className="bg-white/20 size-10 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                        <span className="material-symbols-outlined font-black">close</span>
                    </button>
                </div>
                <div className="p-8">
                    <div id="qr-reader" className="w-full rounded-2xl overflow-hidden border-4 border-gray-100"></div>
                    <button
                        onClick={onClose}
                        className="w-full mt-8 bg-gray-50 text-gray-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all"
                    >
                        Cancelar Leitura
                    </button>
                </div>
            </div>
        </div>
    );
};
