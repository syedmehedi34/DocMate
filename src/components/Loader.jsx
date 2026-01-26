"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-64 h-32 mb-8">
          <svg
            viewBox="0 0 200 60"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="heartGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            <path
              d="M 0 30 L 30 30 L 35 20 L 40 40 L 45 10 L 50 30 L 70 30"
              fill="none"
              stroke="url(#heartGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              className="heartbeat-line"
            />

            <circle
              cx="0"
              cy="30"
              r="4"
              fill="#ef4444"
              className="heartbeat-dot"
            />
          </svg>

          <div className="absolute -right-8 top-1/2 -translate-y-1/2">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping" />
              <div className="relative w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            Loading Doctors
          </h3>
          <p className="text-sm text-gray-500">Please wait...</p>
        </div>

        <div className="flex justify-center mt-6 space-x-1">
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes heartbeat-line {
          0% {
            stroke-dasharray: 0 200;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 200 200;
            stroke-dashoffset: -200;
          }
        }

        @keyframes heartbeat-dot {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(70px);
          }
        }

        .heartbeat-line {
          stroke-dasharray: 200;
          animation: heartbeat-line 2s linear infinite;
        }

        .heartbeat-dot {
          animation: heartbeat-dot 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
