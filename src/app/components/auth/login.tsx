"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrainCog, X } from "lucide-react";
import Image from "next/image";
import { Snackbar, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { setIsUserLoggedIn } from "../../../../store/userSlice";

// 🔥 Firebase
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsSignupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginModal({
  isOpen,
  onClose,
  setIsSignupOpen,
}: LoginModalProps) {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      resetState();
    };
  }, [isOpen]);

  const resetState = () => {
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // 🔥 Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return showSnackbar("Email & Password required", "error");
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // ✅ Store token in cookie (for middleware later)
      const token = await user.getIdToken();
      document.cookie = `token=${token}; path=/`;

      showSnackbar("Login Successful");

      setTimeout(() => {
        onClose();
        push("/insights"); // ✅ match your protected routes
      }, 500);
    } catch (error: any) {
      showSnackbar(error.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      // ✅ cookie instead of localStorage
      document.cookie = `token=${token}; path=/`;

      showSnackbar("Google Login Successful");

      setTimeout(() => {
        onClose();
        push("/insights");
      }, 500);
    } catch (error: any) {
      showSnackbar(error.message || "Google login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <BrainCog
            size={28}
            style={{ color: "var(--primary)" }}
            strokeWidth={1.5}
            className="relative"
          />
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
          <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg"
          >
            {loading ? "Loading..." : "Login"}
          </motion.button>
        </form>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          className="mt-4 flex items-center justify-center w-full bg-gray-100 py-3 rounded-lg"
        >
          <Image
            src="/images/icons/google.png"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="ml-2 text-sm font-medium">Sign in with Google</span>
        </button>

        {/* Footer */}
        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => {
              onClose();
              setIsSignupOpen(true);
            }}
            className="font-medium underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
