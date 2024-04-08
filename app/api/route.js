import { google } from 'googleapis';
import { NextResponse } from 'next/server'
import { Readable } from 'stream';
import { getStore } from "@netlify/blobs";

export async function POST(request, context) {

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
        const password = formData.get("password");


        const headers = {
            "Content-Type": "image/jpeg",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTION",
        }


        if(String(process.env.PASSWORD) === String(password)){
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
                    const keys = getStore({
                        name: 'keys-store',
                        siteID: '30cc35f8-b6da-4d54-ade8-0d6e322e0b48',
                        token: 'nfp_nEoRVLqwwBCnV1aVTn9MCQV9juJKyiJD5f31',
                    });
                    await keys.set(response?.data?.id, 'true')
                }
            }

            return NextResponse.json(response.data, { status: 200, headers });
        }else{
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400, headers });
    }

}