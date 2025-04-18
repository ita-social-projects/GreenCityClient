export interface TablesResponse {
  tables: Record<string, string[]>;
}

export interface TableDataResponse {
  tableName: string;
  tableData: Record<string, string>[];
}
