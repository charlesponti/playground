"use server";

import { covidData, db } from "~/db";
import type { CovidDataSelect } from "~/db/schema";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

interface ApiResponse {
  data: CovidDataSelect[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    country: string | null;
    startDate: string | null;
    endDate: string | null;
  };
}

// Cache configuration for different data types
const CACHE_CONFIGS = {
  stats: {
    tags: ["covid-stats"] as string[],
    revalidate: 3600, // 1 hour
  },
  timeseries: {
    tags: ["covid-timeseries"] as string[],
    revalidate: 1800, // 30 minutes
  },
  global: {
    tags: ["covid-global"] as string[],
    revalidate: 3600, // 1 hour
  },
};

// Server action to fetch COVID stats - lightweight, can be cached
export const getCovidStats = unstable_cache(
  async (countryCode: string): Promise<ApiResponse> => {
    try {
      const conditions = [];

      if (countryCode && countryCode !== "OWID_WRL") {
        conditions.push(eq(covidData.isoCode, countryCode));
      } else {
        conditions.push(eq(covidData.isoCode, "OWID_WRL"));
      }

      // Get latest data for stats
      const records = await db
        .select()
        .from(covidData)
        .where(and(...conditions))
        .orderBy(sql`${covidData.date} DESC`)
        .limit(1);

      return {
        data: records,
        pagination: {
          page: 1,
          limit: 1,
          total: records.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        filters: {
          country: countryCode,
          startDate: null,
          endDate: null,
        },
      };
    } catch (error) {
      console.error("Error fetching COVID stats:", error);
      throw new Error("Failed to fetch COVID statistics");
    }
  },
  ["covid-stats"],
  CACHE_CONFIGS.stats
);

// Server action to fetch COVID time series data - NO CACHE due to size
export async function getCovidTimeSeries(
  countryCode: string,
  limit = 1000
): Promise<ApiResponse> {
  try {
    const conditions = [];

    if (countryCode && countryCode !== "OWID_WRL") {
      conditions.push(eq(covidData.isoCode, countryCode));
    } else {
      conditions.push(eq(covidData.isoCode, "OWID_WRL"));
    }

    // Fetch recent data only to reduce size
    const records = await db
      .select()
      .from(covidData)
      .where(and(...conditions))
      .orderBy(sql`${covidData.date} DESC`)
      .limit(limit);

    return {
      data: records.reverse(), // Reverse to get chronological order
      pagination: {
        page: 1,
        limit,
        total: records.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      filters: {
        country: countryCode,
        startDate: null,
        endDate: null,
      },
    };
  } catch (error) {
    console.error("Error fetching COVID time series:", error);
    throw new Error("Failed to fetch COVID time series data");
  }
}

// Server action to fetch global comparison data - NO CACHE due to size
export async function getGlobalComparisonData(
  limit = 50
): Promise<ApiResponse> {
  try {
    // Get latest data for all countries - reduced limit
    const records = await db
      .select()
      .from(covidData)
      .where(
        and(
          isNotNull(covidData.totalCases),
          sql`${covidData.date} IN (
            SELECT MAX(date) 
            FROM ${covidData} 
            WHERE iso_code = ${covidData.isoCode}
              AND total_cases IS NOT NULL
          )`
        )
      )
      .orderBy(sql`${covidData.totalCases} DESC`)
      .limit(limit);

    return {
      data: records,
      pagination: {
        page: 1,
        limit,
        total: records.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      filters: {
        country: null,
        startDate: null,
        endDate: null,
      },
    };
  } catch (error) {
    console.error("Error fetching global comparison data:", error);
    throw new Error("Failed to fetch global comparison data");
  }
}

// Server action to get available countries for static generation
export const getAvailableCountries = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const countries = await db
        .selectDistinct({ isoCode: covidData.isoCode })
        .from(covidData)
        .where(isNotNull(covidData.isoCode));

      return countries.map((c) => c.isoCode).filter(Boolean) as string[];
    } catch (error) {
      console.error("Error fetching available countries:", error);
      return [];
    }
  },
  ["available-countries"],
  {
    tags: ["available-countries"] as string[],
    revalidate: 86400, // 24 hours
  }
);

// Helper to revalidate cache
export async function revalidateCovidData(tags?: string[]) {
  const { revalidateTag } = await import("next/cache");

  const tagsToRevalidate = tags || [
    "covid-stats",
    "covid-timeseries",
    "covid-global",
    "available-countries",
  ];

  for (const tag of tagsToRevalidate) {
    revalidateTag(tag);
  }
}
