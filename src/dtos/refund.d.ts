export type RefundAPIResponse = {
  id: string;
  userId: string;
  name: string;
  category: CategoriesAPIEnum;
  amount: number;
  filename: string;
  user: {
    name: string;
  };
};

export type RefundsPaginationAPIResponse = {
  refunds: RefundAPIResponse[];
  pagination: {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
  };
};
