"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function contactExperience(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const experienceTitle = formData.get("experienceTitle") as string;

    if (!name || !email || !phone) {
        return { error: "Missing required fields" };
    }

    try {
        console.log("Sending experience inquiry email...", { name, email, phone, experienceTitle });

        const { data, error } = await resend.emails.send({
            from: "Famara Booking <info@hotelinlanzarote.com>",
            to: ["info@volcanokite.com"],
            subject: `New Request: ${experienceTitle}`,
            html: `
                <h1>New Experience Request</h1>
                <p><strong>Experience:</strong> ${experienceTitle}</p>
                <hr />
                <h2>Guest Details</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <hr />
                <p>Please contact this guest to confirm availability.</p>
            `
        });

        if (error) {
            console.error("Resend Error:", error);
            return { error: "Failed to send email" };
        }

        return { success: true };
    } catch (error) {
        console.error("Server Action Error:", error);
        return { error: "Internal Server Error" };
    }
}
