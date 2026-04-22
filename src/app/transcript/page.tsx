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
    <div className="flex flex-col px-6 py-6 space-y-6 bg-muted/30 min-h-screen">
      {isTranscriptLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
        </div>
      ) : transcriptData ? (
        <Card className="bg-card border-border shadow-md rounded-xl w-full lg:max-w-[75vw] m-auto">
          <CardContent className="py-6">
            <div className="prose ml-6 text-card-foreground">
              {/* Company & Event Details */}
              <h2 className="text-3xl font-bold text-primary drop-shadow-md">
                {transcriptData.metadata?.company || "Company Name"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {transcriptData.metadata?.quarter}{" "}
                {transcriptData.metadata?.year} Earnings Call
              </p>
              {transcriptData.metadata?.date && (
                <p className="text-sm text-muted-foreground/70">
                  {transcriptData.metadata.date}
                </p>
              )}
              <hr className="my-4 border-border" />

              {/* Participants & Topics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary">
                    Corporate Participants:
                  </h3>
                  <ul className="list-disc list-inside text-card-foreground/80 mt-2">
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
                  <h3 className="text-lg font-semibold text-primary">
                    Analysts:
                  </h3>
                  <ul className="list-disc list-inside text-card-foreground/80 mt-2">
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
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Presentation Speeches
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {transcriptData.stats.presentation_speeches || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Q&A Speeches
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {transcriptData.stats.qa_speeches || 0}
                    </p>
                  </div>
                </div>
              )}

              {/* Presentation Section */}
              {transcriptData.presentation?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    Presentation
                  </h3>
                  <div className="space-y-4">
                    {transcriptData.presentation.map(
                      (entry: any, index: number) => (
                        <div
                          key={`pres-${index}`}
                          className="p-4 border border-border bg-muted/30 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                        >
                          <p className="font-semibold text-card-foreground">
                            {entry.speaker}
                            {entry.title && ` — ${entry.title}`}
                          </p>
                          <p className="text-card-foreground/80 mt-2 whitespace-pre-wrap">
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
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    Question & Answer Session
                  </h3>
                  <div className="space-y-4">
                    {transcriptData.qa_session.map(
                      (entry: any, index: number) => (
                        <div
                          key={`qa-${index}`}
                          className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 ${
                            entry.speaker === "Operator"
                              ? "bg-primary/5 border-primary/20"
                              : entry.speaker === "Brett Iversen"
                                ? "bg-secondary-green/10 border-secondary-green/20"
                                : "bg-muted/30 border-border"
                          }`}
                        >
                          <p className="font-semibold text-card-foreground">
                            {entry.speaker}
                            {entry.title && ` — ${entry.title}`}
                          </p>
                          <p className="text-card-foreground/80 mt-2 whitespace-pre-wrap">
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
        <p className="text-center text-muted-foreground">
          No Data Available
          <br />
          Select a Company to get started.
        </p>
      )}
    </div>
  );
}
