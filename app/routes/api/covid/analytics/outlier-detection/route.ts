import { covidData, db } from "~/db";
import { and, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface OutlierData {
  date: string;
  value: number;
  metric: string;
  outlierType: "spike" | "drop" | "anomaly";
  severity: "mild" | "moderate" | "severe";
  deviationFromMean: number;
  percentageChange: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "OWID_WRL";
    const metric = searchParams.get("metric") || "newCasesSmoothed";
    const threshold = Number.parseFloat(searchParams.get("threshold") || "2.5"); // Z-score threshold

    // Get time series data
    const data = await db
      .select({
        date: covidData.date,
        newCasesSmoothed: covidData.newCasesSmoothed,
        newDeathsSmoothed: covidData.newDeathsSmoothed,
        newVaccinationsSmoothed: covidData.newVaccinationsSmoothed,
        totalCases: covidData.totalCases,
        totalDeaths: covidData.totalDeaths,
      })
      .from(covidData)
      .where(
        and(eq(covidData.isoCode, country), gte(covidData.date, "2020-03-01"))
      )
      .orderBy(covidData.date);

    if (data.length === 0) {
      return NextResponse.json(
        { error: "No data found for this country" },
        { status: 404 }
      );
    }

    // Filter valid data for the requested metric
    const validData = data
      .filter((d) => d.date && d[metric as keyof typeof d] !== null)
      .map((d) => ({
        date: d.date as string,
        value: d[metric as keyof typeof d] as number,
      }));

    if (validData.length < 30) {
      return NextResponse.json(
        { error: "Insufficient data for outlier detection" },
        { status: 400 }
      );
    }

    // Detect outliers using statistical methods
    const outliers = detectOutliers(validData, metric, threshold);

    // Add contextual analysis
    const enrichedOutliers = await enrichOutlierData(outliers, data);

    return NextResponse.json({
      country,
      metric,
      threshold,
      outliers: enrichedOutliers,
      summary: {
        totalOutliers: enrichedOutliers.length,
        severeOutliers: enrichedOutliers.filter((o) => o.severity === "severe")
          .length,
        spikes: enrichedOutliers.filter((o) => o.outlierType === "spike")
          .length,
        drops: enrichedOutliers.filter((o) => o.outlierType === "drop").length,
      },
    });
  } catch (error) {
    console.error("Failed to detect outliers:", error);
    return NextResponse.json(
      { error: "Failed to detect outliers" },
      { status: 500 }
    );
  }
}

function detectOutliers(
  data: Array<{ date: string; value: number }>,
  metric: string,
  threshold: number
): OutlierData[] {
  const values = data.map((d) => d.value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
  const standardDeviation = Math.sqrt(variance);

  const outliers: OutlierData[] = [];

  for (let i = 1; i < data.length - 1; i++) {
    const current = data[i];
    const previous = data[i - 1];
    const next = data[i + 1];

    // Calculate Z-score
    const zScore = Math.abs((current.value - mean) / standardDeviation);

    // Calculate percentage change from previous day
    const percentageChange =
      previous.value > 0
        ? ((current.value - previous.value) / previous.value) * 100
        : 0;

    // Determine if it's an outlier
    if (zScore > threshold) {
      let outlierType: OutlierData["outlierType"] = "anomaly";
      let severity: OutlierData["severity"] = "mild";

      // Determine outlier type
      if (percentageChange > 50) {
        outlierType = "spike";
      } else if (percentageChange < -50) {
        outlierType = "drop";
      }

      // Determine severity based on Z-score
      if (zScore > 4) {
        severity = "severe";
      } else if (zScore > 3) {
        severity = "moderate";
      }

      // Additional check for sudden changes
      const nextPercentageChange =
        current.value > 0
          ? ((next.value - current.value) / current.value) * 100
          : 0;

      // If both current and next day show extreme changes, it's likely a spike
      if (
        Math.abs(percentageChange) > 100 ||
        Math.abs(nextPercentageChange) > 100
      ) {
        severity = "severe";
      }

      outliers.push({
        date: current.date,
        value: current.value,
        metric,
        outlierType,
        severity,
        deviationFromMean: Number((current.value - mean).toFixed(2)),
        percentageChange: Number(percentageChange.toFixed(2)),
      });
    }
  }

  return outliers;
}

async function enrichOutlierData(
  outliers: OutlierData[],
  fullData: Array<{
    date: string | null;
    newCasesSmoothed: number | null;
    newDeathsSmoothed: number | null;
    totalCases: number | null;
    totalDeaths: number | null;
  }>
): Promise<OutlierData[]> {
  // Add additional context to outliers
  return outliers.map((outlier) => {
    const dateRecord = fullData.find((d) => d.date === outlier.date);

    if (dateRecord) {
      // Check if other metrics also show anomalies on the same date
      const hasMultipleAnomalies =
        dateRecord.newCasesSmoothed !== null &&
        dateRecord.newCasesSmoothed > 0 &&
        dateRecord.newDeathsSmoothed !== null &&
        dateRecord.newDeathsSmoothed > 0;

      // Adjust severity if multiple metrics show anomalies
      if (hasMultipleAnomalies && outlier.severity === "mild") {
        outlier.severity = "moderate";
      }
    }

    return outlier;
  });
}
