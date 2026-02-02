
import { NextResponse } from "next/server";
import { ftpClient } from "@/lib/ftp";
import path from "path";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files received" }, { status: 400 });
        }

        // Validation
        for (const file of files) {
            if (file.size > 20 * 1024 * 1024) { // 20MB
                return NextResponse.json({ error: `File ${file.name} exceeds 20MB limit` }, { status: 400 });
            }
            if (!file.type.startsWith("image/")) {
                return NextResponse.json({ error: `File ${file.name} is not an image` }, { status: 400 });
            }
        }

        const uploadedUrls = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Validate extension
            const ext = path.extname(file.name).toLowerCase();
            const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
            if (!allowedExts.includes(ext)) {
                return NextResponse.json({ error: `File type ${ext} not allowed` }, { status: 400 });
            }

            // Generate safe filename
            const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${ext}`;

            // Upload to FTP
            try {
                console.log(`Uploading ${filename} to FTP...`);
                const publicUrl = await ftpClient.uploadFile(buffer, filename);
                console.log(`Uploaded: ${publicUrl}`);
                uploadedUrls.push(publicUrl);
            } catch (error) {
                console.error(`Failed to upload ${filename}`, error);
                return NextResponse.json({ error: "FTP Upload failed" }, { status: 500 });
            }
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
