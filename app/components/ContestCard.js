export default function ContestCard({
  platform = "Codeforces",
  title = "Contest Title",
  startTime = new Date(),
  duration = "3h",
  isUpcoming = true,
}) {
  const getPlatformStyles = (platform) => {
    switch (platform.toLowerCase()) {
      case "codeforces":
        return "bg-blue-100 text-blue-700";
      case "codechef":
        return "bg-amber-100 text-amber-700";
      case "leetcode":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`badge border-none ${getPlatformStyles(platform)}`}
              >
                {platform}
              </span>
              <span className="badge badge-outline badge-primary">
                {isUpcoming ? "Upcoming" : "Past"}
              </span>
            </div>
            <h3 className="font-medium text-lg">{title}</h3>
          </div>
          <button className="btn btn-ghost btn-sm btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Start: {startTime.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Duration: {duration}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm">Join Contest</button>
        </div>
      </div>
    </div>
  );
}
