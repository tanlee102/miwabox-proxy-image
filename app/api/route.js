import { google } from 'googleapis';
import { NextResponse } from 'next/server'
import { Readable } from 'stream';


export async function POST(request, context) {

    const oauth2Client = new google.auth.OAuth2(
        '432599773188-q9ds38fcusg4160bg6n4d7b2e1so1img.apps.googleusercontent.com', // Client ID
        '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', // Client Secret
        'http://localhost:80' // Redirect URL
    );
    oauth2Client.setCredentials({
        refresh_token: '1//0eEgQwWhTZ_YOCgYIARAAGA4SNwF-L9Irm2KUOmKrpBr6X1O18FJcZeNPjyq27g75CpRcbzH_UWNdiyeyOsdB5oErmTV02lOQ4yA'
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
          name: 'mytan.jpeg', // This can be any name, and doesn't have to match the actual file
        },
        media: {
          mimeType: 'image/jpeg',
          body: imageStream, // Use the actual path to your file
        },
    });

    return NextResponse.json(1  , { status: 200 })

}