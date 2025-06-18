import { covidData, db } from "~/db";
import { and, eq, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface WaveData {
  wave: number;
  startDate: string;
  endDate: string;
  peakDate: string;
  peakValue: number;
  totalCases: number;
  duration: number;
  avgDailyGrowth: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "OWID_WRL";
    const metric = searchParams.get("metric") || "newCasesSmoothed";

    // Get time series data for the country
    const data = await db
      .select({
        date: covidData.date,
        value: sql<number>`${covidData[metric as keyof typeof covidData]}`,
        totalCases: covidData.totalCases,
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
      return NextResponse.json({ waves: [], error: "No data found" });
    }

    // Filter out null values and prepare data
    const validData = data
      .filter((d) => d.date && d.value !== null && d.value > 0)
      .map((d) => ({
        date: d.date as string,
        value: d.value,
        totalCases: d.totalCases || 0,
      }));

    if (validData.length < 30) {
      return NextResponse.json({
        waves: [],
        error: "Insufficient data for wave analysis",
      });
    }

    // Detect waves using peak detection algorithm
    const waves = detectWaves(validData);

    return NextResponse.json({
      country,
      metric,
      waves,
      totalDataPoints: validData.length,
    });
  } catch (error) {
    console.error("Failed to analyze pandemic waves:", error);
    return NextResponse.json(
      { error: "Failed to analyze pandemic waves" },
      { status: 500 }
    );
  }
}

function detectWaves(
  data: Array<{ date: string; value: number; totalCases: number }>
): WaveData[] {
  const waves: WaveData[] = [];
  const smoothedValues = applySmoothingFilter(
    data.map((d) => d.value),
    7
  );

  // Find local maxima (peaks)
  const peaks: number[] = [];
  const minPeakHeight = Math.max(...smoothedValues) * 0.1; // Minimum 10% of max value

  for (let i = 14; i < smoothedValues.length - 14; i++) {
    if (smoothedValues[i] > minPeakHeight) {
      let isPeak = true;

      // Check if this is higher than surrounding 14 days on each side
      for (let j = i - 14; j <= i + 14; j++) {
        if (j !== i && smoothedValues[j] >= smoothedValues[i]) {
          isPeak = false;
          break;
        }
      }

      if (isPeak) {
        peaks.push(i);
      }
    }
  }

  // Define waves around each peak
  for (let i = 0; i < peaks.length; i++) {
    const peakIndex = peaks[i];
    const peakValue = smoothedValues[peakIndex];
    const peakDate = data[peakIndex].date;

    // Find wave start (go back until value drops significantly)
    let startIndex = peakIndex;
    const threshold = peakValue * 0.2; // Wave starts when it's 20% of peak

    for (let j = peakIndex - 1; j >= 0; j--) {
      if (smoothedValues[j] < threshold) {
        startIndex = j;
        break;
      }
      if (j === 0) startIndex = 0;
    }

    // Find wave end (go forward until value drops significantly)
    let endIndex = peakIndex;
    for (let j = peakIndex + 1; j < smoothedValues.length; j++) {
      if (smoothedValues[j] < threshold) {
        endIndex = j;
        break;
      }
      if (j === smoothedValues.length - 1) endIndex = j;
    }

    // Calculate wave statistics
    const startDate = data[startIndex].date;
    const endDate = data[endIndex].date;
    const duration = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const waveData = data.slice(startIndex, endIndex + 1);
    const totalCases = waveData.reduce((sum, d) => sum + d.value, 0);

    // Calculate average daily growth rate
    const nonZeroValues = waveData.filter((d) => d.value > 0);
    let avgDailyGrowth = 0;
    if (nonZeroValues.length > 1) {
      const growthRates = [];
      for (let j = 1; j < nonZeroValues.length; j++) {
        const rate =
          (nonZeroValues[j].value - nonZeroValues[j - 1].value) /
          nonZeroValues[j - 1].value;
        if (Number.isFinite(rate)) growthRates.push(rate);
      }
      avgDailyGrowth =
        growthRates.length > 0
          ? growthRates.reduce((sum, rate) => sum + rate, 0) /
            growthRates.length
          : 0;
    }

    waves.push({
      wave: i + 1,
      startDate,
      endDate,
      peakDate,
      peakValue,
      totalCases: Math.round(totalCases),
      duration,
      avgDailyGrowth: Number((avgDailyGrowth * 100).toFixed(2)), // Convert to percentage
    });
  }

  return waves;
}

function applySmoothingFilter(values: number[], windowSize: number): number[] {
  const smoothed: number[] = [];

  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(values.length, i + Math.floor(windowSize / 2) + 1);

    const windowValues = values.slice(start, end);
    const average =
      windowValues.reduce((sum, val) => sum + val, 0) / windowValues.length;
    smoothed.push(average);
  }

  return smoothed;
}
