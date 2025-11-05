import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // All routes except static files and _next internals
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Optional: include root and auth pages explicitly
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],
}
