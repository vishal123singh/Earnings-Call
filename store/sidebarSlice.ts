import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { companies, quarters, years } from "../public/data";
import { SidebarState } from "./interface";

interface FilterConfig {
  companies: any[];
  years: number[];
  quarters: string[];
  selectProps: {
    companies: {
      isDisabled: boolean;
      isMulti: boolean;
      maxSelected: number;
      placeholder: string;
    };
    years: {
      isDisabled: boolean;
      isMulti: boolean;
      placeholder: string;
    };
    quarters: {
      isDisabled: boolean;
      isMulti: boolean;
      placeholder: string;
    };
    persona: {
      isDisabled: boolean;
      isMulti: boolean;
      placeholder: string;
    };
    model: {
      isDisabled: boolean;
      isMulti: boolean;
      placeholder: string;
    };
  };
}

const initialFilterConfig: FilterConfig = {
  companies: companies,
  years: years,
  quarters: quarters,
  selectProps: {
    companies: {
      isDisabled: false,
      isMulti: true,
      maxSelected: 5,
      placeholder: "Select companies (max 5)",
    },
    years: { isDisabled: false, isMulti: false, placeholder: "Select a year" },
    quarters: {
      isDisabled: false,
      isMulti: false,
      placeholder: "Select a quarter",
    },
    persona: {
      isDisabled: false,
      isMulti: false,
      placeholder: "Select persona",
    },
    model: { isDisabled: false, isMulti: false, placeholder: "Select model" },
  },
};

const initialState: SidebarState & { filterConfig: FilterConfig } = {
  selectedTab: "Business Insights",
  documentsToReturn: 3,
  persona: "Controller (Chief Accounting Officer)",
  foundationModel: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  fmTemperature: 1,
  fmMaxTokens: 2000,
  context: "",
  selectedCompanies: [],
  selectedYear: [years[0]],
  selectedQuarter: [quarters[0]],
  selectedCategory: "Common",
  earningsData: [],
  filterConfig: initialFilterConfig,
};

// Create the slice
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSelectedTab(state, action: PayloadAction<string>) {
      state.selectedTab = action.payload;
    },
    setDocumentsToReturn(state, action: PayloadAction<number>) {
      state.documentsToReturn = action.payload;
    },
    setPersona(state, action: PayloadAction<string>) {
      state.persona = action.payload;
    },
    setFoundationModel(state, action: PayloadAction<string>) {
      state.foundationModel = action.payload;
    },
    setFmTemperature(state, action: PayloadAction<number>) {
      state.fmTemperature = action.payload;
    },
    setFmMaxTokens(state, action: PayloadAction<number>) {
      state.fmMaxTokens = action.payload;
    },
    setContext(state, action: PayloadAction<string>) {
      state.context = action.payload;
    },
    setCompanies(state, action: PayloadAction<string[]>) {
      state.selectedCompanies = action.payload;
    },
    setYear(state, action: PayloadAction<number[]>) {
      state.selectedYear = action.payload;
    },
    setQuarter(state, action: PayloadAction<string[]>) {
      state.selectedQuarter = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setEarningsData(state, action: PayloadAction<any>) {
      state.earningsData = action.payload;
    },
    setFilterConfig(state, action: PayloadAction<FilterConfig>) {
      state.filterConfig = action.payload;
    },
  },
});

// Export actions individually
export const {
  setSelectedTab,
  setDocumentsToReturn,
  setPersona,
  setFoundationModel,
  setFmTemperature,
  setFmMaxTokens,
  setContext,
  setCompanies,
  setYear,
  setQuarter,
  setCategory,
  setEarningsData,
  setFilterConfig,
} = sidebarSlice.actions;

// Export reducer
export default sidebarSlice.reducer;
