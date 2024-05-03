import { NextResponse } from 'next/server'
import { getStore } from "@netlify/blobs";

export async function GET(request, context) {

    try {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET",
        }

        const password = String(request.nextUrl.searchParams.get("password"));
        if(password !== process.env.PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });

        const blob = String(request.nextUrl.searchParams.get("blob"));

        try {
            const store = getStore({
                name: blob,
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