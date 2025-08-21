import { NextResponse, NextRequest } from 'next/server'
//  import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
export {default } from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export  async function middleware(request: NextRequest) {
const token = await getToken({req:request})
const url = request.nextUrl
    if(token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/') 

    )){
      // console.log(token)
        // return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/sign-in',request.url));
    }
//   return NextResponse.redirect(new URL('/home', request.url))
return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',
    '/dashboard/:path'

  ]
}
// import { clerkMiddleware } from '@clerk/nextjs/server';

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };