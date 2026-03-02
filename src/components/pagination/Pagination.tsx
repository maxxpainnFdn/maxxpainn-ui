import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const buttonVariants = ({ variant, size }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    outline: "border border-violet-200/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white",
    ghost: "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
  };
  return `${baseStyles} ${variants[variant] || variants.ghost} ${sizes[size] || sizes.default}`;
};

// Simplified Pagination Component
export function Pagination({ currentPage, totalPages, onPageChange, className = "", activeClassName = "" }) {
  
  const renderPageNumbers = () => {
    const pages = [];
  
    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={cn(
          buttonVariants({ variant: currentPage === 1 ? "outline" : "ghost", size: "icon" }),
          "cursor-pointer",
          currentPage === 1 && activeClassName
        )}
      >
        1
      </button>
    );
  
    if (totalPages === 1) return pages;
  
    // Left ellipsis: only if currentPage is far from the start
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis1" className="flex h-9 w-9 items-center justify-center text-gray-500">
          <MoreHorizontal className="h-4 w-4" />
        </span>
      );
    }
  
    // Middle pages: show a window around currentPage, excluding first and last
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
  
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            buttonVariants({ variant: currentPage === i ? "outline" : "ghost", size: "icon" }),
            "cursor-pointer",
            currentPage === i && activeClassName
          )}
        >
          {i}
        </button>
      );
    }
  
    // Right ellipsis: only if currentPage is far from the end
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis2" className="flex h-9 w-9 items-center justify-center text-gray-500">
          <MoreHorizontal className="h-4 w-4" />
        </span>
      );
    }
  
    // Always show last page
    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className={cn(
          buttonVariants({ variant: currentPage === totalPages ? "outline" : "ghost", size: "icon" }),
          "cursor-pointer",
          currentPage === totalPages && activeClassName
        )}
      >
        {totalPages}
      </button>
    );
  
    return pages;
  };
  
  return (
    <nav className={cn("mx-auto flex w-full justify-center", className)}>
      <div className="flex flex-row items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "gap-1 pl-2.5 cursor-pointer"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        {renderPageNumbers()}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "gap-1 pr-2.5 cursor-pointer"
          )}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

// Simple version without page numbers
export function SimplePagination({ currentPage, totalPages, onPageChange, className = "" }) {
  return (
    <nav className={cn("mx-auto flex w-full justify-center", className)}>
      <div className="flex flex-row items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "gap-1 pl-2.5 cursor-pointer"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        <div className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
          {currentPage}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "gap-1 pr-2.5 cursor-pointer"
          )}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
