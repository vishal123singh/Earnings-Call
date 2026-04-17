import { ParentContext } from "@/clientLayout";
import AppBar from "@mui/material/AppBar/AppBar";
import Avatar from "@mui/material/Avatar/Avatar";
import Button from "@mui/material/Button/Button";
import IconButton from "@mui/material/IconButton/IconButton";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import {
  PanelRightClose,
  PanelRightOpen,
  Menu,
  X,
  Home,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  FileText,
  LogOut,
  LogIn,
  UserPlus,
  Brain,
  ChevronDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LogoImage from "../../../public/images/logo_3.png"; // or relative path

// Modern Navbar Component
const Navbar = ({ handleLogout }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoginOpen, setIsSignupOpen, collapsed, handleToggleSidebar } =
    useContext(ParentContext);
  const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  // useEffect(() => {
  //   const container = document.getElementById("main-scroll-container");

  //   if (!container) return;

  //   const handleScroll = () => {
  //     const currentY = container.scrollTop;
  //     const delta = currentY - lastScrollY.current;

  //     if (currentY < 80) {
  //       setVisible(true);
  //     } else if (delta > 5) {
  //       setVisible(false);
  //       setShowUserMenu(false);
  //     } else if (delta < -5) {
  //       setVisible(true);
  //     }

  //     lastScrollY.current = currentY;
  //   };

  //   container.addEventListener("scroll", handleScroll);

  //   return () => {
  //     container.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user.name || user.email?.split("@")[0] || "User");
  }, [isUserLoggedIn]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  const navItems = useMemo(
    () => [
      { label: "Home", path: "/", icon: Home },
      {
        label: "Dashboard",
        path: "/competitive-insights",
        icon: LayoutDashboard,
      },
      { label: "Insights", path: "/insights", icon: TrendingUp },
      {
        label: "Sentiment",
        path: "/sentiment-analysis",
        icon: BarChart3,
        shortLabel: "Sentiment",
      },
      { label: "Transcript", path: "/transcript", icon: FileText },
    ],
    [],
  );

  const isActive = (path) => pathname === path;

  // Get responsive label based on screen size
  const getNavLabel = (item) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return item.shortLabel || item.label;
    }
    return item.label;
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: scrolled ? "var(--background)" : "var(--background)",
          backdropFilter: "blur(10px)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0, 0, 0, 0.08)"
            : "0 2px 8px rgba(0, 0, 0, 0.04)",
          padding: { xs: "0 8px", sm: "0 16px", md: "0 24px" },
          zIndex: 1201,
          borderBottom: "1px solid var(--border)",
          transform: visible ? "translateY(0)" : "translateY(-110%)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: "56px", sm: "64px", md: "70px" },
            padding: { xs: 0, sm: "0 4px", md: "0 8px" },
            display: "flex",
            justifyContent: "space-between",
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Left Section - Logo & Sidebar Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {/* Sidebar Toggle Button */}
            {[
              "/insights",
              "/sentiment-analysis",
              "/competitive-insights",
              "/transcript",
            ].includes(pathname) && (
              <motion.div
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className="hidden sm:block"
              >
                <IconButton
                  onClick={handleToggleSidebar}
                  sx={{
                    backgroundColor: collapsed
                      ? "rgba(37, 99, 235, 0.1)"
                      : "var(--muted)",
                    borderRadius: "12px",
                    padding: { xs: "6px", sm: "8px", md: "10px" },
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.15)",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  {collapsed ? (
                    <PanelRightOpen
                      size={20}
                      style={{ color: "var(--primary)" }}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <PanelRightClose
                      size={20}
                      style={{ color: "var(--muted-foreground)" }}
                      strokeWidth={1.5}
                    />
                  )}
                </IconButton>
              </motion.div>
            )}

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center cursor-pointer group flex-shrink-0"
              onClick={() => router.push("/")}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <Image
                  src={LogoImage}
                  alt="InvestorEye Logo"
                  width={60}
                  height={60}
                  className="object-contain w-[60px] sm:w-[60px] md:w-[80px] lg:w-[80px] h-auto"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation - Responsive spacing */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-wrap justify-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={() => router.push(item.path)}
                  sx={{
                    position: "relative",
                    color: isActive(item.path)
                      ? "var(--primary)"
                      : "var(--muted-foreground)",
                    fontWeight: 600,
                    fontSize: { md: "0.8rem", lg: "0.9rem" },
                    textTransform: "none",
                    padding: { md: "6px 8px", lg: "8px 12px", xl: "8px 16px" },
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      color: "var(--primary)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <item.icon
                    size={16}
                    className="mr-1.5 lg:mr-2"
                    strokeWidth={1.5}
                  />
                  <span className="hidden lg:inline text-sm">{item.label}</span>
                  <span className="inline lg:hidden text-sm">
                    {item.shortLabel || item.label}
                  </span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--tertiary) 100%)",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Right Section - Auth Buttons & Avatar */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {isUserLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 sm:gap-2 md:gap-3"
              >
                {/* User Info with Dropdown - Desktop */}
                <div className="relative hidden sm:block">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 rounded-full cursor-pointer transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--muted) 0%, var(--background) 100%)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 28, sm: 30, md: 34 },
                        height: { xs: 28, sm: 30, md: 34 },
                        background:
                          "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--tertiary) 100%)",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <span
                      className="hidden md:inline text-sm font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {userName.length > 12
                        ? `${userName.slice(0, 10)}...`
                        : userName}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`hidden md:block transition-transform duration-200 ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  </motion.div>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden"
                        style={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted flex items-center gap-2 transition-colors"
                            style={{ color: "var(--destructive)" }}
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Logout Button - Desktop (simplified for smaller screens) */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:block"
                >
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    sx={{
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                      borderRadius: "12px",
                      padding: { md: "6px 12px", lg: "8px 20px" },
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: { md: "0.8rem", lg: "0.875rem" },
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                        color: "var(--primary-foreground)",
                        borderColor: "transparent",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
                      },
                    }}
                  >
                    <LogOut size={16} className="mr-1.5 lg:mr-2" />
                    <span className="hidden xl:inline">Logout</span>
                  </Button>
                </motion.div>

                {/* Mobile Menu Button */}
                <IconButton
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sx={{
                    display: { xs: "flex", md: "none" },
                    borderRadius: "10px",
                    padding: "8px",
                    backgroundColor: mobileMenuOpen
                      ? "rgba(37, 99, 235, 0.1)"
                      : "transparent",
                  }}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </IconButton>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Login Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setIsLoginOpen(true)}
                    variant="text"
                    sx={{
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "10px",
                      padding: { xs: "6px 10px", sm: "8px 16px" },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      minWidth: "auto",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.08)",
                        color: "var(--primary)",
                      },
                    }}
                  >
                    <LogIn size={16} className="mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Login</span>
                  </Button>
                </motion.div>

                {/* Signup Button */}
                <motion.button
                  onClick={() => setIsSignupOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-premium bg-gradient-primary text-primary-foreground rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold capitalize shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                >
                  <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden xs:inline">Sign Up</span>
                </motion.button>

                {/* Mobile Menu Button */}
                <IconButton
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sx={{
                    display: { xs: "flex", md: "none" },
                    borderRadius: "10px",
                    padding: "8px",
                  }}
                >
                  <Menu size={20} />
                </IconButton>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Click outside handler for user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[320px] shadow-2xl z-50 md:hidden flex flex-col"
              style={{ backgroundColor: "var(--background)" }}
            >
              {/* Drawer Header */}
              <div
                className="p-4 sm:p-6 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain
                      size={24}
                      style={{ color: "var(--primary)" }}
                      strokeWidth={1.5}
                    />
                    <span className="font-bold text-base sm:text-lg text-gradient-primary">
                      InvestorEye
                    </span>
                  </div>
                  <IconButton onClick={() => setMobileMenuOpen(false)}>
                    <X size={20} style={{ color: "var(--foreground)" }} />
                  </IconButton>
                </div>

                {/* User Info in Mobile */}
                {isUserLoggedIn && (
                  <div
                    className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--muted) 0%, var(--background) 100%)",
                    }}
                  >
                    <Avatar
                      sx={{
                        background:
                          "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--tertiary) 100%)",
                        width: 44,
                        height: 44,
                        fontSize: "1.1rem",
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold truncate"
                        style={{ color: "var(--foreground)" }}
                      >
                        {userName}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Welcome back! 👋
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Navigation */}
              <div className="flex-1 overflow-y-auto py-4">
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`mx-3 mb-2 px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center gap-3`}
                    style={{
                      background: isActive(item.path)
                        ? "linear-gradient(90deg, rgba(37, 99, 235, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)"
                        : "transparent",
                      color: isActive(item.path)
                        ? "var(--primary)"
                        : "var(--foreground)",
                      borderLeft: isActive(item.path)
                        ? "4px solid var(--primary)"
                        : "4px solid transparent",
                    }}
                  >
                    <item.icon size={18} strokeWidth={1.5} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div
                className="p-4 sm:p-6 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                {!isUserLoggedIn ? (
                  <div className="space-y-2">
                    <Button
                      fullWidth
                      onClick={() => {
                        setIsLoginOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      variant="outlined"
                      sx={{
                        borderColor: "var(--primary)",
                        color: "var(--primary)",
                        borderRadius: "12px",
                        padding: "10px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: "rgba(37, 99, 235, 0.08)",
                        },
                      }}
                    >
                      <LogIn size={18} className="mr-2" />
                      Login
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        setIsSignupOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--tertiary) 100%)",
                        borderRadius: "12px",
                        padding: "10px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <UserPlus size={18} className="mr-2" />
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <Button
                    fullWidth
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    variant="outlined"
                    sx={{
                      borderColor: "var(--destructive)",
                      color: "var(--destructive)",
                      borderRadius: "12px",
                      padding: "10px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      "&:hover": {
                        backgroundColor: "var(--destructive)",
                        color: "var(--destructive-foreground)",
                      },
                    }}
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
