import { covidData, db } from "~/db";
import { and, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface VaccinationEffectivenessData {
  country: string;
  vaccinationStartDate: string;
  preVaccinationPeriod: {
    avgDailyCases: number;
    avgDailyDeaths: number;
    casesFatalityRate: number;
  };
  postVaccinationPeriod: {
    avgDailyCases: number;
    avgDailyDeaths: number;
    casesFatalityRate: number;
  };
  effectiveness: {
    casesReduction: number; // Percentage reduction
    deathsReduction: number; // Percentage reduction
    fatalityRateImprovement: number; // Percentage improvement
  };
  vaccinationMilestones: Array<{
    date: string;
    vaccinationRate: number;
    casesSemesterAvg: number;
    deathsSemesterAvg: number;
  }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "USA";

    // Get comprehensive vaccination and case data
    const data = await db
      .select({
        date: covidData.date,
        newCasesSmoothed: covidData.newCasesSmoothed,
        newDeathsSmoothed: covidData.newDeathsSmoothed,
        totalCases: covidData.totalCases,
        totalDeaths: covidData.totalDeaths,
        peopleVaccinatedPerHundred: covidData.peopleVaccinatedPerHundred,
        peopleFullyVaccinatedPerHundred:
          covidData.peopleFullyVaccinatedPerHundred,
        newVaccinationsSmoothed: covidData.newVaccinationsSmoothed,
      })
      .from(covidData)
      .where(
        and(eq(covidData.isoCode, country), gte(covidData.date, "2020-01-01"))
      )
      .orderBy(covidData.date);

    if (data.length === 0) {
      return NextResponse.json(
        { error: "No data found for this country" },
        { status: 404 }
      );
    }

    // Find vaccination start date (when vaccinations first became significant)
    const vaccinationStartData = data.find(
      (d) =>
        d.peopleVaccinatedPerHundred !== null &&
        d.peopleVaccinatedPerHundred > 1 // When 1% of population got first dose
    );

    if (!vaccinationStartData || !vaccinationStartData.date) {
      return NextResponse.json(
        { error: "No significant vaccination data found" },
        { status: 404 }
      );
    }

    const vaccinationStartDate = vaccinationStartData.date;
    const vaccinationStartIndex = data.findIndex(
      (d) => d.date === vaccinationStartDate
    );

    // Define periods for comparison
    const preVaccinationData = data.slice(
      Math.max(0, vaccinationStartIndex - 90), // 90 days before vaccination
      vaccinationStartIndex
    );

    const postVaccinationData = data.slice(
      vaccinationStartIndex + 90, // Start 90 days after vaccination began
      vaccinationStartIndex + 270 // 180 days of post-vaccination data
    );

    if (preVaccinationData.length < 30 || postVaccinationData.length < 30) {
      return NextResponse.json(
        { error: "Insufficient data for comparison" },
        { status: 400 }
      );
    }

    // Calculate pre-vaccination metrics
    const preVaccinationMetrics = calculatePeriodMetrics(preVaccinationData);
    const postVaccinationMetrics = calculatePeriodMetrics(postVaccinationData);

    // Calculate effectiveness
    const effectiveness = {
      casesReduction: calculatePercentageChange(
        preVaccinationMetrics.avgDailyCases,
        postVaccinationMetrics.avgDailyCases
      ),
      deathsReduction: calculatePercentageChange(
        preVaccinationMetrics.avgDailyDeaths,
        postVaccinationMetrics.avgDailyDeaths
      ),
      fatalityRateImprovement: calculatePercentageChange(
        preVaccinationMetrics.casesFatalityRate,
        postVaccinationMetrics.casesFatalityRate
      ),
    };

    // Calculate vaccination milestones
    const vaccinationMilestones = calculateVaccinationMilestones(
      data,
      vaccinationStartIndex
    );

    const result: VaccinationEffectivenessData = {
      country,
      vaccinationStartDate,
      preVaccinationPeriod: preVaccinationMetrics,
      postVaccinationPeriod: postVaccinationMetrics,
      effectiveness,
      vaccinationMilestones,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to analyze vaccination effectiveness:", error);
    return NextResponse.json(
      { error: "Failed to analyze vaccination effectiveness" },
      { status: 500 }
    );
  }
}

function calculatePeriodMetrics(
  data: Array<{
    newCasesSmoothed: number | null;
    newDeathsSmoothed: number | null;
    totalCases: number | null;
    totalDeaths: number | null;
  }>
) {
  const validCases = data
    .filter((d) => d.newCasesSmoothed !== null)
    .map((d) => d.newCasesSmoothed as number);
  const validDeaths = data
    .filter((d) => d.newDeathsSmoothed !== null)
    .map((d) => d.newDeathsSmoothed as number);

  const avgDailyCases =
    validCases.length > 0
      ? validCases.reduce((sum, cases) => sum + cases, 0) / validCases.length
      : 0;

  const avgDailyDeaths =
    validDeaths.length > 0
      ? validDeaths.reduce((sum, deaths) => sum + deaths, 0) /
        validDeaths.length
      : 0;

  // Calculate case fatality rate
  const lastRecord = data[data.length - 1];
  const firstRecord = data[0];

  const totalCasesInPeriod =
    (lastRecord?.totalCases || 0) - (firstRecord?.totalCases || 0);
  const totalDeathsInPeriod =
    (lastRecord?.totalDeaths || 0) - (firstRecord?.totalDeaths || 0);

  const casesFatalityRate =
    totalCasesInPeriod > 0
      ? (totalDeathsInPeriod / totalCasesInPeriod) * 100
      : 0;

  return {
    avgDailyCases: Math.round(avgDailyCases),
    avgDailyDeaths: Math.round(avgDailyDeaths),
    casesFatalityRate: Number(casesFatalityRate.toFixed(2)),
  };
}

function calculatePercentageChange(before: number, after: number): number {
  if (before === 0) return 0;
  return Number((((before - after) / before) * 100).toFixed(2));
}

function calculateVaccinationMilestones(
  data: Array<{
    date: string | null;
    peopleVaccinatedPerHundred: number | null;
    newCasesSmoothed: number | null;
    newDeathsSmoothed: number | null;
  }>,
  startIndex: number
): Array<{
  date: string;
  vaccinationRate: number;
  casesSemesterAvg: number;
  deathsSemesterAvg: number;
}> {
  const milestones = [10, 25, 50, 70, 80]; // Vaccination percentage milestones
  const result = [];

  for (const milestone of milestones) {
    const milestoneIndex = data.findIndex(
      (d, index) =>
        index >= startIndex &&
        d.peopleVaccinatedPerHundred !== null &&
        d.peopleVaccinatedPerHundred >= milestone
    );

    if (milestoneIndex !== -1 && data[milestoneIndex].date) {
      // Calculate 30-day average around this milestone
      const windowStart = Math.max(0, milestoneIndex - 15);
      const windowEnd = Math.min(data.length, milestoneIndex + 15);
      const windowData = data.slice(windowStart, windowEnd);

      const validCases = windowData.filter((d) => d.newCasesSmoothed !== null);
      const validDeaths = windowData.filter(
        (d) => d.newDeathsSmoothed !== null
      );

      const avgCases =
        validCases.length > 0
          ? validCases.reduce(
              (sum, d) => sum + (d.newCasesSmoothed as number),
              0
            ) / validCases.length
          : 0;

      const avgDeaths =
        validDeaths.length > 0
          ? validDeaths.reduce(
              (sum, d) => sum + (d.newDeathsSmoothed as number),
              0
            ) / validDeaths.length
          : 0;

      result.push({
        date: data[milestoneIndex].date as string,
        vaccinationRate: milestone,
        casesSemesterAvg: Math.round(avgCases),
        deathsSemesterAvg: Math.round(avgDeaths),
      });
    }
  }

  return result;
}
