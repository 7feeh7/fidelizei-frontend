interface PaginatedResponse {
  page: number;
  totalPages: number;
}

export const getNextPageParam = (lastPage?: PaginatedResponse) => {
  if (!lastPage) {
    return undefined;
  }
  return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
};
