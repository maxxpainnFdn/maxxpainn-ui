import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const buttonVariants = ({ variant, size }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    outline: "border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white",
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
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis1" className="flex h-9 w-9 items-center justify-center text-gray-500">
          <MoreHorizontal className="h-4 w-4" />
        </span>
      );
    }
    
    // Show current page if not first or last
    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push(
        <button
          key={currentPage}
          //onClick={() => onPageChange(currentPage)}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "cursor-pointer"
          )}
          disabled
        >
          {currentPage}
        </button>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis2" className="flex h-9 w-9 items-center justify-center text-gray-500">
          <MoreHorizontal className="h-4 w-4" />
        </span>
      );
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={cn(
            buttonVariants({ variant: currentPage === totalPages ? "outline" : "ghost", size: "icon" }),
            "cursor-pointer"
          )}
        >
          {totalPages}
        </button>
      );
    }
    
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

