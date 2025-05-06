"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants for hover effects
  const hoverVariants = {
    initial: { opacity: 0.5 },
    hover: {
      opacity: 1,
      color: "rgba(168, 85, 247, 0.8)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <footer className="w-full bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-md border-t border-white/10 mt-auto relative overflow-hidden">
      {/* Animated Particles Background */}
      {mounted && (
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="absolute h-1 w-1 rounded-full bg-purple-500 top-[20%] left-[10%] animate-pulse"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute h-1 w-1 rounded-full bg-blue-500 top-[30%] left-[20%] animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute h-1 w-1 rounded-full bg-indigo-500 top-[70%] left-[30%] animate-pulse"
            style={{ animationDuration: "5s" }}
          ></div>
          <div
            className="absolute h-1 w-1 rounded-full bg-pink-500 top-[40%] left-[70%] animate-pulse"
            style={{ animationDuration: "6s" }}
          ></div>
          <div
            className="absolute h-1 w-1 rounded-full bg-purple-500 top-[60%] left-[80%] animate-pulse"
            style={{ animationDuration: "4.5s" }}
          ></div>

          <div
            className="absolute h-2 w-2 rounded-full bg-purple-500/50 top-[25%] left-[85%] animate-pulse"
            style={{ animationDuration: "7s" }}
          ></div>
          <div
            className="absolute h-2 w-2 rounded-full bg-blue-500/50 top-[65%] left-[15%] animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>

          <div className="absolute h-[1px] w-[100px] bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 top-[45%] left-[5%] rotate-[30deg]"></div>
          <div className="absolute h-[1px] w-[150px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 top-[35%] left-[50%] rotate-[60deg]"></div>
          <div className="absolute h-[1px] w-[100px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 top-[75%] left-[65%] rotate-[-30deg]"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Name with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left footer-glow"
          >
            <motion.h2
              className="text-xl md:text-2xl font-bold footer-gradient-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Rishabh Raj Pathak
            </motion.h2>
            <p className="text-sm text-white/70 mt-1">Contest Tracker</p>
          </motion.div>

          {/* Social Icons with animations */}
          <motion.div
            className="flex items-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Twitter/X Icon */}
            <motion.a
              href="https://x.com/rishabhXraj"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative social-icon-float"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 opacity-0 group-hover:opacity-30 blur-md transition-all duration-300"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-white group-hover:fill-blue-400 transition-colors duration-300"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Twitter/X
              </span>
            </motion.a>

            {/* GitHub Icon */}
            <motion.a
              href="https://github.com/Rishabh-Raj-Pathak"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative social-icon-float"
              style={{ animationDelay: "0.5s" }}
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-30 blur-md transition-all duration-300"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-white group-hover:fill-purple-300 transition-colors duration-300"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
              </svg>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                GitHub
              </span>
            </motion.a>
          </motion.div>
        </div>

        {/* Copyright line with animation */}
        <motion.div
          className="text-center text-xs mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.p
            variants={hoverVariants}
            initial="initial"
            whileHover="hover"
            className="inline-block cursor-default"
          >
            © {new Date().getFullYear()} Contest Tracker
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
