import { ParentContext } from "@/layout";
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
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// Modern Navbar Component
const Navbar = ({ handleLogout }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoginOpen, setIsSignupOpen, collapsed, handleToggleSidebar } =
    useContext(ParentContext);
  const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user.name || user.email?.split("@")[0] || "User");
  }, [isUserLoggedIn]);

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    {
      label: "Dashboard",
      path: "/competitive-insights",
      icon: LayoutDashboard,
    },
    { label: "Insights", path: "/insights", icon: TrendingUp },
    {
      label: "Sentiment Analysis",
      path: "/sentiment-analysis",
      icon: BarChart3,
    },
    { label: "Transcript", path: "/transcript", icon: FileText },
  ];

  const isActive = (path) => pathname === path;

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
          padding: { xs: "0 12px", sm: "0 24px" },
          zIndex: 1201,
          transition: "all 0.3s ease",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: "64px", sm: "70px" },
            padding: { xs: 0, sm: "0 8px" },
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Left Section - Logo & Sidebar Toggle */}
          <div className="flex items-center gap-3">
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
              >
                <IconButton
                  onClick={handleToggleSidebar}
                  sx={{
                    backgroundColor: collapsed
                      ? "rgba(37, 99, 235, 0.1)"
                      : "var(--muted)",
                    borderRadius: "12px",
                    padding: "10px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.15)",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  {collapsed ? (
                    <PanelRightOpen
                      size={22}
                      style={{ color: "var(--primary)" }}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <PanelRightClose
                      size={22}
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
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => router.push("/")}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--tertiary) 100%)",
                  }}
                />
                <Brain
                  size={28}
                  style={{ color: "var(--primary)" }}
                  strokeWidth={1.5}
                  className="relative"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-gradient-primary">
                  EarningsCall
                </span>
                <span
                  className="font-semibold text-lg"
                  style={{ color: "var(--foreground)" }}
                >
                  {" "}
                  Insights
                </span>
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
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
                    fontSize: "0.9rem",
                    textTransform: "none",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      color: "var(--primary)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <item.icon size={18} className="mr-2" strokeWidth={1.5} />
                  <span className="text-sm">{item.label}</span>
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
          <div className="flex items-center gap-2">
            {isUserLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3"
              >
                {/* User Info - Desktop */}
                <div
                  className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--muted) 0%, var(--background) 100%)",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      background:
                        "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--tertiary) 100%)",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                      },
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {userName}
                  </span>
                </div>

                {/* Logout Button - Desktop */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    sx={{
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                      borderRadius: "12px",
                      padding: "8px 20px",
                      fontWeight: 600,
                      textTransform: "none",
                      transition: "all 0.3s ease",
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
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </motion.div>

                {/* Mobile Menu Button */}
                <IconButton
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sx={{
                    display: { xs: "flex", md: "none" },
                    borderRadius: "10px",
                    backgroundColor: mobileMenuOpen
                      ? "rgba(37, 99, 235, 0.1)"
                      : "transparent",
                  }}
                >
                  {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </IconButton>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
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
                      padding: "8px 16px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.08)",
                        color: "var(--primary)",
                      },
                    }}
                  >
                    <LogIn size={18} className="mr-2" />
                    Login
                  </Button>
                </motion.div>

                {/* Signup Button - Pure Tailwind Version */}
                <motion.button
                  onClick={() => setIsSignupOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-premium bg-gradient-primary text-primary-foreground rounded-xl px-5 py-2 text-sm font-semibold capitalize shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  Sign Up
                </motion.button>
                {/* Mobile Menu Button */}
                <IconButton
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sx={{
                    display: { xs: "flex", md: "none" },
                    borderRadius: "10px",
                  }}
                >
                  <Menu size={22} />
                </IconButton>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>

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
              className="fixed right-0 top-0 bottom-0 w-80 shadow-2xl z-50 md:hidden flex flex-col"
              style={{ backgroundColor: "var(--background)" }}
            >
              {/* Drawer Header */}
              <div
                className="p-6 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain
                      size={28}
                      style={{ color: "var(--primary)" }}
                      strokeWidth={1.5}
                    />
                    <span className="font-bold text-lg text-gradient-primary">
                      EarningsCall Insights
                    </span>
                  </div>
                  <IconButton onClick={() => setMobileMenuOpen(false)}>
                    <X size={22} style={{ color: "var(--foreground)" }} />
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
                        width: 48,
                        height: 48,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <div
                        className="font-semibold"
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
                    <item.icon size={20} strokeWidth={1.5} />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div
                className="p-6 border-t"
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
