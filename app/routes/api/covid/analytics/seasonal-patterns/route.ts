import { covidData, db } from "~/db";
import { and, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface SeasonalPattern {
  season: "Spring" | "Summer" | "Fall" | "Winter";
  months: string[];
  avgCases: number;
  avgDeaths: number;
  avgVaccinations: number;
  peakMonth: string;
  peakValue: number;
  pattern: "Increasing" | "Decreasing" | "Stable";
}

interface MonthlyData {
  year: number;
  month: number;
  monthName: string;
  avgCases: number;
  avgDeaths: number;
  avgVaccinations: number;
  totalDays: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "OWID_WRL";
    const metric = searchParams.get("metric") || "newCasesSmoothed";

    // Get data spanning multiple years for seasonal analysis
    const data = await db
      .select({
        date: covidData.date,
        newCasesSmoothed: covidData.newCasesSmoothed,
        newDeathsSmoothed: covidData.newDeathsSmoothed,
        newVaccinationsSmoothed: covidData.newVaccinationsSmoothed,
      })
      .from(covidData)
      .where(
        and(
          eq(covidData.isoCode, country),
          gte(covidData.date, "2020-03-01") // Start from March 2020
        )
      )
      .orderBy(covidData.date);

    if (data.length === 0) {
      return NextResponse.json(
        { error: "No data found for this country" },
        { status: 404 }
      );
    }

    // Filter valid data
    const validData = data
      .filter(
        (d) =>
          d.date && d.newCasesSmoothed !== null && d.newDeathsSmoothed !== null
      )
      .map((d) => ({
        date: d.date as string,
        newCasesSmoothed: d.newCasesSmoothed as number,
        newDeathsSmoothed: d.newDeathsSmoothed as number,
        newVaccinationsSmoothed: d.newVaccinationsSmoothed,
      }));

    if (validData.length < 365) {
      // Need at least a year of data
      return NextResponse.json(
        { error: "Insufficient data for seasonal analysis" },
        { status: 400 }
      );
    }

    // Group data by month and year
    const monthlyData = groupByMonth(validData);

    // Calculate seasonal patterns
    const seasonalPatterns = calculateSeasonalPatterns(monthlyData);

    // Calculate year-over-year trends
    const yearlyTrends = calculateYearlyTrends(monthlyData);

    // Identify peak months across years
    const monthlyAverages = calculateMonthlyAverages(monthlyData);

    return NextResponse.json({
      country,
      metric,
      seasonalPatterns,
      yearlyTrends,
      monthlyAverages,
      dataSpan: {
        startDate: validData[0].date,
        endDate: validData[validData.length - 1].date,
        totalDataPoints: validData.length,
      },
    });
  } catch (error) {
    console.error("Failed to analyze seasonal patterns:", error);
    return NextResponse.json(
      { error: "Failed to analyze seasonal patterns" },
      { status: 500 }
    );
  }
}

function groupByMonth(
  data: Array<{
    date: string;
    newCasesSmoothed: number;
    newDeathsSmoothed: number;
    newVaccinationsSmoothed: number | null;
  }>
): MonthlyData[] {
  const monthlyGroups = new Map<string, Array<(typeof data)[0]>>();

  for (const record of data) {
    const date = new Date(record.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, "0")}`;

    if (!monthlyGroups.has(key)) {
      monthlyGroups.set(key, []);
    }
    monthlyGroups.get(key)?.push(record);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const result: MonthlyData[] = [];

  monthlyGroups.forEach((records, key) => {
    const [year, month] = key.split("-").map(Number);

    const avgCases =
      records.reduce((sum, r) => sum + r.newCasesSmoothed, 0) / records.length;
    const avgDeaths =
      records.reduce((sum, r) => sum + r.newDeathsSmoothed, 0) / records.length;
    const vaccinationRecords = records.filter(
      (r) => r.newVaccinationsSmoothed !== null
    );
    const avgVaccinations =
      vaccinationRecords.length > 0
        ? vaccinationRecords.reduce(
            (sum, r) => sum + (r.newVaccinationsSmoothed as number),
            0
          ) / vaccinationRecords.length
        : 0;

    result.push({
      year,
      month,
      monthName: monthNames[month - 1],
      avgCases: Math.round(avgCases),
      avgDeaths: Math.round(avgDeaths),
      avgVaccinations: Math.round(avgVaccinations),
      totalDays: records.length,
    });
  });

  return result.sort((a, b) => a.year - b.year || a.month - b.month);
}

function calculateSeasonalPatterns(
  monthlyData: MonthlyData[]
): SeasonalPattern[] {
  const seasons = {
    Spring: [3, 4, 5],
    Summer: [6, 7, 8],
    Fall: [9, 10, 11],
    Winter: [12, 1, 2],
  };

  const seasonalPatterns: SeasonalPattern[] = [];

  for (const [seasonName, months] of Object.entries(seasons)) {
    const seasonData = monthlyData.filter((d) => months.includes(d.month));

    if (seasonData.length === 0) continue;

    const avgCases =
      seasonData.reduce((sum, d) => sum + d.avgCases, 0) / seasonData.length;
    const avgDeaths =
      seasonData.reduce((sum, d) => sum + d.avgDeaths, 0) / seasonData.length;
    const avgVaccinations =
      seasonData.reduce((sum, d) => sum + d.avgVaccinations, 0) /
      seasonData.length;

    // Find peak month in this season
    const peakRecord = seasonData.reduce((peak, current) =>
      current.avgCases > peak.avgCases ? current : peak
    );

    // Determine pattern trend
    const firstYear = seasonData.filter(
      (d) => d.year === Math.min(...seasonData.map((d) => d.year))
    );
    const lastYear = seasonData.filter(
      (d) => d.year === Math.max(...seasonData.map((d) => d.year))
    );

    let pattern: "Increasing" | "Decreasing" | "Stable" = "Stable";
    if (firstYear.length > 0 && lastYear.length > 0) {
      const firstYearAvg =
        firstYear.reduce((sum, d) => sum + d.avgCases, 0) / firstYear.length;
      const lastYearAvg =
        lastYear.reduce((sum, d) => sum + d.avgCases, 0) / lastYear.length;

      const change = ((lastYearAvg - firstYearAvg) / firstYearAvg) * 100;
      if (change > 20) pattern = "Increasing";
      else if (change < -20) pattern = "Decreasing";
    }

    seasonalPatterns.push({
      season: seasonName as SeasonalPattern["season"],
      months: months.map((m) => {
        const monthNames = [
          "",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return monthNames[m];
      }),
      avgCases: Math.round(avgCases),
      avgDeaths: Math.round(avgDeaths),
      avgVaccinations: Math.round(avgVaccinations),
      peakMonth: peakRecord.monthName,
      peakValue: peakRecord.avgCases,
      pattern,
    });
  }

  return seasonalPatterns;
}

function calculateYearlyTrends(monthlyData: MonthlyData[]) {
  const yearlyTrends = new Map<
    number,
    {
      year: number;
      avgCases: number;
      avgDeaths: number;
      peakMonth: string;
      peakValue: number;
    }
  >();

  const years = Array.from(new Set(monthlyData.map((d) => d.year)));

  for (const year of years) {
    const yearData = monthlyData.filter((d) => d.year === year);
    if (yearData.length === 0) continue;

    const avgCases =
      yearData.reduce((sum, d) => sum + d.avgCases, 0) / yearData.length;
    const avgDeaths =
      yearData.reduce((sum, d) => sum + d.avgDeaths, 0) / yearData.length;
    const peakRecord = yearData.reduce((peak, current) =>
      current.avgCases > peak.avgCases ? current : peak
    );

    yearlyTrends.set(year, {
      year,
      avgCases: Math.round(avgCases),
      avgDeaths: Math.round(avgDeaths),
      peakMonth: peakRecord.monthName,
      peakValue: peakRecord.avgCases,
    });
  }

  return Array.from(yearlyTrends.values()).sort((a, b) => a.year - b.year);
}

function calculateMonthlyAverages(monthlyData: MonthlyData[]) {
  const monthlyAverages = new Map<
    number,
    {
      month: number;
      monthName: string;
      avgCases: number;
      avgDeaths: number;
      yearsCovered: number;
    }
  >();

  for (let month = 1; month <= 12; month++) {
    const monthData = monthlyData.filter((d) => d.month === month);
    if (monthData.length === 0) continue;

    const avgCases =
      monthData.reduce((sum, d) => sum + d.avgCases, 0) / monthData.length;
    const avgDeaths =
      monthData.reduce((sum, d) => sum + d.avgDeaths, 0) / monthData.length;

    const monthNames = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    monthlyAverages.set(month, {
      month,
      monthName: monthNames[month],
      avgCases: Math.round(avgCases),
      avgDeaths: Math.round(avgDeaths),
      yearsCovered: monthData.length,
    });
  }

  return Array.from(monthlyAverages.values());
}
