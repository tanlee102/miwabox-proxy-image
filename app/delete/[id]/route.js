import { NextResponse } from 'next/server'
import { getStore } from "@netlify/blobs";
import { google } from 'googleapis';

export async function DELETE(request, context) {

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION",
    }

    try {

        const password = String(request.nextUrl.searchParams.get("password"));
        if(password !== process.env.PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });

        const fileName = String(context.params.id);
        const fileParts = fileName.split(".");
        const extension = fileParts.pop();
        const id = fileParts.join(".");

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

        try {
            const response = await drive.files.delete({
                fileId: id
            });

            const store = getStore({
                name: 'images-store',
                siteID: process.env.siteID,
                token: process.env.token,
            });
            const keys = getStore({
                name: 'keys-store',
                siteID: process.env.siteID,
                token: process.env.token,
            });
            await store.delete(id); 
            await keys.delete(id); 

            return NextResponse.json({ message: 'success' }, { status: 200, headers });

        } catch (error) {
            return NextResponse.json({ error: error }, { status: 400, headers });
        }


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 400, headers });
    }

}