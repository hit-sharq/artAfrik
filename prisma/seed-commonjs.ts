const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create some initial art listings
  const artListings = [
    {
      title: "Traditional Mask",
      description:
        "This traditional mask is hand-carved from ebony wood by skilled artisans in West Africa. Each piece is unique and carries cultural significance, representing ancestral spirits and traditional ceremonies.",
      price: 120,
      woodType: "Ebony",
      region: "West Africa",
      size: '12" x 6" x 3"',
      images: ["/placeholder.svg?height=600&width=400"],
      featured: true,
    },
    {
      title: "Tribal Statue",
      description:
        "This tribal statue is meticulously crafted from rosewood, showcasing the rich artistic traditions of East Africa. The statue represents fertility and abundance, and is often used in ceremonial contexts.",
      price: 150,
      woodType: "Rosewood",
      region: "East Africa",
      size: '18" x 5" x 5"',
      images: ["/placeholder.svg?height=600&width=400"],
      featured: false,
    },
    {
      title: "Animal Figurine",
      description:
        "This beautifully crafted animal figurine is made from mahogany wood by master carvers in Central Africa. It represents the spiritual connection between humans and animals in African mythology.",
      price: 85,
      woodType: "Mahogany",
      region: "Central Africa",
      size: '8" x 4" x 4"',
      images: ["/placeholder.svg?height=600&width=400"],
      featured: true,
    },
  ];

  for (const art of artListings) {
    await prisma.artListing.create({
      data: art,
    });
  }

  // Create an admin user if not exists
  await prisma.user.upsert({
    where: { clerkId: "user_2viMQ6RJZj3nsqhX6xQkTWeYXUs" }, // Replace with your actual Clerk user ID
    update: {},
    create: {
      clerkId: "user_2viMQ6RJZj3nsqhX6xQkTWeYXUs", // Replace with your actual Clerk user ID
      role: "admin",
    },
  });

  // Create another admin user if not exists
  await prisma.user.upsert({
    where: { clerkId: "user_2w2Wa9Cfm4zh2ylxrBIjKDmsbyb" },
    update: {},
    create: {
      clerkId: "user_2w2Wa9Cfm4zh2ylxrBIjKDmsbyb",
      role: "admin",
    },
  });

  console.log("Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
