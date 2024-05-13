import { google } from 'googleapis';
import { NextResponse } from 'next/server'
import { Readable } from 'stream';
import { getStore } from "@netlify/blobs";

export const dynamic = 'force-dynamic';

export async function OPTIONS(request, context) {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // If you're making POST requests
    }
    return new NextResponse({ status: 200, headers });
}

export async function PUT(request, context) {

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    }    

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID, 
            process.env.CLIENT_SECRET, 
            'http://localhost:80'
        );
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        });
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
        
        const formData = await request.formData();
        const image = formData.get("image") instanceof File ? formData.get("image") : null;

        const imageBuffer = await new Response(image).arrayBuffer();

        const imageStream = new Readable();
        imageStream.push(Buffer.from(imageBuffer));
        imageStream.push(null);
    
        const response = await drive.files.create({
            requestBody: {
                name: image.name,
            },
            media: {
                mimeType: image.type,
                body: imageStream,
            },
        });

        if(response?.status == 200){
            if(response?.data){
                const fileId = response.data.id;

                const keys = getStore({
                    name: 'keys-store',
                    siteID: process.env.siteID,
                    token: process.env.token,
                });
                await keys.set(fileId, 'true');

                await drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone'
                    }
                });
            }
        }

        return NextResponse.json(response.data, { status: 200, headers });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400, headers });
    }

}