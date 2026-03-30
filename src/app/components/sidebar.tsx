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
      className={`h-screen bg-gray-50 shadow-md overflow-hidden flex-shrink-0`}
      style={{
        minWidth: collapsed ? "0px" : "250px", // Ensures a minimum width
      }}
    >
      {!collapsed && (
        <Box className="space-y-4 bg-purple-50">
          {/* Filter Options */}
          <FilterOptions />
        </Box>
      )}
    </motion.div>
  );
};

export default Sidebar;
