import fetch from 'node-fetch';
import { NextResponse } from 'next/server'

async function getImageStream(id) {

    const url = 'https://drive.google.com/uc?id=' + id + '&export=download';
    // const url = 'https://www.googleapis.com/drive/v3/files/'+req.nextUrl.searchParams.get("id")+'?key=AIzaSyCDEQ915m_RAEWxhOghge1sWUBO6cnROVI&alt=media'

    const response = await fetch(url, { cache: 'force-cache' });
    const headers = {
        "Content-Type": "image/jpeg",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION",
    }
    
    return new NextResponse(response.body, { status: 200, headers })
}

export async function GET(request) {
    let url = String(request.url).split('/')[3];
    try {
      return await getImageStream(url.replace('.jpeg', ''));
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
}