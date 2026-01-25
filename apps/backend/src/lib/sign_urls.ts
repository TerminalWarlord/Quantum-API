import { r2 } from "./r2_client";



export const getUploadSignedUrl = async (path: string, expiresIn: number = 3600) => {
    return r2.presign(
        path,
        {
            expiresIn,
            method: "PUT",
        }
    );
}


export const getDownloadSignedUrl = async (path: string, expiresIn: number = 600) => {
    return r2.presign(
        path,
        {
            expiresIn,
            method: "GET"
        }
    )
}