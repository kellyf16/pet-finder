export const coordsToAddress = async (lat: number, long: number): Promise<string> => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;

    const response = await fetch(url, {
        headers: {
            "Accept-Language": "en",
        },
    });

    if (!response.ok) throw new Error("Failed to lookup address!");

    const result = await response.json();
    return result.display_name || "Address Unknown";
};