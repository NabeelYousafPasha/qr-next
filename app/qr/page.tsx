"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";

export default function QRCodePage() {
    const [inputValue, setInputValue] = useState("");
    const [scanResult, setScanResult] = useState("");
    const [visitor, setVisitor] = useState<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const fetchVisitor = async (code: string) => {
        try {
            const res = await axios.get(
                `http://localhost:4000/api/Visitors/ValidateQRCode/${encodeURIComponent(code)}`
            );
            setVisitor(res.data);
        } catch (err: any) {
            console.error("Frontend fetch error:", err.response?.data || err.message);
            setVisitor({ error: err.response?.data || "Failed to fetch data" });
        }
    };

    const handleScan = async () => {
        const codeReader = new BrowserMultiFormatReader();
        if (!videoRef.current) return;

        codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
            if (result) {
                const scannedCode = result.getText();
                setScanResult(scannedCode);
                codeReader.reset();
                fetchVisitor(scannedCode);
            }
        });
    };

    const handleInputSubmit = () => {
        if (inputValue) {
            setScanResult(inputValue);
            fetchVisitor(inputValue);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">QR Code Scanner & Visitor Info</h1>

            {/* QR Code Generator */}
            <div className="mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter QR code ID or link"
                    className="border p-2 rounded w-full mb-2"
                />
                <button
                    onClick={handleInputSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded mb-2"
                >
                    Fetch Visitor
                </button>
                {inputValue && (
                    <div className="border p-4 rounded inline-block">
                        <QRCodeCanvas value={inputValue} size={128} />
                    </div>
                )}
            </div>

            {/* QR Scanner */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Scan QR Code</h2>
                <video ref={videoRef} className="border w-full rounded mb-2" />
                <button
                    onClick={handleScan}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Start Scan
                </button>
                {scanResult && <p className="mt-2 font-medium">Scanned Code: {scanResult}</p>}
            </div>

            {/* Display Visitor Info */}
            {visitor && !visitor.error && (
                <div className="border rounded-lg shadow p-6 bg-gray-50 flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <img
                            src={`https://adiems.adcda.gov.ae${visitor.profileImage}`}
                            alt="Profile"
                            className="w-32 h-32 object-cover rounded-full border"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-bold">
                            {visitor.title}. {visitor.firstName} {visitor.lastName}
                        </h3>
                        <p><strong>Job Title:</strong> {visitor.jobTitle}</p>
                        <p><strong>Company:</strong> {visitor.company}</p>
                        <p><strong>Email:</strong> {visitor.email}</p>
                        <p><strong>Phone:</strong> {visitor.phone}</p>
                        <p><strong>Nationality:</strong> {visitor.nationality?.toUpperCase()}</p>
                        <p><strong>Country:</strong> {visitor.countryOfResidence?.toUpperCase()}</p>
                        <p><strong>ID Type:</strong> {visitor.idType}</p>
                        <p><strong>ID Number:</strong> {visitor.idNumber}</p>
                        <p><strong>Staff:</strong> {visitor.staff ? "Yes" : "No"}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <img
                            src={`https://adiems.adcda.gov.ae${visitor.idImage}`}
                            alt="ID"
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                </div>
            )}

            {visitor?.error && (
                <div className="text-red-500 mt-4 font-semibold">{visitor.error}</div>
            )}
        </div>
    );
}
