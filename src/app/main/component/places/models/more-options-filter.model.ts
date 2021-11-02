export interface DistanceFilter {
  isActive: boolean;
  value: number;
}

export interface MoreOptionsFormValue {
  baseFilters: {
    [key: string]: boolean;
  };
  servicesFilters: {
    [key: string]: boolean;
  };
  distance: DistanceFilter;
}
