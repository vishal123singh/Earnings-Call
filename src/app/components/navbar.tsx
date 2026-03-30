import { ParentContext } from "@/layout";
import AppBar from "@mui/material/AppBar/AppBar";
import Avatar from "@mui/material/Avatar/Avatar";
import Button from "@mui/material/Button/Button";
import IconButton from "@mui/material/IconButton/IconButton";
import Tab from "@mui/material/Tab/Tab";
import Tabs from "@mui/material/Tabs/Tabs";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Navbar Component
const Navbar = ({ handleLogout }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { setIsLoginOpen, setIsSignupOpen, collapsed, handleToggleSidebar } = useContext(ParentContext);
    const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
  
    const [tabIndex, setTabIndex] = useState(0);
  
    // Update tabIndex when pathname changes
    useEffect(() => {
      const routes = ["/", "/competitive-insights", "/insights", "/sentiment-analysis", "/transcript", "/about"];
      const currentTabIndex = routes.indexOf(pathname);
      if (currentTabIndex !== -1) setTabIndex(currentTabIndex);
    }, [pathname]);
  
    const handleChange = (_event, newValue) => {
      setTabIndex(newValue);
      const routes = ["/", "/competitive-insights", "/insights", "/sentiment-analysis", "/transcript", "/about"];
      router.push(routes[newValue]);
    };
  
    return (
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
          padding: "4px 16px",
          zIndex: 1201,
        }}
      >
        <Toolbar
          className="flex items-center justify-between flex-wrap gap-2" // ✅ Added flex-wrap for smaller screens
        >
          <div className="flex items-center gap-2">
            {["/", "/about"].includes(pathname) && <img src="/images/icons/logo.png" alt="Logo" className="h-10 w-10 sm:h-12 sm:w-auto" />} {/* Responsive logo */}
            {["/insights", "/sentiment-analysis", "/competitive-insights", "/transcript"].includes(pathname) && (
              <IconButton
                color="inherit"
                onClick={handleToggleSidebar}
                className="hover:bg-gray-200 transition duration-300 ease-in-out rounded-lg"
              >
                {collapsed ? (
                  <PanelRightOpen className="text-gray-600 transition-colors duration-300" />
                ) : (
                  <PanelRightClose className="text-gray-600 transition-colors duration-300" />
                )}
              </IconButton>
            )}
          </div>
  
          {/* Navigation Tabs */}
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            textColor="inherit"
            variant="scrollable" // ✅ Prevents tab overflow
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: "black",
                fontSize: "0.8rem", // Reduced for smaller screens
                fontWeight: 600,
                padding: "8px 12px",
                transition: "color 0.3s",
                "&:hover": { color: "#DA6486" },
              },
              "& .Mui-selected": {
                color: "#DA6486",
                fontWeight: 600,
                borderBottom: "2px solid #DA6486",
              },
              "& .MuiTabs-indicator": { backgroundColor: "#DA6486" },
            }}
          >
            <Tab label="Home" />
            <Tab label="Dashboard" />
            <Tab label="Insights" />
            <Tab label="Sentiment" />
            <Tab label="Transcript" />
          </Tabs>
  
          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
{/*             {isUserLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="text"
                sx={{
                  color: "gray",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { color: "#DA6486" },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => setIsLoginOpen(true)}
                variant="text"
                sx={{
                  color: "gray",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { color: "#DA6486" },
                }}
              >
                Login
              </Button>
            )} */}
  
            {/* Signup Button */}
{/*             <Button
              onClick={() => setIsSignupOpen(true)}
              variant="contained"
              sx={{
                backgroundColor: "#DA6486",
                color: "#ffffff",
                borderRadius: "20px",
                padding: "6px 16px",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "#b85988",
                  boxShadow: "0px 6px 16px rgba(184, 89, 136, 0.3)",
                },
              }}
            >
              Sign Up
            </Button> */}
  
            {/* Avatar */}
{/*             <Avatar alt="User" src="/avatar.jpg" sx={{ width: 36, height: 36 }} /> */}
          </div>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Navbar;
