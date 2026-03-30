"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { companies, quarters, years } from "../../../../public/data";
import { useSelector } from 'react-redux';
import { useRouter } from "next/navigation";

const CustomHeader = () => {
    const router = useRouter();
    const [company, setSelectedCompany] = useState<any>(companies[0]);
    const [year, setSelectedYear] = useState<any>(years[0]);
    const [quarter, setSelectedQuarter] = useState<any>(quarters[0]);

    const selectedCompany = useSelector((state: any) => state.sidebar.selectedCompany);
    const selectedYear = useSelector((state: any) => state.sidebar.selectedYear);
    const selectedQuarter = useSelector((state: any) => state.sidebar.selectedQuarter);

    useEffect(() => {
        setSelectedCompany(selectedCompany);
        setSelectedYear(selectedYear);
        setSelectedQuarter(selectedQuarter);
    }, [selectedCompany, selectedQuarter, selectedYear]);

    return (
        <div className="flex justify-between items-center bg-white backdrop-blur-md p-5 shadow-md rounded-2xl border border-gray-300">
            <span
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-400 cursor-pointer transition duration-200 ease-in-out"
                onClick={() => router.push('/transcript')}
            >
            <ArrowUpRight size={18} />
                <span className="text-md font-medium">See Transcript</span>
        </span>
            <span className="text-lg font-medium text-gray-800">
            {company?.ticker} {quarter} Quarter, {year} Earnings Call
        </span>
    </div>
    );

};

export default CustomHeader;
