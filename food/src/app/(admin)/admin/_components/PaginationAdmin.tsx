import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationAdminProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationAdmin({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationAdminProps) {
  const getPageNumbers = (isMobile: boolean = false) => {
    const pageNumbers = [];

    if (isMobile) {
      if (totalPages <= 3) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);

        if (currentPage > 2) {
          pageNumbers.push("ellipsis1");
        }

        if (currentPage !== 1 && currentPage !== totalPages) {
          pageNumbers.push(currentPage);
        }

        if (currentPage < totalPages - 1) {
          pageNumbers.push("ellipsis2");
        }

        if (totalPages > 1) {
          pageNumbers.push(totalPages);
        }
      }
    } else {
      if (totalPages <= 2) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);

        if (currentPage > 3) {
          pageNumbers.push("ellipsis1");
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
          if (i !== 1 && i !== totalPages) {
            pageNumbers.push(i);
          }
        }

        if (currentPage < totalPages - 2) {
          pageNumbers.push("ellipsis2");
        }

        if (totalPages > 1) {
          pageNumbers.push(totalPages);
        }
      }
    }

    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="w-full">
      <Pagination className="justify-center">
        <PaginationContent className="flex-wrap gap-1 sm:gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={`h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm ${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>

          <div className="hidden sm:flex">
            {getPageNumbers(false).map((pageNumber, index) =>
              pageNumber === "ellipsis1" || pageNumber === "ellipsis2" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="h-10 w-10" />
                </PaginationItem>
              ) : (
                <PaginationItem key={`page-${pageNumber}`}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof pageNumber === "number") {
                        onPageChange(pageNumber);
                      }
                    }}
                    className="h-10 w-10 text-sm"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
          </div>

          <div className="flex sm:hidden">
            {getPageNumbers(true).map((pageNumber, index) =>
              pageNumber === "ellipsis1" || pageNumber === "ellipsis2" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="h-8 w-8" />
                </PaginationItem>
              ) : (
                <PaginationItem key={`page-${pageNumber}`}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof pageNumber === "number") {
                        onPageChange(pageNumber);
                      }
                    }}
                    className="h-8 w-8 text-xs"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
          </div>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={`h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="text-center mt-2 text-xs text-gray-500 sm:hidden">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
