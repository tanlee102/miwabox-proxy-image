import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
 
const listEmailApproved = [
    'xemtua@gmail.com',
    'hoifancuongonepiece@gmail.com'
]

export function middleware(request) {

    if(request.method === 'PUT'){
        const headersList = headers()
        const token = headersList.get('authorization').replace('Bearer ', '');
        console.log(token)
    }

    return NextResponse.next()

}
 
export const config = {
    matcher: ['/upload/:path*', '/delete/:path*'],
}