import React from 'react';
import styles from './PostsList.module.css';

// Pagination component is fully controlled by parent - PostList.

// Receives currentPage, totalPages, and onPageChange as props
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis logic
  
  const pages = [];
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);
  if (currentPage <= 3) {
    end = Math.min(5, totalPages);
  } else if (currentPage >= totalPages - 2) {
    start = Math.max(1, totalPages - 4);
  }
  if (start > 1) {
    pages.push(
      <span key={1} onClick={() => onPageChange(1)} className={styles.pageButton}>1</span>
    );
    if (start > 2) pages.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
  }
  for (let i = start; i <= end; i++) {
    pages.push(
      <span
        key={i}
        onClick={() => onPageChange(i)}
        className={`${styles.pageButton} ${i === currentPage ? styles.pageButtonActive : ''}`}
      >
        {i}
      </span>
    );
  }
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
    pages.push(
      <span key={totalPages} onClick={() => onPageChange(totalPages)} className={styles.pageButton}>{totalPages}</span>
    );
  }

  return (
    <div className={styles.pagination}>
      <span
        onClick={() => onPageChange(currentPage - 1)}
        className={`${styles.pageButton} ${currentPage === 1 ? styles.pageButtonDisabled : ''}`}
      >
        &#8592;
      </span>
      {pages}
      <span
        onClick={() => onPageChange(currentPage + 1)}
        className={`${styles.pageButton} ${currentPage === totalPages ? styles.pageButtonDisabled : ''}`}
      >
        &#8594;
      </span>
    </div>
  );
} 