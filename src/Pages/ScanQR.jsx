// ScanQR.js
import React, { useState } from 'react';
import QrReader from 'react-qr-reader';

function ScanQR() {
    const [qrData, setQrData] = useState('No QR code scanned');

    const handleScan = (data) => {
        if (data) {
            setQrData(data);
            // Aquí puedes agregar lógica para redirigir o buscar el auto en la base de datos
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    return (
        <div className="scan-qr">
            <h2>Escanear Código QR</h2>
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />
            <p>Datos del QR: {qrData}</p>
        </div>
    );
}

export default ScanQR;
