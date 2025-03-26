"use client";
import { useState } from "react";

export default function FilterSection() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm w-[280px]">
      <div className="space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filter Contests</h2>
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Filters</span>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Platforms</h3>
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                  Codeforces
                </button>
                <button className="btn btn-sm bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">
                  CodeChef
                </button>
                <button className="btn btn-sm bg-green-100 text-green-700 hover:bg-green-200 border-none">
                  LeetCode
                </button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Status</h3>
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    className="radio radio-sm radio-primary"
                    defaultChecked
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    className="radio radio-sm radio-primary"
                  />
                  <span>Upcoming</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    className="radio radio-sm radio-primary"
                  />
                  <span>Ongoing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    className="radio radio-sm radio-primary"
                  />
                  <span>Past</span>
                </label>
              </div>
            </div>
          </div>

          {/* Bookmarked Only */}
          <div className="form-control">
            <label className="cursor-pointer label justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span className="label-text">Bookmarked Only</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="btn btn-sm btn-primary flex-1 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </button>
          <button className="btn btn-sm btn-ghost">Reset</button>
        </div>
      </div>
    </div>
  );
}
