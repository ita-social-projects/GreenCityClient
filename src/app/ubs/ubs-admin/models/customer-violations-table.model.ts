export interface ICustomerViolationTable {
  fullName: string;
  userViolationsDto: {
    currentPage: number;
    page: any[];
    totalElements: number;
    totalPages: number;
  };
}
