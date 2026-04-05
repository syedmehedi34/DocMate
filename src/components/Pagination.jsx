"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ data = [], itemsPerPage = 6, onPageDataChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startItem =
    data.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, data.length);

  useEffect(() => {
    const currentItems = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
    onPageDataChange(currentItems);
  }, [currentPage, data, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (totalPages <= 1) return null;

  /* smart page range — show max 5 pages around current */
  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 gap-4 flex-wrap">
      {/* Showing X – Y of Z */}
      <p className="text-xs font-medium text-slate-400 text-center sm:text-left tracking-wide">
        Showing <span className="font-bold text-slate-700">{startItem}</span>
        {" – "}
        <span className="font-bold text-slate-700">{endItem}</span>
        {" of "}
        <span className="font-bold text-slate-700">{data.length}</span>
        {" items"}
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-1.5 justify-center flex-wrap">
        {/* Prev */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold
                      border transition-all duration-150
                      ${
                        currentPage === 1
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                          : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50"
                      }`}
        >
          <ChevronLeft size={13} />
          Prev
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-xs text-slate-400 font-semibold"
            >
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all duration-150
                ${
                  currentPage === page
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50"
                }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold
                      border transition-all duration-150
                      ${
                        currentPage === totalPages
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                          : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50"
                      }`}
        >
          Next
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

// const [paginatedDoctors, setPaginatedDoctors] = useState([]);
// const itemsPerPage = 10;
{
  /* <Pagination
  data={filteredDoctors}
  itemsPerPage={itemsPerPage}
  onPageDataChange={setPaginatedDoctors}
/>; */
}
