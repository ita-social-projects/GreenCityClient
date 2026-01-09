export interface FilterCustomers {
  key: string;
  labelKey: string;
  fromValue?: string | null;
  toValue?: string | null;
  fromControl: string;
  toControl: string;
  isDate?: boolean;
}