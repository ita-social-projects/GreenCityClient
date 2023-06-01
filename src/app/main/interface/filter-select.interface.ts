export interface FilterSelect {
  filter: string;
  title: string;
  selectAllOption: string;
  options: FilterOptions[];
}

export interface FilterOptions {
  name?: string;
  nameUa?: string;
  value?: string;
  isActive?: boolean;
}
