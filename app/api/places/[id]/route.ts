import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/places/[id] - Get single place by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find place by ID
    const place = await prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      return NextResponse.json(
        { success: false, error: "Place not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: place,
    });
  } catch (error) {
    console.error("Error fetching place:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch place",
      },
      { status: 500 }
    );
  }
}

// PUT /api/places/[id] - Update place
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update place with Prisma
    const place = await prisma.place.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: place,
      message: "Place updated successfully",
    });
  } catch (error) {
    console.error("Error updating place:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Place not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update place",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/places/[id] - Delete place
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete place with Prisma
    await prisma.place.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Place deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting place:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Place not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete place",
      },
      { status: 500 }
    );
  }
}
