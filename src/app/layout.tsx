'use client';
import { Sora } from "next/font/google";
import { useContext, useEffect, useState } from 'react';
import { CssBaseline, IconButton, Box, AppBar, Toolbar, Tabs, Tab, Button, Avatar } from '@mui/material';
import './globals.css';
import Sidebar from './components/sidebar';
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../../store/store";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { createContext } from "react";
import LoginModal from "./components/auth/login";
import SignupModal from "./components/auth/register";
import { setIsUserLoggedIn } from "../../store/userSlice";
import { Snackbar, Alert } from '@mui/material';
import AIVoiceAssistant from "./components/AIVoiceAssistant";
import Navbar from "./components/navbar";

const sora = Sora({ subsets: ['latin'], weight: ["400"] });

export const ParentContext = createContext();

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);

  const router = useRouter();
  const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
  const dispatch = useDispatch();

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);

  // Check user login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setIsUserLoggedIn(true));
    }
    return () => resetState()
  }, [dispatch]);

  const resetState = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
    setSnackbarSeverity('success');
  };

  const handleToggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setIsUserLoggedIn(false));
    setSnackbarMessage('Logged out successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setTimeout(() => {
      router.push("/");
    }, 500);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ParentContext.Provider value={{ isLoginOpen, isSignupOpen, setIsLoginOpen, setIsSignupOpen, handleToggleSidebar, pathname, collapsed, isVoiceAssistantOpen, setIsVoiceAssistantOpen }}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: pathname === "/insights" ? "hidden" : "auto",
          flexDirection: ["column", "row"], // Mobile first responsive fix
        }}
      >
        {/* Sidebar */}
        {["/insights", "/sentiment-analysis", "/competitive-insights", "/transcript"].includes(pathname) && (
          <Sidebar collapsed={collapsed} />
        )}

        {/* Main Content */}
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
          {/* Navbar */}
          <Navbar handleLogout={handleLogout} />

          {/* Page Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflowY: [""].includes(pathname) ? "hidden" : "auto",
              padding: ["8px", "16px"], // Reduced padding on small screens
            }}
          >
            {children}
            <AIVoiceAssistant />

            {/* Snackbar */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} setIsSignupOpen={setIsSignupOpen} />
            <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} setIsLoginOpen={setIsLoginOpen} />
          </Box>
        </Box>
      </Box>
    </ParentContext.Provider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.className} antialiased`}>
        <Provider store={store}>
          <CssBaseline />
          <LayoutContent>{children}</LayoutContent>
        </Provider>
      </body>
    </html>
  );
}

