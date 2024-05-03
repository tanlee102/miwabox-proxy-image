import { NextResponse } from 'next/server'
import { getStore } from "@netlify/blobs";

export async function POST(request, context) {

    try {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTION",
        }

        const password = String(request.nextUrl.searchParams.get("password"));
        if(password !== process.env.PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });

        try {
            const store = getStore({
                name: '',
                siteID: process.env.siteID,
                token: process.env.token,
            });

            const { blobs } = await store.list()

            for(let i = 0; i < blobs.length; i++){
                await store.delete(blobs[i].key); 
            }
            
            return NextResponse.json({ message: 'success' }, { status: 200, headers });
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 400, headers });
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400, headers });
    }

}