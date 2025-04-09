"use client";
import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";

export default function AuthModal({ isOpen, onClose }) {
  const supabase = createClient();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-[#1a1b1e] p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white/90">
            Sign in to Contest Tracker
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/60 hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#1a1b1e",
                  brandAccent: "#3b82f6",
                },
              },
            },
            className: {
              container: "w-full",
              button:
                "w-full px-4 py-2 rounded-xl font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-200",
              input:
                "w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/90 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
              label: "text-sm font-medium text-white/70",
            },
          }}
          theme="dark"
          providers={["github", "google"]}
        />
      </div>
    </div>
  );
}
