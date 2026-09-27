import { type ImgBBResponse } from "../models";

const IMG_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadImg = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_KEY}`, {
        method: "POST",
        body: formData
    });

    const result: ImgBBResponse = await response.json();
    if (!response.ok) throw new Error("Failed to upload image!");

    return result.data.url;
};