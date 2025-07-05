// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith("/about")) {
//     // This logic is only applied to /about
//   }

//   if (request.nextUrl.pathname.startsWith("/auth")) {
//     return ShouldNotBeLogged(request);
//   }

//   if (request.nextUrl.pathname.startsWith("/needlogin")) {
//     return ShouldBeLogged(request);
//   }
// }

// function ShouldBeLogged(request: NextRequest) {
//   const { origin } = request.nextUrl;
//   const isLogged = Boolean(request.cookies.get("token"));

//   if (isLogged) {
//     return NextResponse.next();
//   } else {
//     return NextResponse.redirect(`${origin}/signin`);
//   }
// }

// function ShouldNotBeLogged(request: NextRequest) {
//   const { origin } = request.nextUrl;
//   const isLogged = Boolean(request.cookies.get("token"));

//   if (!isLogged) {
//     return NextResponse.next();
//   } else {
//     return NextResponse.redirect(`${origin}/`);
//   }
// }

export function middleware() {}
