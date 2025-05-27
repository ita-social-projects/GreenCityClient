export interface TablesResponse {
  tables: Record<string, string[]>;
}

export interface TableDataResponse {
  tableName: string;
  currentPage: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  last: boolean;
  number: number;
  page: Record<string, string>[];
  totalElements: number;
  totalPages: number;
}
