"use client"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';


function Footer() {
    return (
      <footer className="bg-gray-50 w-full py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo and Description */}
            <div className="flex flex-col items-start">
              <img src="/images/icons/logo.png" alt="Logo" className="h-12" />

              <p className="text-gray-800 mt-2 text-base">
                Empowering your business with cutting-edge solutions.
              </p>
            </div>
  
            {/* Navigation Links */}
            <div className="flex flex-wrap gap-12">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Company
                </h3>
                <a href="/about" className="block text-gray-600 hover:text-purple-500 transition-colors">About</a>
                <a href="/services" className="block text-gray-600 hover:text-purple-500 transition-colors">Services</a>
                <a href="/privacy-policy" className="block text-gray-600 hover:text-purple-500 transition-colors">Privacy Policy</a>
                <a href="/contact" className="block text-gray-600 hover:text-purple-500 transition-colors">Contact</a>
              </div>
            </div>
  
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: <Facebook size={20} />, href: "#" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Instagram size={20} />, href: "#" },
                { icon: <Linkedin size={20} />, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-transform hover:scale-105 text-gray-500 hover:text-purple-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
  
          {/* Divider */}
          <div className="border-t border-gray-200 my-8" />
  
          {/* Copyright */}
          <p className="text-center text-gray-800 text-sm">
            © {new Date().getFullYear()} Company. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  export default Footer;