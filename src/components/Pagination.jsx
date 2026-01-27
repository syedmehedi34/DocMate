"use client";

import { useEffect, useState } from "react";

const Pagination = ({ data = [], itemsPerPage = 6, onPageDataChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, data.length);

  /* 🔹 send sliced data to parent */
  useEffect(() => {
    onPageDataChange(currentItems);
  }, [currentPage, data]);

  /* 🔹 reset page when data changes */
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-8 flex-wrap gap-2">
      {/* Left Section: Showing X to Y of Z */}
      <div className="text-gray-600 text-sm">
        Showing {startItem} to {endItem} of {data.length} items
      </div>

      {/* Right Section: Pagination Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Prev */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border font-semibold transition
            ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-blue-50 text-blue-600"
            }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg font-semibold transition
                ${
                  currentPage === page
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border font-semibold transition
            ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-blue-50 text-blue-600"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

// const [paginatedDoctors, setPaginatedDoctors] = useState([]);
{
  /* <Pagination
  data={filteredDoctors}
  itemsPerPage={itemsPerPage}
  onPageDataChange={setPaginatedDoctors}
/>; */
}
