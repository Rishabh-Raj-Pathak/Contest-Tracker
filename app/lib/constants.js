export const PLATFORMS = {
  CODEFORCES: "codeforces",
  CODECHEF: "codechef",
  LEETCODE: "leetcode",
};

export const CONTEST_STATUS = {
  ALL: "all",
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  PAST: "past",
};

export const PLATFORM_COLORS = {
  [PLATFORMS.CODEFORCES]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    hover: "hover:bg-blue-200",
    border: "border-blue-200",
  },
  [PLATFORMS.CODECHEF]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    hover: "hover:bg-amber-200",
    border: "border-amber-200",
  },
  [PLATFORMS.LEETCODE]: {
    bg: "bg-green-100",
    text: "text-green-700",
    hover: "hover:bg-green-200",
    border: "border-green-200",
  },
};
