import { IBigOrderTable, IBigOrderTableParams, IFilters, IOrdersViewParameters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

export interface IBigOrderTableState {
  bigOrderTable: IBigOrderTable;
  bigOrderTableParams: IBigOrderTableParams;
  ordersViewParameters: IOrdersViewParameters;
  filters: IFilters | null;
  appliedFilters: Array<string>;
  error: string | null;
}

export const initialBigOrderTableState: IBigOrderTableState = {
  bigOrderTable: null,
  bigOrderTableParams: null,
  ordersViewParameters: null,
  error: null,
  filters: null,
  appliedFilters: []
};
