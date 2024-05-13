import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import * as jose from 'jose'

const listEmailApproved = [
    'xemtua@gmail.com',
    'hoifancuongonepiece@gmail.com'
]

export async function middleware(request) {

    const headersList = headers()
    console.log(headersList)
    const token = headersList.get('Authorization').replace('Bearer ', '');
    const secret = new TextEncoder().encode(process.env.MY_AUTH_KEY);

    try {
        const { payload: { email } } = await jose.jwtVerify(token, secret);
        if (!listEmailApproved.includes(email)) {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Failed to authenticate." }, { status: 400, headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST",
        }});
    }

}

export const config = {
    matcher: ['/api/:path*', '/delete/:path*'],
}