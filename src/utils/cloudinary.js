import fs from "fs"
import { v2 as cloudinary } from "cloudinary"

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // delete file AFTER successful upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }

        return response

    } catch (error) {
        // delete file if exists (even if upload failed)
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }

        console.error("Cloudinary Error:", error)
        return null
    }
}