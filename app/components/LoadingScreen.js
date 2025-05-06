"use client";
import { useEffect, useState, useRef } from "react";

export default function LoadingScreen() {
  const [loaded, setLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [particles, setParticles] = useState([]);
  const isClient = useRef(false);

  const loadingSteps = [
    "Connecting to platforms...",
    "Fetching contest data...",
    "Preparing your dashboard...",
  ];

  // Initialize and show loading screen
  useEffect(() => {
    isClient.current = true;

    // Generate random particles
    const newParticles = Array.from({ length: 15 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `float ${3 + Math.random() * 5}s linear infinite`,
      animationDelay: `${Math.random() * 2}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
      content:
        Math.random() > 0.5 ? "{...}" : Math.random() > 0.5 ? "</>" : "()=>",
    }));

    setParticles(newParticles);

    // Step through loading messages
    const stepInterval = setInterval(() => {
      setActiveStep((prev) =>
        prev < loadingSteps.length - 1 ? prev + 1 : prev
      );
    }, 800);

    // Always show loading screen for exactly 3 seconds
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 3000);

    // Clean up timers
    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
    };
  }, []);

  if (loaded) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#0c0c0f] to-[#161925] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIG9wYWNpdHk9IjAuMSI+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-20"></div>
      </div>

      <div className="relative w-full max-w-xl px-6 flex flex-col items-center">
        {/* Floating code particles - Only rendered on client side */}
        <div className="absolute w-full h-full overflow-hidden">
          {isClient.current &&
            particles.map((particle, i) => (
              <div
                key={i}
                className="absolute text-white/10 font-mono text-xs"
                style={{
                  top: particle.top,
                  left: particle.left,
                  animation: particle.animation,
                  animationDelay: particle.animationDelay,
                  transform: particle.transform,
                }}
              >
                {particle.content}
              </div>
            ))}
        </div>

        {/* Logo & Title */}
        <div className="text-center mb-10 scale-in-center relative z-10">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 filter blur-md opacity-50 rounded-full scale-125"></div>
              <span className="font-bold text-5xl tracking-tight text-blue-300 relative">
                CP
              </span>
            </div>
            <span className="font-bold text-5xl tracking-tight text-white">
              -Track
            </span>
          </div>
          <p className="text-white/70 text-lg">
            Your competitive programming contests tracker
          </p>
        </div>

        {/* Loading Animation - Code Editor */}
        <div className="w-full max-w-md bg-[#1a1b1e]/80 rounded-xl shadow-2xl overflow-hidden border border-white/10 mb-10 scale-in-center animation-delay-300 backdrop-blur-sm">
          <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-4 text-xs text-white/60 font-mono">
              contest-tracker.js
            </div>
          </div>
          <div className="p-4 font-mono text-sm text-blue-300 typewriter overflow-hidden">
            <div>
              <span className="text-purple-400">async function</span>{" "}
              <span className="text-yellow-300">loadContests</span>() {"{"}
            </div>
            <div className="pl-4">
              <span className="text-white/70">
                {/* Loading contests from multiple platforms */}
              </span>
            </div>
            <div className="pl-4">
              <span className="text-purple-400">await</span>{" "}
              <span className="text-yellow-300">connectPlatforms</span>();
            </div>
            <div className="pl-4">
              <span className="text-purple-400">const</span> contests ={" "}
              <span className="text-purple-400">await</span>{" "}
              <span className="text-yellow-300">fetchAllContests</span>();
            </div>
            <div className="pl-4">
              <span className="text-green-400">return</span> contests;
            </div>
            <div>{"}"}</div>
          </div>
        </div>

        {/* Loading Status */}
        <div className="relative w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 loading-progress-bar"></div>
        </div>
        <div className="mt-3 text-white/80 text-sm font-medium">
          {loadingSteps[activeStep]}
        </div>

        <div className="flex gap-1.5 mt-2">
          {loadingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeStep ? "bg-blue-400 scale-125" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .scale-in-center {
          animation: scale-in-center 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            both;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        @keyframes scale-in-center {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .loading-progress-bar {
          width: 0;
          animation: loading 3s linear forwards;
        }

        @keyframes loading {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        .typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 2.5s steps(40, end);
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
