import { NextRequest, NextResponse } from "next/server";

import { US_CITIES } from "@/utils/us-cities";

export interface CityResponse {
  data: Array<{
    value: string;
    label: string;
    state: string;
    city: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const search = searchParams.get("search") || "";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        { error: "Page must be greater than 0" },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Filter cities based on search query
    let filteredCities = US_CITIES;

    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filteredCities = US_CITIES.filter(
        (city) =>
          city.label.toLowerCase().includes(searchTerm) ||
          city.city.toLowerCase().includes(searchTerm) ||
          city.state.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate pagination
    const total = filteredCities.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated results
    const paginatedCities = filteredCities.slice(startIndex, endIndex);

    // Build response
    const response: CityResponse = {
      data: paginatedCities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
