import DynamicChartCreator from "./DynamicChartCreator";

const FinancialPerformance = ({
  chartData,
  setChartData,
  userPrompts,
  setUserPrompts,
}) => {
  return (
    <div className="space-y-8">
      {/* Dynamic Chart Section */}
      <DynamicChartCreator
        chartData={chartData}
        setChartData={setChartData}
        userPrompts={userPrompts}
        setUserPrompts={setUserPrompts}
      />
    </div>
  );
};

export default FinancialPerformance;
