import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import * as jose from 'jose'

const listEmailApproved = [
    'xemtua@gmail.com',
    'caculus103@gmail.com'
]

const corsOptions = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Accept-Version, Content-Length",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
}

export async function middleware(request) {

    const isPreflight = request.method === 'OPTIONS';
    if (isPreflight) {
        return NextResponse.json({}, { headers: corsOptions })
    }

    const response = NextResponse.next();

    if(request.method === 'PUT' || request.method === 'POST' || request.method === 'DELETE'){

        response.headers.set("Content-Type", "application/json");

        const headersList = headers();
        const token = headersList.get('authorization').replace('Bearer ', '');
        const secret = new TextEncoder().encode(process.env.MY_AUTH_KEY);

        try {
            const { payload } = await jose.jwtVerify(token, secret);
            if (!listEmailApproved.includes(payload.email)) {
                throw new Error();
            }
        } catch(err) {
            console.log(err);
            return NextResponse.json({ error: "Failed to authenticate." }, { status: 400, headers: corsOptions});
        }

    }
    
    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response;
    
}

export const config = {
    matcher: ['/upload/:path*', '/delete/:path*'],
}