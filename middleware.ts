import { authMiddleware } from "@clerk/nextjs/server"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/gallery",
    "/gallery/(.*)",
    "/about",
    "/contact",
    "/blog",
    "/blog/(.*)",
    "/api/categories",
    "/api/art-listings",
    "/api/artisans/register",
    "/api/artisans/shop/(.*)",
    "/artisan/register",
    "/artisan/register/success",
    "/shop/(.*)",
  ],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
