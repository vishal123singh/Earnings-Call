import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { ParentContext } from "@/clientLayout";
import { Box, IconButton, Drawer, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FilterOptions from "../components/ui/filter-options";

const Sidebar = () => {
  const { collapsed } = useContext(ParentContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close drawer when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobile, mobileOpen]);

  // Sidebar content component (reused for both desktop and mobile)
  const SidebarContent = () => (
    <Box
      className="space-y-2 h-full overflow-y-auto"
      style={{
        background: "var(--sidebar)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex justify-between items-center"
        style={{
          borderColor: "var(--sidebar-border)",
        }}
      >
        <div>
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
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon sx={{ color: "var(--sidebar-foreground)" }} />
          </IconButton>
        )}
      </div>

      {/* Filter Options */}
      <div className="px-4 pb-4">
        <FilterOptions />
      </div>
    </Box>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
        {/* Menu Button - Only visible on mobile when drawer is closed */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleDrawerToggle}
          className="fixed top-4 left-4 z-[1401] p-2 rounded-lg lg:hidden"
          style={{
            background: "var(--sidebar)",
            color: "var(--sidebar-foreground)",
            border: "1px solid var(--sidebar-border)",
          }}
        >
          <MenuIcon />
        </motion.button>

        {/* Drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: "85%",
              maxWidth: "320px",
              background: "var(--sidebar)",
              borderRight: "1px solid var(--sidebar-border)",
              boxShadow: "24px 0px 48px -12px rgba(0,0,0,0.2)",
            },
            zIndex: 1402,
          }}
        >
          <SidebarContent />
        </Drawer>
      </>
    );
  }

  // Desktop Sidebar - Smooth animation
  return (
    <motion.div
      initial={{ width: "280px", opacity: 1 }}
      animate={{
        width: collapsed ? "0px" : "280px",
        opacity: collapsed ? 0 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen shadow-md overflow-hidden flex-shrink-0 hidden md:block"
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      <SidebarContent />
    </motion.div>
  );
};

export default Sidebar;
