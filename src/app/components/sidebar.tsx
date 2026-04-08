import { motion } from "framer-motion";
import { useContext } from "react";
import { ParentContext } from "@/layout";
import { Box } from "@mui/material";
import FilterOptions from "../components/ui/filter-options";

const Sidebar = () => {
  const { collapsed } = useContext(ParentContext);

  return (
    <motion.div
      initial={{ width: collapsed ? "0px" : "25vw" }}
      animate={{ width: collapsed ? "0px" : "25vw" }}
      transition={{ duration: 0.3 }}
      className="h-screen shadow-md overflow-hidden flex-shrink-0"
      style={{
        minWidth: collapsed ? "0px" : "250px",
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {!collapsed && (
        <Box
          className="space-y-4 h-full overflow-y-auto"
          style={{
            background: "var(--sidebar)",
          }}
        >
          {/* Optional: Add a header for sidebar */}
          <div
            className="p-4 border-b"
            style={{
              borderColor: "var(--sidebar-border)",
            }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--sidebar-foreground)" }}
            >
              Filters
            </h3>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Refine your earnings call analysis
            </p>
          </div>

          {/* Filter Options */}
          <div className="px-4 pb-4">
            <FilterOptions />
          </div>
        </Box>
      )}
    </motion.div>
  );
};

export default Sidebar;
