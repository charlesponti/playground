import { covidData, db } from "~/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get all unique countries from the database
    const countries = await db
      .select({
        code: covidData.isoCode,
        name: covidData.location,
      })
      .from(covidData)
      .where(
        sql`${covidData.isoCode} IS NOT NULL 
            AND ${covidData.location} IS NOT NULL 
            AND ${covidData.isoCode} NOT LIKE 'OWID_%'`
      )
      .groupBy(covidData.isoCode, covidData.location)
      .orderBy(covidData.location);

    // Add world option and format data
    const formattedCountries = [
      { code: "OWID_WRL", name: "🌍 World (Global Data)" },
      ...countries.map((country) => ({
        code: country.code as string,
        name: country.name as string,
      })),
    ];

    return NextResponse.json({
      data: formattedCountries,
      total: formattedCountries.length,
    });
  } catch (error) {
    console.error("Failed to load countries:", error);
    return NextResponse.json(
      { error: "Failed to load countries" },
      { status: 500 }
    );
  }
}
