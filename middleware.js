import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import * as jose from 'jose'

const listEmailApproved = [
    'xemtua@gmail.com',
    'hoifancuongonepiece@gmail.com'
]

export async function middleware(request) {

    if(request.method === 'PUT'){
        const headersList = headers()
        const token = headersList.get('authorization').replace('Bearer ', '');
        const secret = new TextEncoder().encode(process.env.MY_AUTH_KEY);

        if (!pathName.startsWith(matchString)) {
            try {
                const { payload } = await jose.jwtVerify(token, secret);

                console.log(payload)

                if (!listEmailApproved.includes(payload.email)) {
                    throw new Error();
                }
            } catch(err) {
                console.log(err);
                return NextResponse.json({ error: "Failed to authenticate." }, { status: 400 });
            }
        }

    }

    return NextResponse.next()

}
 
export const config = {
    matcher: ['/upload/:path*', '/delete/:path*'],
}