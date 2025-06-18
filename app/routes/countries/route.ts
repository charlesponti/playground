import { covidData, db } from "~/db";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// Force this route to use Node.js runtime (not Edge)
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const country = searchParams.get("country");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Math.min(
      Number.parseInt(searchParams.get("limit") || "50"),
      100
    ); // Max 100 items per page

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        { error: "Page must be greater than 0" },
        { status: 400 }
      );
    }

    if (limit < 1) {
      return NextResponse.json(
        { error: "Limit must be greater than 0" },
        { status: 400 }
      );
    }

    // Build where conditions
    const conditions = [
      sql`${covidData.isoCode} IS NOT NULL`,
      sql`${covidData.location} IS NOT NULL`,
    ];

    if (country) {
      conditions.push(eq(covidData.location, country));
    }

    if (startDate) {
      conditions.push(gte(covidData.date, startDate));
    }

    if (endDate) {
      conditions.push(lte(covidData.date, endDate));
    }

    // If no filters are applied, return unique countries list
    if (!country && !startDate && !endDate) {
      const countries = await db
        .select({
          name: covidData.location,
          code: covidData.isoCode,
        })
        .from(covidData)
        .where(and(...conditions))
        .groupBy(covidData.location, covidData.isoCode)
        .orderBy(covidData.location)
        .limit(limit)
        .offset((page - 1) * limit);

      // Get total count for pagination
      const totalResult = await db
        .select({ count: sql<number>`count(distinct ${covidData.location})` })
        .from(covidData)
        .where(and(...conditions));

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limit);

      const formattedCountries = countries
        .filter((country) => country.name && country.code)
        .map((country) => ({
          name: country.name as string,
          code: country.code as string,
        }));

      return NextResponse.json({
        data: formattedCountries,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    }

    // If filters are applied, return filtered COVID data
    const covidRecords = await db
      .select()
      .from(covidData)
      .where(and(...conditions))
      .orderBy(covidData.date, covidData.location)
      .limit(limit)
      .offset((page - 1) * limit);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(covidData)
      .where(and(...conditions));

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: covidRecords,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        country,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Failed to load countries:", error);
    return NextResponse.json(
      { error: "Failed to load countries" },
      { status: 500 }
    );
  }
}
