import { IBigOrderTable, IBigOrderTableParams, IOrdersViewParameters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

export interface IBigOrderTableState {
  bigOrderTable: IBigOrderTable;
  bigOrderTableParams: IBigOrderTableParams;
  ordersViewParameters: IOrdersViewParameters;
  error: string | null;
}

export const initialBigOrderTableState: IBigOrderTableState = {
  bigOrderTable: null,
  bigOrderTableParams: null,
  ordersViewParameters: null,
  error: null
};
