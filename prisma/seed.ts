import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.place.deleteMany();

  // Create 5+ sample places
  const places = await prisma.place.createMany({
    data: [
      {
        name: "Хаан Ресторан",
        type: "restaurant",
        description: "Монгол хоол, орчин үеийн орчин",
        address: "Сүхбаатар дүүрэг, 1-р хороо",
        phone: "+976-7711-1234",
        email: "khan@restaurant.mn",
        images: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        ],
        rating: 4.5,
        reviewCount: 120,
      },
      {
        name: "Тэнгэр Ресторан",
        type: "restaurant",
        description: "Монгол хоолны газар, орчин үеийн орчин",
        address: "Баянзүрх дүүрэг, 5-р хороо",
        phone: "+976-7722-5678",
        email: "tengger@restaurant.mn",
        images: [
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
        ],
        rating: 4.8,
        reviewCount: 89,
      },
      {
        name: "Эрүүл Мэнд Клиник",
        type: "clinic",
        description: "Өргөний эмчилгээ, сувилгаа",
        address: "Хан-Уул дүүрэг, 5-р хороо",
        phone: "+976-7722-8678",
        email: "info@healthclinic.mn",
        images: [
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        ],
        rating: 4.6,
        reviewCount: 234,
      },
      {
        name: "Тех Дэлгүүр",
        type: "shop",
        description: "Цахилгаан бараа, гар утас",
        address: "Баянзүрх дүүрэг, 3-р хороо",
        phone: "+976-7733-6012",
        email: "shop@techstore.mn",
        images: [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        ],
        rating: 4.3,
        reviewCount: 456,
      },
      {
        name: 'Зочид Буудал "Номин"',
        type: "hotel",
        description: "Тав тухтай байр, өндөр чанарын үйлчилгээ",
        address: "Сүхбаатар дүүрэг, 8-р хороо",
        phone: "+976-7744-2222",
        email: "info@nominhotel.mn",
        website: "https://nominhotel.mn",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        ],
        rating: 4.7,
        reviewCount: 178,
      },
      {
        name: 'Кофе Хаус "Амар"',
        type: "restaurant",
        description: "Кофе, цай болон амттан",
        address: "Чингэлтэй дүүрэг, 4-р хороо",
        phone: "+976-7755-3333",
        email: "coffee@amar.mn",
        images: [
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
        ],
        rating: 4.4,
        reviewCount: 92,
      },
    ],
  });

  console.log(`Created ${places.count} places`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
