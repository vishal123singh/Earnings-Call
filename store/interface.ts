export interface SidebarState {
  selectedTab: string;
  documentsToReturn: number;
  persona: string;
  foundationModel: string;
  fmTemperature: number;
  fmMaxTokens: number;
  context: string;
  selectedCompanies: string[]; // Assuming it's an array of company tickers
  selectedYear: number[];
  selectedQuarter: string[];
  selectedCategory: string;
  earningsData: any;
}