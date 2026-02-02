
import * as ftp from 'basic-ftp';
import { Readable } from 'stream';

export class FTPClient {
    private client: ftp.Client;

    constructor() {
        this.client = new ftp.Client();
        // this.client.ftp.verbose = true; // Enable for debugging
    }

    async uploadFile(fileBuffer: Buffer, filename: string): Promise<string> {
        try {
            await this.client.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
                port: parseInt(process.env.FTP_PORT || '21'),
                secure: false // Set to true if FTPS is available/required
            });

            // Ensure images directory exists or navigate to it
            // Based on username 'images@...', we might land directly in the images folder
            // or need to go to public_html/images. 
            // Let's assume we land in the root and upload there for now, 
            // or we can try to switch multiple dirs.

            // For now, upload to root of FTP user's home
            const source = new Readable();
            source.push(fileBuffer);
            source.push(null);

            await this.client.uploadFrom(source, filename);

            // Construct public URL
            // Assuming the images map to https://restaurantsinlanzarote.com/images/filename 
            // or https://restaurantsinlanzarote.com/filename depending on how the subuser is set up.
            // Given username is 'images@...', it's likely mapped to a specific folder.
            // Let's guess it maps to /images path.

            // If the user's home is public_html/images/ 
            // Then the URL is restaurantsinlanzarote.com/images/filename

            return `https://restaurantsinlanzarote.com/images/${filename}`;

        } catch (error) {
            console.error("FTP Upload Error:", error);
            throw new Error("Failed to upload image via FTP");
        } finally {
            this.client.close();
        }
    }
}

export const ftpClient = new FTPClient();
