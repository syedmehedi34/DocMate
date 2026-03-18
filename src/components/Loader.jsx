// "use client";

// export default function Loader() {
//   return (
//     <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="relative w-64 h-32 mb-8">
//           <svg
//             viewBox="0 0 200 60"
//             className="w-full h-full"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <defs>
//               <linearGradient
//                 id="heartGradient"
//                 x1="0%"
//                 y1="0%"
//                 x2="100%"
//                 y2="0%"
//               >
//                 <stop offset="0%" stopColor="#ef4444" />
//                 <stop offset="50%" stopColor="#dc2626" />
//                 <stop offset="100%" stopColor="#ef4444" />
//               </linearGradient>
//             </defs>

//             <path
//               d="M 0 30 L 30 30 L 35 20 L 40 40 L 45 10 L 50 30 L 70 30"
//               fill="none"
//               stroke="url(#heartGradient)"
//               strokeWidth="3"
//               strokeLinecap="round"
//               className="heartbeat-line"
//             />

//             <circle
//               cx="0"
//               cy="30"
//               r="4"
//               fill="#ef4444"
//               className="heartbeat-dot"
//             />
//           </svg>

//           <div className="absolute -right-8 top-1/2 -translate-y-1/2">
//             <div className="relative w-12 h-12">
//               <div className="absolute inset-0 bg-red-100 rounded-full animate-ping" />
//               <div className="relative w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
//                 <svg
//                   className="w-6 h-6 text-white"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <h3 className="text-xl font-semibold text-gray-800">
//             Loading Doctors
//           </h3>
//           <p className="text-sm text-gray-500">Please wait...</p>
//         </div>

//         <div className="flex justify-center mt-6 space-x-1">
//           <div
//             className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
//             style={{ animationDelay: "0ms" }}
//           />
//           <div
//             className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
//             style={{ animationDelay: "150ms" }}
//           />
//           <div
//             className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
//             style={{ animationDelay: "300ms" }}
//           />
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes heartbeat-line {
//           0% {
//             stroke-dasharray: 0 200;
//             stroke-dashoffset: 0;
//           }
//           100% {
//             stroke-dasharray: 200 200;
//             stroke-dashoffset: -200;
//           }
//         }

//         @keyframes heartbeat-dot {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(70px);
//           }
//         }

//         .heartbeat-line {
//           stroke-dasharray: 200;
//           animation: heartbeat-line 2s linear infinite;
//         }

//         .heartbeat-dot {
//           animation: heartbeat-dot 2s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }
"use client";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8faf9]">
      {/* Heartbeat line animation */}
      <div className="relative w-64 h-16 mb-8 overflow-hidden">
        <svg
          viewBox="0 0 260 60"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Static flat line */}
          <polyline
            points="0,30 60,30 75,30"
            fill="none"
            stroke="#d1fae5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* ECG spike */}
          <polyline
            points="75,30 85,30 95,8 105,52 115,30 130,30"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ecg-line"
          />
          {/* Rest line */}
          <polyline
            points="130,30 260,30"
            fill="none"
            stroke="#d1fae5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Animated pulse dot */}
          <circle r="4" fill="#16a34a" className="ecg-dot" />
        </svg>

        <style>{`
          .ecg-line {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: draw 1.6s ease-in-out infinite;
          }
          @keyframes draw {
            0%   { stroke-dashoffset: 200; opacity: 1; }
            70%  { stroke-dashoffset: 0;   opacity: 1; }
            100% { stroke-dashoffset: 0;   opacity: 0; }
          }
          .ecg-dot {
            animation: moveDot 1.6s ease-in-out infinite;
          }
          @keyframes moveDot {
            0%   { transform: translateX(75px)  translateY(0px); }
            30%  { transform: translateX(95px)  translateY(-22px); }
            38%  { transform: translateX(105px) translateY(22px); }
            46%  { transform: translateX(115px) translateY(0px); }
            100% { transform: translateX(260px) translateY(0px); }
          }
        `}</style>
      </div>

      {/* Logo mark */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-700 border border-green-600/40">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">
          Doc<span className="text-green-600">Mate</span>
        </span>
      </div>

      {/* Pulsing dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-green-500"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      <p className="text-sm text-gray-400 font-medium tracking-wide">
        {message}
      </p>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0);    opacity: 0.4; }
          50%       { transform: translateY(-6px); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
