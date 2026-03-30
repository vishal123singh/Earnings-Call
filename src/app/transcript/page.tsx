"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Transcript() {
    const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
    const [transcript, setTranscript] = useState<any>([]);

    const selectedCompanies = useSelector((state: any) => state.sidebar.selectedCompanies);
    const selectedYear = useSelector((state: any) => state.sidebar.selectedYear);
    const selectedQuarter = useSelector((state: any) => state.sidebar.selectedQuarter);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/transcript`;

    useEffect(() => {
        if (selectedCompanies?.length && selectedQuarter && selectedYear) {
            fetchTranscript(selectedCompanies[0], selectedQuarter, selectedYear)
        }
    }, [selectedCompanies, selectedQuarter, selectedYear]);

    async function fetchTranscript(selectedCompany: any, selectedQuarter: string, selectedYear: number) {
        setIsTranscriptLoading(true);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedCompany: { name: "", ticker: selectedCompanies[0] }, selectedQuarter, selectedYear }),
        });

        if (!response.ok) {
            console.error("Failed to fetch data");
            setIsTranscriptLoading(false);
            return;
        }

        const jsonData = await response.json();
        try {
            if (jsonData.transcript?.length) {
                setTranscript(jsonData);
            } else {
                setTranscript([
                    {
                        speaker: "Not found",
                        text: "No transcript available"
                    }
                ]);
            }
        } catch (error) {
            console.error("Error processing JSON:", error);
            setTranscript([
                {
                    speaker: "Error",
                    text: "Error loading transcript."
                }
            ]);
        } finally {
            setIsTranscriptLoading(false);
        }
    }

    return (
        <div className="flex flex-col px-6 py-6 space-y-6 bg-purple-50 min-h-screen">
            {
                isTranscriptLoading ? <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
                </div> :
                    transcript?.transcript?.length ? <Card className="bg-white shadow-md border border-gray-200 rounded-xl max-w-[75vw] m-auto">

                        <CardContent className="py-6">
                            <div className="prose ml-6 text-gray-700">
                                    {/* Company & Event Details */}
                                    <h2 className="text-3xl font-bold text-purple-600 drop-shadow-md">
                                        {transcript?.company_name}
                                    </h2>
                                    <p className="text-lg text-gray-500">{transcript?.event}</p>
                                    <hr className="my-4 border-gray-300" />

                                    {/* Participants & Topics */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-purple-600">Participants:</h3>
                                            <ul className="list-disc list-inside text-gray-600">
                                                {transcript?.participants?.map((participant: string, index: number) => (
                                                    <li key={index}>{participant}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-purple-600">Key Topics:</h3>
                                            <ul className="list-disc list-inside text-gray-600">
                                                {transcript?.topics?.map((topic: string, index: number) => (
                                                    <li key={index}>{topic}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Transcript Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-purple-600">Transcript:</h3>
                                        <div className="space-y-4 mt-4">
                                            {transcript?.transcript?.map((entry: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="p-4 border border-gray-200 bg-gray-50 rounded-lg shadow-sm  transition duration-200"
                                                >
                                                    <p className="font-semibold text-gray-800">{entry.speaker}:</p>
                                                    <p className="text-gray-600">{entry.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                            </div>


                        </CardContent>
                    </Card> : <p className="text-center">No Data Available<br></br>Select a Company to get started.</p>

            }
        </div>
    );

}
