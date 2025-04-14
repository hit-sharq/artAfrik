import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/gallery", "/gallery/(.*)", "/about", "/contact", "/sign-in(.*)", "/sign-up(.*)"],

  // Routes that can be accessed if the user is signed in
  // but don't require admin access
  ignoredRoutes: ["/api/webhook/clerk"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
