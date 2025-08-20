export interface FilterSelect {
  name: string;
  title: string;
  selectAllOption: string;
  isAllSelected: boolean;
  options: FilterOptions[];
}

export interface FilterOptions {
  name?: string;
  nameUk?: string;
  value?: string;
  isActive?: boolean;
}
