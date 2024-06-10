import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadImage(file: File, folder: string) {

  try {
    const url =
      "https://api.cloudinary.com/v1_1/" +
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME +
      "/image/upload";

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "api_key",
      import.meta.env.VITE_CLOUDINARY_API_KEY
    );
    formData.append("folder", folder);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      const imageUrl = responseData.secure_url;

      return imageUrl
    } else {
      console.error(
        "Error al cargar el archivo:",
        response.status
      );
    }
  } catch (err) {
    console.log(err);
  }

}