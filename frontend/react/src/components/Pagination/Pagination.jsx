import React from "react";
import "./Pagination.css"
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) endPage = Math.min(totalPages, 3);
  if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        &lt;
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={currentPage === 1 ? "active" : ""}>1</button>
          {startPage > 2 && <span>...</span>}
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={currentPage === number ? "active" : ""}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span>...</span>}
          <button onClick={() => onPageChange(totalPages)} className={currentPage === totalPages ? "active" : ""}>
            {totalPages}
          </button>
        </>
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
