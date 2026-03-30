"use client";
import Select, { StylesConfig, MultiValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import {
  setCompanies,
  setEarningsData,
  setPersona,
  setQuarter,
  setYear,
  setFoundationModel,
} from "../../../../store/sidebarSlice";
import { useContext, useEffect } from "react";
import { ParentContext } from "@/layout";

// Type definitions
interface Company {
  ticker: string;
  name: string;
  logo: string;
}

interface OptionType {
  value: string | number;
  label?: string;
  logo?: string;
}

const personas: string[] = [
  "Controller (Chief Accounting Officer)",
  "Treasurer",
  "Head of Financial Planning & Analysis (FP&A)",
  "Head of Risk & Compliance",
  "Head of Taxation",
  "Investor Relations Director",
  "Head of Procurement & Vendor Management",
];

// Models remain hard-coded (or you can add them to filterConfig if needed)
const models: OptionType[] = [
  {
    value: "anthropic.claude-3-5-sonnet-20240620-v1:0",
    label: "Claude 3.5 Sonnet v1",
  },
  { value: "anthropic.claude-3-5-sonnet-v2", label: "Claude 3.5 Sonnet v2" },
  {
    value: "anthropic.claude-3-haiku-20240307-v1:0",
    label: "Claude 3.5 Haiku",
  },
];

// Custom Styles for Select
const customStyles: StylesConfig<OptionType, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fff",
    borderColor: state.isFocused ? "#a855f7" : "#e5e7eb",
    color: "#111827",
    borderRadius: "0.75rem",
    boxShadow: state.isFocused ? "0 0 12px rgba(168, 85, 247, 0.3)" : "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      borderColor: "#a855f7",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fafafa",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#a855f7"
      : state.isFocused
        ? "#f3e8ff"
        : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#111827",
    "&:hover": {
      backgroundColor: "#f3e8ff",
      color: "#111827",
    },
    transition: "background-color 0.2s ease, color 0.2s ease",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#6b7280",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f3e8ff",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#9333ea",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#9333ea",
    "&:hover": {
      backgroundColor: "#f3e8ff",
      color: "#9333ea",
    },
  }),
};

const FilterOptions = () => {
  const dispatch = useDispatch();
  const { collapsed } = useContext(ParentContext);

  // Get filter configuration and current selections from redux state
  const filterConfig = useSelector((state: any) => state.sidebar.filterConfig);
  const selectedCompanies = useSelector(
    (state: any) => state.sidebar.selectedCompanies
  );
  const selectedYear = useSelector((state: any) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector(
    (state: any) => state.sidebar.selectedQuarter
  );
  const selectedPersona = useSelector((state: any) => state.sidebar.persona);
  const selectedModal = useSelector(
    (state: any) => state.sidebar.foundationModel
  );

  // Create option arrays for companies, years and quarters
  const companyOptions: OptionType[] = filterConfig.companies.map(
    (company: Company) => ({
      value: company.ticker,
      label: company.name,
      logo: company.logo,
    })
  );
  const yearOptions: OptionType[] = (filterConfig.years as number[]).map(
    (year) => ({ value: year, label: String(year) })
  );
  const quarterOptions: OptionType[] = (filterConfig.quarters as string[]).map(
    (quarter) => ({ value: quarter, label: quarter })
  );
  const personaOptions: OptionType[] = personas.map((persona) => ({
    value: persona,
    label: persona,
  }));

  const handleCompanySelect = (
    selected: OptionType | MultiValue<OptionType>
  ) => {
    if (filterConfig.selectProps.companies.isMulti) {
      dispatch(
        setCompanies(
          (selected as MultiValue<OptionType>).map(
            (option) => option.value as string
          )
        )
      );
    } else {
      const option = selected as OptionType;
      dispatch(setCompanies(option ? [option.value as string] : []));
    }
  };

  const handleYearSelect = (selected: OptionType | MultiValue<OptionType>) => {
    if (filterConfig.selectProps.years.isMulti) {
      dispatch(
        setYear(
          (selected as MultiValue<OptionType>).map(
            (option) => option.value as number
          )
        )
      );
    } else {
      const option = selected as OptionType;
      dispatch(setYear(option ? [option.value as number] : []));
    }
  };

  const handleQuarterSelect = (selected: OptionType | MultiValue<OptionType>) => {
    if (filterConfig.selectProps.quarters.isMulti) {
      dispatch(
        setQuarter(
          (selected as MultiValue<OptionType>).map(
            (option) => option.value as string
          )
        )
      );
    } else {
      const option = selected as OptionType;
      dispatch(setQuarter(option ? [option.value as string] : []));
    }
  };

  const fetchDataFromYahooFinance = async (symbol: string) => {
    if (!symbol) return;
    try {
      const res = await fetch(`/api/yahoo-finance?symbol=${symbol}`);
      const result = await res.json();
      console.log("result", result);
      dispatch(setEarningsData(result));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log("Selected Companies:", selectedCompanies);
    console.log("Selected Year:", selectedYear);
    console.log("Selected Quarter:", selectedQuarter);
  }, [selectedCompanies, selectedYear, selectedQuarter]);

  return (
    <div
      className={`transition-all duration-300 ${!collapsed ? "p-8 opacity-100 space-y-6" : "p-0 opacity-0"
        } bg-white border border-gray-200 shadow-lg h-screen overflow-hidden`}
    >
      {/* Company Multi-Select */}
      <div>
        <label className="text-sm font-medium text-gray-800 block mb-2">
          Company
        </label>
        <Select isDisabled={filterConfig.selectProps.companies.isDisabled}
          options={companyOptions}
          isMulti={filterConfig.selectProps.companies.isMulti}
          value={
            filterConfig.selectProps.companies.isMulti
              ? companyOptions.filter((option) =>
                selectedCompanies.includes(option.value)
              )
              : companyOptions.find((option) => option.value === selectedCompanies[0]) || null
          }
          onChange={handleCompanySelect}
          placeholder={filterConfig.selectProps.companies.placeholder}
          styles={customStyles}
          formatOptionLabel={(option: OptionType) => (
            <div className="flex items-center">
              {option.logo && (
                <img
                  src={option.logo}
                  alt={option.label}
                  className="w-6 h-6 mr-2 rounded-full"
                />
              )}
              <span>{option.label}</span>
            </div>
          )}
        />
      </div>

      {/* Year Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Year
        </label>
        <Select isDisabled={filterConfig.selectProps.years.isDisabled}
          options={yearOptions}
          isMulti={filterConfig.selectProps.years.isMulti}
          value={
            filterConfig.selectProps.years.isMulti
              ? yearOptions.filter((option) =>
                (selectedYear as number[]).includes(option.value as number)
              )
              : yearOptions.find(
                (option) =>
                  option.value === (selectedYear as number[])[0]
              ) || null
          }
          onChange={handleYearSelect}
          placeholder={filterConfig.selectProps.years.placeholder}
          styles={customStyles}
        />
      </div>

      {/* Quarter Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Quarter
        </label>
        <Select isDisabled={filterConfig.selectProps.quarters.isDisabled}
          options={quarterOptions}
          isMulti={filterConfig.selectProps.quarters.isMulti}
          value={
            filterConfig.selectProps.quarters.isMulti
              ? quarterOptions.filter((option) =>
                (selectedQuarter as string[]).includes(
                  option.value as string
                )
              )
              : quarterOptions.find(
                (option) =>
                  option.value === (selectedQuarter as string[])[0]
              ) || null
          }
          onChange={handleQuarterSelect}
          placeholder={filterConfig.selectProps.quarters.placeholder}
          styles={customStyles}
        />
      </div>

      {/* Persona Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Persona
        </label>
        <Select isDisabled={filterConfig.selectProps.persona.isDisabled}
          options={personaOptions}
          isMulti={filterConfig.selectProps.persona.isMulti}
          value={
            selectedPersona
              ? { value: selectedPersona, label: selectedPersona }
              : null
          }
          onChange={(option: any) =>
            dispatch(setPersona(option?.value))
          }
          placeholder={filterConfig.selectProps.persona.placeholder}
          styles={customStyles}
        />
      </div>

      {/* Model Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Model
        </label>
        <Select isDisabled={filterConfig.selectProps.model.isDisabled}
          options={models}
          isMulti={filterConfig.selectProps.model.isMulti}
          value={
            selectedModal
              ? { value: selectedModal, label: selectedModal }
              : null
          }
          onChange={(option: any) =>
            dispatch(setFoundationModel(option?.value))
          }
          placeholder={filterConfig.selectProps.model.placeholder}
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default FilterOptions;
