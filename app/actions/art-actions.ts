"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Function to check if user is admin
async function isAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  // In a real app, you would check if the user has admin role
  // For now, we'll assume the authenticated user is an admin
  return true
}

// In the createArtListing function, update how we handle images
export async function createArtListing(formData: FormData) {
  if (!(await isAdmin())) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create art listings.",
    }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const woodType = formData.get("woodType") as string
    const region = formData.get("region") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const size = formData.get("size") as string
    const featured = formData.get("featured") === "on"

    // Validate required fields
    if (!title || !description || !woodType || !region || isNaN(price) || !size) {
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
      // For demonstration, log the image details
      console.log(`Processing ${uploadedImages.length} images`)

      // In a real implementation, you would upload each image to Cloudinary
      // For now, we'll use placeholder images
      images = uploadedImages.map(
        (_, index) => `arts_afrik/${woodType.toLowerCase()}/${title.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
      )

      // Note: In a production environment, you would use the Cloudinary API to upload images
      // Example:
      /*
      const uploadPromises = uploadedImages.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        
        const data = await response.json();
        return data.public_id; // Return the Cloudinary public_id
      });
      
      images = await Promise.all(uploadPromises);
      */
    } else {
      // Use default placeholder if no images were uploaded
      images = [`arts_afrik/${woodType.toLowerCase()}/placeholder-${Date.now()}`]
    }

    // Create the art listing in the database
    const artListing = await prisma.artListing.create({
      data: {
        title,
        description,
        woodType,
        region,
        price,
        size,
        featured,
        images,
      },
    })

    revalidatePath("/gallery")
    revalidatePath("/")

    return {
      success: true,
      message: "Art listing created successfully",
      artId: artListing.id,
    }
  } catch (error) {
    console.error("Error creating art listing:", error)
    return {
      success: false,
      message: "There was an error creating the art listing. Please try again.",
    }
  }
}

export async function updateArtListing(formData: FormData) {
  if (!(await isAdmin())) {
    return {
      success: false,
      message: "Unauthorized. Only admins can update art listings.",
    }
  }

  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const woodType = formData.get("woodType") as string
    const region = formData.get("region") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const size = formData.get("size") as string
    const featured = formData.get("featured") === "on"

    // Validate required fields
    if (!id || !title || !description || !woodType || !region || isNaN(price) || !size) {
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
        woodType,
        region,
        price,
        size,
        featured,
      },
    })

    revalidatePath("/gallery")
    revalidatePath(`/gallery/${id}`)
    revalidatePath("/")

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
  if (!(await isAdmin())) {
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
