import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const userId = await auth(); // Auth returns user details or undefined

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return; 
  }

  // If userId is null, throw an error or redirect, depending on your requirements
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // If you need to get a token in the header or for API use, you can do it like this:
  // const token = await auth.getToken();

  // Optionally implement further checks or logic here
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
