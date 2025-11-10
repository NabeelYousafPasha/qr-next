// backend/server.js
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE = "https://adiems.adcda.gov.ae/phemapi/api";
const TOKEN = process.env.API_BEARER_TOKEN;

app.get("/api/Visitors/ValidateQRCode/:id", async (req, res) => {
    const { id } = req.params;

    app.get("/api/Visitors/ValidateQRCode/:id", async (req, res) => {
        const { id } = req.params;

        try {
            const response = await axios.get(
                `${API_BASE}/Visitors/ValidateQRCode/${encodeURIComponent(id)}`,
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        Accept: "application/json",
                    },
                }
            );

            res.json(response.data);
        } catch (error) {
            console.error("Backend proxy error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });

            res.status(error.response?.status || 500).json({
                error: "Failed to fetch visitor data",
                details: error.response?.data || error.message,
            });
        }
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`✅ Backend proxy running on http://localhost:${PORT}`)
);
