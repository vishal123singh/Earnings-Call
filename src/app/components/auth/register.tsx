"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCog, X } from "lucide-react";
import Image from "next/image";
import { Snackbar, Alert } from "@mui/material";

// 🔥 Firebase
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsLoginOpen: (isOpen: boolean) => void;
}

export default function SignupModal({
  isOpen,
  onClose,
  setIsLoginOpen,
}: SignupModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return showSnackbar("Email & Password required", "error");
    }

    if (password.length < 6) {
      return showSnackbar("Password must be at least 6 characters", "error");
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // ✅ Set cookie for middleware
      const token = await user.getIdToken();
      document.cookie = `token=${token}; path=/; secure; samesite=strict`;

      showSnackbar("Signup Successful 🎉");

      setTimeout(() => {
        onClose();
        // ✅ Directly go to protected route
        window.location.href = "/insights";
      }, 500);
    } catch (error: any) {
      showSnackbar(error.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      // ✅ Cookie instead of localStorage
      document.cookie = `token=${token}; path=/; secure; samesite=strict`;

      showSnackbar("Google Signup Successful");

      setTimeout(() => {
        onClose();
        window.location.href = "/insights";
      }, 500);
    } catch (error: any) {
      showSnackbar(error.message || "Google signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-0 mb-6">
          <Image
            src="/images/logo_2.png"
            alt="InvestorEye Logo"
            width={120}
            height={120}
            className="object-contain"
            priority
          />

          {/* Tagline */}
          <p className="text-sm text-muted-foreground">See Beyond Numbers</p>

          {/* Heading */}
          <h2 className="text-2xl font-semibold mt-2">Create an Account</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
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
            {loading ? "Loading..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t"></div>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full bg-gray-100 py-3 rounded-lg"
        >
          <Image
            src="/images/icons/google.png"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="ml-2 text-sm font-medium">Sign up with Google</span>
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => {
              onClose();
              setIsLoginOpen(true);
            }}
            className="font-medium underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </motion.div>
    </div>
  );
}
