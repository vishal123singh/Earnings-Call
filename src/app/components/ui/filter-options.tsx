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
import { ParentContext } from "@/clientLayout";

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

// Custom Styles for Select using CSS variables
const customStyles: StylesConfig<OptionType, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--background)",
    borderColor: state.isFocused ? "var(--primary)" : "var(--border)",
    color: "var(--foreground)",
    borderRadius: "0.75rem",
    boxShadow: state.isFocused ? `0 0 12px rgba(37, 99, 235, 0.3)` : "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      borderColor: "var(--primary)",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--background)",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
        ? "rgba(37, 99, 235, 0.1)"
        : "var(--background)",
    color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
    "&:hover": {
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      color: "var(--foreground)",
    },
    transition: "background-color 0.2s ease, color 0.2s ease",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--primary)",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--primary)",
    "&:hover": {
      backgroundColor: "rgba(37, 99, 235, 0.2)",
      color: "var(--primary)",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
  }),
  input: (base) => ({
    ...base,
    color: "var(--foreground)",
  }),
};

const FilterOptions = () => {
  const dispatch = useDispatch();
  const { collapsed } = useContext(ParentContext);

  // Get filter configuration and current selections from redux state
  const filterConfig = useSelector((state: any) => state.sidebar.filterConfig);
  const selectedCompanies = useSelector(
    (state: any) => state.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state: any) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector(
    (state: any) => state.sidebar.selectedQuarter,
  );
  const selectedPersona = useSelector((state: any) => state.sidebar.persona);
  const selectedModal = useSelector(
    (state: any) => state.sidebar.foundationModel,
  );

  // Create option arrays for companies, years and quarters
  const companyOptions: OptionType[] = filterConfig.companies.map(
    (company: Company) => ({
      value: company.ticker,
      label: company.name,
      logo: company.logo,
    }),
  );
  const yearOptions: OptionType[] = (filterConfig.years as number[]).map(
    (year) => ({ value: year, label: String(year) }),
  );
  const quarterOptions: OptionType[] = (filterConfig.quarters as string[]).map(
    (quarter) => ({ value: quarter, label: quarter }),
  );
  const personaOptions: OptionType[] = personas.map((persona) => ({
    value: persona,
    label: persona,
  }));

  const handleCompanySelect = (
    selected: OptionType | MultiValue<OptionType>,
  ) => {
    if (filterConfig.selectProps.companies.isMulti) {
      dispatch(
        setCompanies(
          (selected as MultiValue<OptionType>).map(
            (option) => option.value as string,
          ),
        ),
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
            (option) => option.value as number,
          ),
        ),
      );
    } else {
      const option = selected as OptionType;
      dispatch(setYear(option ? [option.value as number] : []));
    }
  };

  const handleQuarterSelect = (
    selected: OptionType | MultiValue<OptionType>,
  ) => {
    if (filterConfig.selectProps.quarters.isMulti) {
      dispatch(
        setQuarter(
          (selected as MultiValue<OptionType>).map(
            (option) => option.value as string,
          ),
        ),
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

  return (
    <div
      className={`transition-all duration-300 ${
        !collapsed ? "p-8 opacity-100 space-y-6" : "p-0 opacity-0"
      } h-full overflow-y-auto`}
      style={{
        background: "var(--sidebar)",
      }}
    >
      {/* Company Multi-Select */}
      <div>
        <label
          className="text-sm font-medium block mb-2"
          style={{ color: "var(--sidebar-foreground)" }}
        >
          Company
        </label>
        <Select
          isDisabled={filterConfig.selectProps.companies.isDisabled}
          options={companyOptions}
          isMulti={filterConfig.selectProps.companies.isMulti}
          value={
            filterConfig.selectProps.companies.isMulti
              ? companyOptions.filter((option) =>
                  selectedCompanies.includes(option.value),
                )
              : companyOptions.find(
                  (option) => option.value === selectedCompanies[0],
                ) || null
          }
          onChange={handleCompanySelect}
          placeholder={filterConfig.selectProps.companies.placeholder}
          styles={customStyles}
          formatOptionLabel={(option: OptionType) => (
            <div className="flex items-center">
              <span style={{ color: "var(--foreground)" }}>{option.label}</span>
            </div>
          )}
        />
      </div>

      {/* Year Select */}
      <div>
        <label
          className="text-sm font-medium block mb-2"
          style={{ color: "var(--sidebar-foreground)" }}
        >
          Year
        </label>
        <Select
          isDisabled={filterConfig.selectProps.years.isDisabled}
          options={yearOptions}
          isMulti={filterConfig.selectProps.years.isMulti}
          value={
            filterConfig.selectProps.years.isMulti
              ? yearOptions.filter((option) =>
                  (selectedYear as number[]).includes(option.value as number),
                )
              : yearOptions.find(
                  (option) => option.value === (selectedYear as number[])[0],
                ) || null
          }
          onChange={handleYearSelect}
          placeholder={filterConfig.selectProps.years.placeholder}
          styles={customStyles}
        />
      </div>

      {/* Quarter Select */}
      <div>
        <label
          className="text-sm font-medium block mb-2"
          style={{ color: "var(--sidebar-foreground)" }}
        >
          Quarter
        </label>
        <Select
          isDisabled={filterConfig.selectProps.quarters.isDisabled}
          options={quarterOptions}
          isMulti={filterConfig.selectProps.quarters.isMulti}
          value={
            filterConfig.selectProps.quarters.isMulti
              ? quarterOptions.filter((option) =>
                  (selectedQuarter as string[]).includes(
                    option.value as string,
                  ),
                )
              : quarterOptions.find(
                  (option) => option.value === (selectedQuarter as string[])[0],
                ) || null
          }
          onChange={handleQuarterSelect}
          placeholder={filterConfig.selectProps.quarters.placeholder}
          styles={customStyles}
        />
      </div>

      {/* Persona Select */}
      <div>
        <label
          className="text-sm font-medium block mb-2"
          style={{ color: "var(--sidebar-foreground)" }}
        >
          Persona
        </label>
        <Select
          isDisabled={filterConfig.selectProps.persona.isDisabled}
          options={personaOptions}
          isMulti={filterConfig.selectProps.persona.isMulti}
          value={
            selectedPersona
              ? { value: selectedPersona, label: selectedPersona }
              : null
          }
          onChange={(option: any) => dispatch(setPersona(option?.value))}
          placeholder={filterConfig.selectProps.persona.placeholder}
          styles={customStyles}
        />
      </div>

      {/* Model Select */}
      {/* <div>
        <label
          className="text-sm font-medium block mb-2"
          style={{ color: "var(--sidebar-foreground)" }}
        >
          Model
        </label>
        <Select
          isDisabled={filterConfig.selectProps.model.isDisabled}
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
      </div> */}

      {/* Apply Filters Button */}
      {/* <button
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:translate-y-[-2px]"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
          color: "var(--primary-foreground)",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
        }}
      >
        Apply Filters
      </button> */}

      {/* Reset Button */}
      {/* <button
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:translate-y-[-2px]"
        style={{
          background: "transparent",
          color: "var(--muted-foreground)",
          border: `1px solid var(--border)`,
        }}
      >
        Reset All
      </button> */}
    </div>
  );
};

export default FilterOptions;
