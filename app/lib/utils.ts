const pstToUTC = (date: Date): Date => {
  const pstOffset = 8 * 60; // Update one day to account for DST?
  const dateUTC = new Date(date.getTime() + pstOffset * 60 * 1000);

  return dateUTC;
};

export const daysAgo = (date: Date) => {
  const datePlayedUTC = pstToUTC(date);
  const currentDateUTC = new Date();
  const differenceInMilliseconds =
    currentDateUTC.getTime() - datePlayedUTC.getTime();
  const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24;

  return Math.abs(differenceInDays).toFixed(0);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
