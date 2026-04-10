"use client";

import { Sora, Roboto, Poppins } from "next/font/google";
import { useEffect, useState, createContext } from "react";
import {
  CssBaseline,
  Box,
  Snackbar,
  Alert,
  ThemeProvider,
} from "@mui/material";
import "./globals.css";
import Sidebar from "./components/sidebar";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../../store/store";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LoginModal from "./components/auth/login";
import SignupModal from "./components/auth/register";
import { setIsUserLoggedIn } from "../../store/userSlice";
import AIVoiceAssistant from "./components/AIVoiceAssistant";
import Navbar from "./components/navbar";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Poppins",
      "Roboto",
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "Poppins, sans-serif",
    },
  },
});

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

export const ParentContext = createContext<any>(null);

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector((state: any) => state.user.isUserLoggedIn);

  const [authChecked, setAuthChecked] = useState(false); // ✅ important

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // ✅ Protected routes (FIXED POSITION)
  const protectedRoutes = [
    "/insights",
    "/sentiment-analysis",
    "/competitive-insights",
    "/transcript",
  ];

  // ✅ Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setIsUserLoggedIn(!!user));
      setAuthChecked(true); // ✅ mark auth checked
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    console.log(searchParams);
    if (searchParams.get("login") === "true") {
      setIsLoginOpen(true);
    }
  }, [searchParams]);

  const handleToggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = async () => {
    await signOut(auth);

    document.cookie = "token=; path=/; max-age=0";

    dispatch(setIsUserLoggedIn(false));
    setSnackbarMessage("Logged out successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    router.push("/");
  };

  return (
    <ParentContext.Provider
      value={{
        isLoginOpen,
        isSignupOpen,
        setIsLoginOpen,
        setIsSignupOpen,
        handleToggleSidebar,
        pathname,
        collapsed,
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: pathname === "/insights" ? "hidden" : "auto",
          flexDirection: ["column", "row"],
        }}
      >
        {/* Sidebar */}
        {protectedRoutes.includes(pathname) && (
          <Sidebar collapsed={collapsed} />
        )}

        {/* Main */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          }}
        >
          <Navbar handleLogout={handleLogout} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: ["8px", "16px"],
            }}
          >
            {/* ✅ Prevent flicker */}
            {!authChecked ? null : children}

            <AIVoiceAssistant />

            {/* Snackbar */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
            </Snackbar>

            <LoginModal
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
              setIsSignupOpen={setIsSignupOpen}
            />

            <SignupModal
              isOpen={isSignupOpen}
              onClose={() => setIsSignupOpen(false)}
              setIsLoginOpen={setIsLoginOpen}
            />
          </Box>
        </Box>
      </Box>
    </ParentContext.Provider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Provider store={store}>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <LayoutContent>{children}</LayoutContent>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
