import { covidData, db } from "~/db";
import type { CovidDataSelect } from "~/db/schema";
import { and, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
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
    const queryType = searchParams.get("type") || "timeseries"; // timeseries, latest, stats
    const limit = Math.min(
      Number.parseInt(searchParams.get("limit") || "1000"),
      10000
    );

    // Build base conditions
    const conditions = [];

    // Filter by country if provided
    if (country && country !== "OWID_WRL") {
      conditions.push(eq(covidData.isoCode, country));
    } else if (!country || country === "OWID_WRL") {
      // For global/world data, specifically use OWID_WRL
      if (queryType === "timeseries" || queryType === "stats") {
        conditions.push(eq(covidData.isoCode, "OWID_WRL"));
      }
    }

    // Filter by date range if provided
    if (startDate) {
      conditions.push(gte(covidData.date, startDate));
    }

    if (endDate) {
      conditions.push(lte(covidData.date, endDate));
    }

    let records: CovidDataSelect[];

    switch (queryType) {
      case "stats":
        // Get latest data for specific country for stats overview
        if (country && country !== "global") {
          const countryCondition =
            country === "OWID_WRL"
              ? eq(covidData.isoCode, "OWID_WRL")
              : eq(covidData.isoCode, country);

          // For all countries (including World), we need to merge case/death data with vaccination data
          // since Our World in Data stopped updating case/death data around Sept 2022
          // but may still have more recent vaccination data

          const latestCaseRecord = await db
            .select()
            .from(covidData)
            .where(and(countryCondition, isNotNull(covidData.totalCases)))
            .orderBy(sql`date DESC`)
            .limit(1);

          const latestVaccineRecord = await db
            .select()
            .from(covidData)
            .where(
              and(countryCondition, isNotNull(covidData.peopleFullyVaccinated))
            )
            .orderBy(sql`date DESC`)
            .limit(1);

          // Merge the records, prioritizing case/death data from the latest case record
          // and vaccination data from the latest vaccine record
          if (latestCaseRecord.length > 0 && latestVaccineRecord.length > 0) {
            const mergedRecord = {
              ...latestCaseRecord[0],
              // Update vaccination fields from the more recent record if available
              totalVaccinations:
                latestVaccineRecord[0].totalVaccinations ||
                latestCaseRecord[0].totalVaccinations,
              peopleVaccinated:
                latestVaccineRecord[0].peopleVaccinated ||
                latestCaseRecord[0].peopleVaccinated,
              peopleFullyVaccinated:
                latestVaccineRecord[0].peopleFullyVaccinated ||
                latestCaseRecord[0].peopleFullyVaccinated,
              totalBoosters:
                latestVaccineRecord[0].totalBoosters ||
                latestCaseRecord[0].totalBoosters,
              newVaccinations:
                latestVaccineRecord[0].newVaccinations ||
                latestCaseRecord[0].newVaccinations,
              newVaccinationsSmoothed:
                latestVaccineRecord[0].newVaccinationsSmoothed ||
                latestCaseRecord[0].newVaccinationsSmoothed,
              totalVaccinationsPerHundred:
                latestVaccineRecord[0].totalVaccinationsPerHundred ||
                latestCaseRecord[0].totalVaccinationsPerHundred,
              peopleVaccinatedPerHundred:
                latestVaccineRecord[0].peopleVaccinatedPerHundred ||
                latestCaseRecord[0].peopleVaccinatedPerHundred,
              peopleFullyVaccinatedPerHundred:
                latestVaccineRecord[0].peopleFullyVaccinatedPerHundred ||
                latestCaseRecord[0].peopleFullyVaccinatedPerHundred,
              totalBoostersPerHundred:
                latestVaccineRecord[0].totalBoostersPerHundred ||
                latestCaseRecord[0].totalBoostersPerHundred,
              // Add vaccination record date for reference if different
              ...(latestVaccineRecord[0].date !== latestCaseRecord[0].date && {
                vaccinationDataDate: latestVaccineRecord[0].date,
              }),
            };
            records = [mergedRecord];
          } else if (latestCaseRecord.length > 0) {
            records = latestCaseRecord;
          } else if (latestVaccineRecord.length > 0) {
            records = latestVaccineRecord;
          } else {
            // Fallback to latest record regardless of null values
            records = await db
              .select()
              .from(covidData)
              .where(countryCondition)
              .orderBy(sql`date DESC`)
              .limit(1);
          }
        } else {
          // Global stats - same logic as individual countries
          const latestCaseRecord = await db
            .select()
            .from(covidData)
            .where(
              and(
                eq(covidData.isoCode, "OWID_WRL"),
                isNotNull(covidData.totalCases)
              )
            )
            .orderBy(sql`date DESC`)
            .limit(1);

          const latestVaccineRecord = await db
            .select()
            .from(covidData)
            .where(
              and(
                eq(covidData.isoCode, "OWID_WRL"),
                isNotNull(covidData.peopleFullyVaccinated)
              )
            )
            .orderBy(sql`date DESC`)
            .limit(1);

          if (latestCaseRecord.length > 0 && latestVaccineRecord.length > 0) {
            const mergedRecord = {
              ...latestCaseRecord[0],
              totalVaccinations:
                latestVaccineRecord[0].totalVaccinations ||
                latestCaseRecord[0].totalVaccinations,
              peopleVaccinated:
                latestVaccineRecord[0].peopleVaccinated ||
                latestCaseRecord[0].peopleVaccinated,
              peopleFullyVaccinated:
                latestVaccineRecord[0].peopleFullyVaccinated ||
                latestCaseRecord[0].peopleFullyVaccinated,
              totalBoosters:
                latestVaccineRecord[0].totalBoosters ||
                latestCaseRecord[0].totalBoosters,
              newVaccinations:
                latestVaccineRecord[0].newVaccinations ||
                latestCaseRecord[0].newVaccinations,
              newVaccinationsSmoothed:
                latestVaccineRecord[0].newVaccinationsSmoothed ||
                latestCaseRecord[0].newVaccinationsSmoothed,
              totalVaccinationsPerHundred:
                latestVaccineRecord[0].totalVaccinationsPerHundred ||
                latestCaseRecord[0].totalVaccinationsPerHundred,
              peopleVaccinatedPerHundred:
                latestVaccineRecord[0].peopleVaccinatedPerHundred ||
                latestCaseRecord[0].peopleVaccinatedPerHundred,
              peopleFullyVaccinatedPerHundred:
                latestVaccineRecord[0].peopleFullyVaccinatedPerHundred ||
                latestCaseRecord[0].peopleFullyVaccinatedPerHundred,
              totalBoostersPerHundred:
                latestVaccineRecord[0].totalBoostersPerHundred ||
                latestCaseRecord[0].totalBoostersPerHundred,
              ...(latestVaccineRecord[0].date !== latestCaseRecord[0].date && {
                vaccinationDataDate: latestVaccineRecord[0].date,
              }),
            };
            records = [mergedRecord];
          } else if (latestCaseRecord.length > 0) {
            records = latestCaseRecord;
          } else {
            records = latestVaccineRecord;
          }
        }
        break;

      case "latest":
        // Get latest data per country for comparisons/rankings
        // Use a subquery to get max date per location
        records = await db
          .select()
          .from(covidData)
          .where(
            sql`(location, date) IN (
              SELECT location, MAX(date) 
              FROM covid_data 
              WHERE location IS NOT NULL 
                AND iso_code IS NOT NULL 
                AND iso_code NOT LIKE 'OWID_%'
              GROUP BY location
            )`
          )
          .orderBy(covidData.totalCasesPerMillion)
          .limit(limit);
        break;

      case "timeseries": {
        // Get time series data for charts - must be for ONE country only
        if (!country) {
          return NextResponse.json(
            { error: "Country parameter is required for timeseries data" },
            { status: 400 }
          );
        }

        const countryCondition =
          country === "OWID_WRL"
            ? eq(covidData.isoCode, "OWID_WRL")
            : eq(covidData.isoCode, country);

        conditions.push(countryCondition);

        // Add filter to ensure we have valid date data
        conditions.push(sql`${covidData.date} IS NOT NULL`);

        const whereConditions =
          conditions.length > 0 ? and(...conditions) : undefined;

        records = await db
          .select()
          .from(covidData)
          .where(whereConditions)
          .orderBy(covidData.date) // Only order by date since we're filtering to one country
          .limit(limit);
        break;
      }

      default: {
        // Default to timeseries
        const whereConditions =
          conditions.length > 0 ? and(...conditions) : undefined;

        records = await db
          .select()
          .from(covidData)
          .where(whereConditions)
          .orderBy(covidData.date, covidData.location)
          .limit(limit);
        break;
      }
    }

    return NextResponse.json({
      data: records,
      queryType,
      filters: {
        country,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Failed to load COVID data:", error);
    return NextResponse.json(
      { error: "Failed to load COVID data" },
      { status: 500 }
    );
  }
}
