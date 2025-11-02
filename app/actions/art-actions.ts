"use server"
import { v2 as cloudinary } from "cloudinary"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { auth } from "@clerk/nextjs/server"  // Added import for auth

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function createArtListing(formData: FormData) {
  const { userId } = await auth()  // Get userId from Clerk auth
  if (!(await isAdmin(userId ?? undefined))) {  // Pass userId to isAdmin, handle null case
    return {
      success: false,
      message: "Unauthorized. Only admins can create art listings.",
    }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") as string
    const material = formData.get("material") as string || ""
    const region = formData.get("region") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const size = formData.get("size") as string
    const featured = formData.get("featured") === "on"

    // Validate required fields
    if (!title || !description || !categoryId || !region || isNaN(price) || !size) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Get the uploaded images from the form
    const uploadedImages = formData.getAll("images") as File[]
    let images: string[] = []

    // If we have uploaded images, process them
    if (
      uploadedImages &&
      uploadedImages.length > 0 &&
      uploadedImages[0] instanceof File &&
      uploadedImages[0].size > 0
    ) {
      // Upload each image to Cloudinary
      for (const file of uploadedImages) {
        try {
          // Convert File to buffer or stream as needed
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          // Upload to Cloudinary
          const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "arts_afrik" },
              (error: any, result: any) => {
                if (error) {
                  console.error("Cloudinary upload error:", error)
                  reject(error)
                } else {
                  resolve(result as { secure_url: string })
                }
              }
            )
            uploadStream.end(buffer)
          })

          images.push(uploadResult.secure_url)
        } catch (uploadError) {
          console.error("Error uploading image to Cloudinary:", uploadError)
          // Abort upload process on error
          return {
            success: false,
            message: `Error uploading image: ${
              uploadError instanceof Error
                ? uploadError.message
                : typeof uploadError === "object"
                ? JSON.stringify(uploadError)
                : String(uploadError)
            }`,
          }
        }
      }
    } else {
      // Use default placeholder if no images were uploaded
      images = [`/placeholder.svg?height=600&width=400&text=${encodeURIComponent(title)}`]
    }

    // Create the art listing in the database
    const artListing = await prisma.artListing.create({
      data: {
        title,
        description,
        categoryId,
        material,
        region,
        price,
        size,
        featured,
        images,
      },
    })

    // Make sure to revalidate both the gallery and home pages
    revalidatePath("/gallery")
    revalidatePath("/")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Art listing created successfully",
      artId: artListing.id,
    }
  } catch (error) {
    console.error("Error creating art listing:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return {
      success: false,
      message: "There was an error creating the art listing. Please try again.",
    }
  }
}

export async function updateArtListing(formData: FormData) {
  const { userId } = await auth()  // Get userId from Clerk auth
  if (!(await isAdmin(userId ?? undefined))) {  // Pass userId to isAdmin, handle null case
    return {
      success: false,
      message: "Unauthorized. Only admins can update art listings.",
    }
  }

  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") as string
    const material = formData.get("material") as string || ""
    const region = formData.get("region") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const size = formData.get("size") as string
    const featured = formData.get("featured") === "on"

    // Validate required fields
    if (!id || !title || !description || !categoryId || !region || isNaN(price) || !size) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Update the art listing in the database
    await prisma.artListing.update({
      where: { id },
      data: {
        title,
        description,
        categoryId,
        material,
        region,
        price,
        size,
        featured,
      },
    })

    revalidatePath("/gallery")
    revalidatePath(`/gallery/${id}`)
    revalidatePath("/")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Art listing updated successfully",
    }
  } catch (error) {
    console.error("Error updating art listing:", error)
    return {
      success: false,
      message: "There was an error updating the art listing. Please try again.",
    }
  }
}

export async function toggleFeatured(id: string) {
  const { userId } = await auth()  // Get userId from Clerk auth
  if (!(await isAdmin(userId ?? undefined))) {  // Pass userId to isAdmin, handle null case
    return {
      success: false,
      message: "Unauthorized. Only admins can update art listings.",
    }
  }

  try {
    // Get the current art listing
    const artListing = await prisma.artListing.findUnique({
      where: { id },
    })

    if (!artListing) {
      return {
        success: false,
        message: "Art listing not found",
      }
    }

    // Toggle the featured status
    await prisma.artListing.update({
      where: { id },
      data: {
        featured: !artListing.featured,
      },
    })

    revalidatePath("/gallery")
    revalidatePath("/")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: `Art listing ${artListing.featured ? "unfeatured" : "featured"} successfully`,
    }
  } catch (error) {
    console.error("Error toggling featured status:", error)
    return {
      success: false,
      message: "There was an error updating the art listing. Please try again.",
    }
  }
}

export async function deleteArtListing(id: string) {
  const { userId } = await auth()  // Get userId from Clerk auth
  if (!(await isAdmin(userId ?? undefined))) {  // Pass userId to isAdmin, handle null case
    return {
      success: false,
      message: "Unauthorized. Only admins can delete art listings.",
    }
  }

  try {
    // Check if the art listing exists
    const artListing = await prisma.artListing.findUnique({
      where: { id },
    })

    if (!artListing) {
      return {
        success: false,
        message: "Art listing not found",
      }
    }

    // Delete the art listing
    await prisma.artListing.delete({
      where: { id },
    })

    revalidatePath("/gallery")
    revalidatePath("/")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Art listing deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting art listing:", error)
    return {
      success: false,
      message: "There was an error deleting the art listing. Please try again.",
    }
  }
}
