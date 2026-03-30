'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    setIsLoginOpen: (isOpen: boolean) => void;
}

export default function SignupModal({ isOpen, onClose, setIsLoginOpen }: SignupModalProps) {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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
        setEmail('');
        setError(null);
        setSnackbarOpen(false);
        setSnackbarMessage('');
        setSnackbarSeverity('success');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email
        if (!emailRegex.test(email)) {
            setError('Invalid email address. Please enter a valid email.');
            setSnackbarMessage('Invalid email address. Please enter a valid email.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create_user?referer=earnings-call`,
                { email }
            );

            if (response.data.status) {
                setSuccessMessage('Signup successful! Please verify your email.');
                setSnackbarMessage('Signup successful! Please verify your email.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setEmail('');
                setTimeout(() => {
                    onClose();
                    setIsLoginOpen(true);
                }, 1000);
            } else {
                setError(response.data.message || 'Signup failed. Please try again.');
                setSnackbarMessage(response.data.message || 'Signup failed. Please try again.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setError('An error occurred. Please try again later.');
            setSnackbarMessage('An error occurred. Please try again later.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition duration-150"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>

                {/* Title */}
                <div className="flex flex-col items-center gap-2">
                    <Image src="/images/icons/logo.png" width={150} height={150} alt="Intellibooks" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        Create an Account
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div className='mb-16'>
                        <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={`w-full px-4 py-3 border rounded-lg bg-gray-50 transition duration-200 
                                    ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-gray-900'}`}
                        />
                        {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg shadow-md hover:from-gray-800 hover:to-gray-700 transition-all duration-200 font-medium"
                    >
                        Sign Up
                    </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="px-3 text-gray-400 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* OAuth Buttons */}
                <div className="flex gap-3">
                    <button
                        className="flex items-center justify-center w-full bg-gray-100 py-3 rounded-lg hover:bg-gray-200 transition duration-150 shadow-lg"
                        aria-label="Sign up with Google"
                    >
                        <div className="relative w-5 h-5 mr-2">
                            <Image src="/images/icons/google.png" alt="Google" fill className="object-contain" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <span
                        onClick={() => {
                            onClose();
                            setIsLoginOpen(true);
                        }}
                        className="text-gray-900 font-medium hover:underline cursor-pointer"
                    >
                        Sign in
                    </span>
                </p>
            </motion.div>
        </div>



    );
}
