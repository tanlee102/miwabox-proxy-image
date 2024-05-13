import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import * as jose from 'jose'

const listEmailApproved = [
    'xemtua@gmail.com',
    'hoifancuongonepiece@gmail.com'
]

export async function middleware(request) {

    const headersList = headers()
    const myAuthorization = headersList.get('mytoken');

    console.log(headersList)

    if(myAuthorization){

        const token = headersList.get('mytoken').replace('Bearer ', '');
        const secret = new TextEncoder().encode(process.env.MY_AUTH_KEY);
    
        // try {
        //     const { payload: { email } } = await jose.jwtVerify(token, secret);
        //     if (!listEmailApproved.includes(email)) {
        //         throw new Error();
        //     }
        // } catch(err) {
        //     console.log(err);
        //     return NextResponse.json({ error: "Failed to authenticate." }, { status: 400, headers: {
        //         "Content-Type": "*",
        //         "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Headers": "Content-Type, Authorization",
        //         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        //     }});
        // }
    }else if(request.method === 'OPTIONS'){
        const headers = {
            "Content-Type": "application/json, text/plain, */*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        }
        return new NextResponse({ status: 200, headers });
    }else{
        return NextResponse.json({ error: "Failed to authenticate." }, { status: 400, headers: {
            "Content-Type": "application/json, text/plain, */*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        }});
    }

}

export const config = {
    matcher: ['/api/:path*', '/delete/:path*'],
}