"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Transcript() {
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
  const [transcriptData, setTranscriptData] = useState<any>(null);

  const selectedCompanies = useSelector(
    (state: any) => state.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state: any) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector(
    (state: any) => state.sidebar.selectedQuarter,
  );

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/transcript`;

  useEffect(() => {
    if (selectedCompanies?.length && selectedQuarter && selectedYear) {
      fetchTranscript(selectedCompanies[0], selectedQuarter, selectedYear);
    }
  }, [selectedCompanies, selectedQuarter, selectedYear]);

  async function fetchTranscript(
    selectedCompany: any,
    selectedQuarter: string,
    selectedYear: number,
  ) {
    setIsTranscriptLoading(true);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedCompany: { name: "", ticker: selectedCompanies[0] },
        selectedQuarter,
        selectedYear,
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch data");
      setIsTranscriptLoading(false);
      return;
    }

    const jsonData = await response.json();
    try {
      if (jsonData.presentation?.length || jsonData.qa_session?.length) {
        setTranscriptData(jsonData);
      } else {
        setTranscriptData(null);
      }
    } catch (error) {
      console.error("Error processing JSON:", error);
      setTranscriptData(null);
    } finally {
      setIsTranscriptLoading(false);
    }
  }

  // Helper function to get participant display name
  const getParticipantDisplay = (participant: any) => {
    if (participant.role) {
      return `${participant.name} (${participant.role})`;
    }
    if (participant.firm) {
      return `${participant.name} - ${participant.firm}`;
    }
    return participant.name;
  };

  return (
    <div className="flex flex-col px-6 py-6 space-y-6 bg-blue-50 min-h-screen">
      {isTranscriptLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : transcriptData ? (
        <Card className="bg-white shadow-md border border-gray-200 rounded-xl max-w-[75vw] m-auto">
          <CardContent className="py-6">
            <div className="prose ml-6 text-gray-700">
              {/* Company & Event Details */}
              <h2 className="text-3xl font-bold text-blue-600 drop-shadow-md">
                {transcriptData.metadata?.company || "Company Name"}
              </h2>
              <p className="text-lg text-gray-500">
                {transcriptData.metadata?.quarter}{" "}
                {transcriptData.metadata?.year} Earnings Call
              </p>
              {transcriptData.metadata?.date && (
                <p className="text-sm text-gray-400">
                  {transcriptData.metadata.date}
                </p>
              )}
              <hr className="my-4 border-gray-300" />

              {/* Participants & Topics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Corporate Participants:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2">
                    {transcriptData.participants?.corporate?.map(
                      (participant: any, index: number) => (
                        <li key={index}>
                          {getParticipantDisplay(participant)}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Analysts:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2">
                    {transcriptData.participants?.analysts?.map(
                      (analyst: any, index: number) => (
                        <li key={index}>{getParticipantDisplay(analyst)}</li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              {/* Statistics Cards */}
              {transcriptData.stats && (
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">
                      Presentation Speeches
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {transcriptData.stats.presentation_speeches || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Q&A Speeches</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {transcriptData.stats.qa_speeches || 0}
                    </p>
                  </div>
                </div>
              )}

              {/* Presentation Section */}
              {transcriptData.presentation?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">
                    Presentation
                  </h3>
                  <div className="space-y-4">
                    {transcriptData.presentation.map(
                      (entry: any, index: number) => (
                        <div
                          key={`pres-${index}`}
                          className="p-4 border border-gray-200 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                        >
                          <p className="font-semibold text-gray-800">
                            {entry.speaker}
                            {entry.title && ` — ${entry.title}`}
                          </p>
                          <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                            {entry.text}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Q&A Section */}
              {transcriptData.qa_session?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">
                    Question & Answer Session
                  </h3>
                  <div className="space-y-4">
                    {transcriptData.qa_session.map(
                      (entry: any, index: number) => (
                        <div
                          key={`qa-${index}`}
                          className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 ${
                            entry.speaker === "Operator"
                              ? "bg-blue-50 border-blue-200"
                              : entry.speaker === "Brett Iversen"
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <p className="font-semibold text-gray-800">
                            {entry.speaker}
                            {entry.title && ` — ${entry.title}`}
                          </p>
                          <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                            {entry.text}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center">
          No Data Available
          <br />
          Select a Company to get started.
        </p>
      )}
    </div>
  );
}
