import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transcript from "@/models/Transcript";

const quarters = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { selectedCompany, selectedQuarter, selectedYear } = body;

    const ticker = selectedCompany.ticker || selectedCompany.value;
    const quarter = quarters[selectedQuarter as keyof typeof quarters];
    const quarterFormatted = `Q${quarter}`;

    const yearFormatted = Number(selectedYear?.[0]);

    // ✅ 1. Check cache
    const existing = await Transcript.findOne({
      ticker,
      year: yearFormatted,
      quarter: quarterFormatted,
    });

    if (existing) {
      console.log("✅ Cache hit");
      return NextResponse.json(existing.data);
    }

    console.log("❌ Cache miss → fetching");

    // ✅ 2. Fetch from Python API
    const pythonApiUrl = process.env.PYTHON_API_URL!;
    const endpoint = `${pythonApiUrl}/scrape/${ticker.toLowerCase()}/${selectedYear}/${quarterFormatted}`;

    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`Python API error: ${res.status}`);
    }

    const pythonData = await res.json();

    const transcriptData = {
      presentation: pythonData.presentation || [],
      qa_session: pythonData.qa_session || [],
      participants: pythonData.participants || {},
      metadata: pythonData.metadata || {
        ticker,
        quarter: quarterFormatted,
        year: selectedYear,
      },
      stats: pythonData.stats || {},
    };

    console.log("Selected:", ticker, quarterFormatted, yearFormatted);

    // ✅ 3. SAVE (upsert = safe save)
    await Transcript.findOneAndUpdate(
      {
        ticker,
        year: yearFormatted,
        quarter: quarterFormatted,
      },
      {
        ticker,
        year: yearFormatted,
        quarter: quarterFormatted,
        data: transcriptData,
      },
      {
        upsert: true, // create if not exists
        new: true,
      },
    );

    console.log("💾 Saved to MongoDB");

    return NextResponse.json(transcriptData);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error: "Error occurred while fetching transcript",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
