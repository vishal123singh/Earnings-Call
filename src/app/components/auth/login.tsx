'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from 'react-redux';
import { setIsUserLoggedIn } from '../../../../store/userSlice';

// Define the types for the props
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    setIsSignupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginModal({ isOpen, onClose, setIsSignupOpen }: LoginModalProps) {
    const { push } = useRouter();
    const dispatch = useDispatch()
    // Define state types
    const [inputs, setInputs] = useState<{
        email: string;
        enteredOTP: string;
        captchaToken: string;
    }>({
        email: '',
        enteredOTP: '',
        captchaToken: ''
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [authStep, setAuthStep] = useState<number>(1);

    // Snackbar state types
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

    // Cleanup on modal close or component unmount
    useEffect(() => {
        const abortController = new AbortController();
        const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
            abortController.abort();
            resetState();
        };
    }, [isOpen]);

    const resetState = () => {
        setInputs({ email: '', enteredOTP: '', captchaToken: '' });
        setAuthStep(1);
        setLoading(false);
        setSnackbarOpen(false);
        setSnackbarMessage('');
        setSnackbarSeverity('success');
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSignInWithGoogle = async () => {
        push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`);
    };

    const handleSubmit = async (e: React.FormEvent, resendOTP: boolean = false) => {
        e.preventDefault();

        if (resendOTP) {
            // setAuthStep(1);
            // setInputs((prev) => ({
            //     ...prev,
            //     enteredOTP: ''
            // }));
            console.log("authStep", authStep)
        }

        if (
            ((authStep === 1 || resendOTP) && (!inputs.email || !inputs.captchaToken)) ||
            (authStep === 2 && !inputs.enteredOTP)
        ) {
            showSnackbar(
                !inputs.email
                    ? "Email is required"
                    : !inputs.captchaToken
                        ? "Please verify yourself"
                        : "OTP is required",
                'error'
            );

            return;
        }

        if ((authStep === 1 || resendOTP) && inputs.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
            showSnackbar("Invalid email address", 'error');
            return;
        }

        if ((authStep === 2 && !resendOTP) && inputs.enteredOTP.length < 6) {
            showSnackbar("OTP must be at least 6 characters", 'error');
            return;
        }

        setLoading(true);
        try {
            const url = (authStep === 1 || resendOTP)
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-otp`;

            const signin = await axios.post(url, inputs);

            if (signin.data.status) {
                if (signin.data.Step === 1) {
                    showSnackbar(signin.data.message);
                    setAuthStep(2);
                } else if (signin.data.Step === 2) {
                    showSnackbar("SignIn Successful!");
                    localStorage.setItem("accessToken", signin.data.data.accessToken);
                    localStorage.setItem("refreshToken", signin.data.data.refreshToken);
                    localStorage.setItem("id", signin.data.data.id);
                    localStorage.setItem("name", signin.data.data.name);
                    localStorage.setItem("role", signin.data.data.role);
                    localStorage.setItem("email", signin.data.data.email);
                    setTimeout(() => {
                        dispatch(setIsUserLoggedIn(true));
                        onClose()
                    }, 500);
                } else {
                    showSnackbar(signin.data.message, 'info');
                }
            } else {
                showSnackbar(signin.data.message, 'error');
            }
        } catch (error:any) {
            showSnackbar(
                error?.response?.data?.message || "An error occurred during sign-in.",
                'error'
            );
            console.error("Error during login:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCaptcha = (value: string | null) => {
        setInputs((prev) => ({
            ...prev,
            captchaToken: value || ''
        }));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-[10000]"
                onClick={onClose}
            >
                {/* Snackbar */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative text-gray-900"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={20} />
                    </button>

                    {/* Title */}
                    <div className="flex flex-col items-center gap-2">
                        <Image src="/images/icons/logo.png" width={150} height={150} alt="Intellibooks" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                            Welcome Back
                        </h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className='mb-8'>
                            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={inputs.email}
                                onChange={(e) =>
                                    setInputs((prev) => ({ ...prev, email: e.target.value }))
                                }
                                required
                                className="w-full px-4 py-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                            />
                        </div>
                        <div className="flex w-full overflow-hidden">
                            <div className="w-full max-w-xs">
                                <div className="transform scale-75 sm:scale-100" style={{ transformOrigin: "top left" }}>
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                                        onChange={handleVerifyCaptcha}
                                    />
                                </div>
                            </div>
                        </div>
                        {authStep === 2 && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={inputs.enteredOTP}
                                    onChange={(e) => setInputs({ ...inputs, enteredOTP: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="text-blue-600 underline text-sm"
                                >
                                    Resend OTP
                                </button>
                            </>
                        )}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className={`w-full bg-gray-900 text-white py-3 rounded-lg shadow-md transition-all duration-200 font-medium ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                        >
                            {loading ? 'Loading...' : authStep === 1 ? 'Send OTP' : 'Verify OTP'}
                        </motion.button>
                    </form>

                    {/* OAuth Buttons */}
                    <button
                        onClick={handleSignInWithGoogle}
                        className="mt-4 flex items-center justify-center w-full bg-gray-100 text-gray-700 py-3 rounded-lg shadow-sm hover:bg-gray-200 transition"
                    >
                        <Image src="/images/icons/google.png" alt="Google" width={20} height={20} />
                        <span className="ml-2 text-sm font-medium">Sign in with Google</span>
                    </button>

                      {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <span
                        onClick={() => {
                            onClose();
                            setIsSignupOpen(true);
                        }}
                        className="text-gray-900 font-medium hover:underline cursor-pointer"
                    >
                        Sign up
                    </span>
                </p>
                </motion.div>
            </div>
        </>
    );
}
