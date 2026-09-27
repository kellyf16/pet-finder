import { type AnimalReport } from "../models";

const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY;
const URL = `http://localhost:5173/api`;

const headers = {
    "Content-Type": "application/json",
    "X-Master-Key": API_KEY,
};

export const fetchReports = async (): Promise<AnimalReport[]> => {
    const response = await fetch(`${URL}/reports`, { headers });
    if (!response.ok) throw new Error("Failed to fetch reports!");

    const data = await response.json();
    return data || [];
};

export const writeReport = async (report: AnimalReport): Promise<void> => {
    const payload = {
        name: report.name,
        type: report.type,
        photo_url: report.photo_url,
        description: report.description,
        phone_number: report.phone_number,
        last_seen: report.last_seen,
        address: report.address,
        password: report.password,
    };
    const response = await fetch(`${URL}/reports`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to save report!");
};

export const resolveReport = async (id: string, password: string): Promise<void> => {
    const response = await fetch(`${URL}/reports/${id}/resolve`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to mark as found!");
    }
};