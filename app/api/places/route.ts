import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/places - Search and list places
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build search filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Text search on name and description
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    // Filter by type
    if (type && type !== "all") {
      where.type = type;
    }

    // Execute query with pagination
    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.place.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: places,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch places",
      },
      { status: 500 }
    );
  }
}

// POST /api/places - Create a new place
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, type, description, address, phone } = body;

    if (!name || !type || !description || !address || !phone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: name, type, description, address, phone",
        },
        { status: 400 }
      );
    }

    // Create new place with Prisma
    const place = await prisma.place.create({
      data: {
        name,
        type,
        description,
        address,
        phone,
        email: body.email,
        website: body.website,
        images: body.images || [],
        rating: body.rating,
        reviewCount: body.reviewCount,
        openingHours: body.openingHours,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: place,
        message: "Place created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating place:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create place",
      },
      { status: 500 }
    );
  }
}
