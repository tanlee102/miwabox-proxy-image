import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import * as jose from 'jose'

const listEmailApproved = [
    'xemtua@gmail.com',
    'hoifancuongonepiece@gmail.com'
]

export async function middleware(request) {

    if(request.method === 'PUT' || request.method === 'POST' || request.method === 'DELETE'){

        const headersList = headers()
        const token = headersList.get('authorization').replace('Bearer ', '');
        const secret = new TextEncoder().encode(process.env.MY_AUTH_KEY);

        try {
            const { payload } = await jose.jwtVerify(token, secret);
            if (!listEmailApproved.includes(payload.email)) {
                throw new Error();
            }
        } catch(err) {
            console.log(err);
            return NextResponse.json({ error: "Failed to authenticate." }, { status: 400 });
        }

    }

    if(request.method === 'OPTIONS'){
        return new NextResponse({ status: 400, headers: {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        }});
    }

    return NextResponse.next()

}
 
export const config = {
    matcher: ['/upload/:path*', '/delete/:path*'],
}