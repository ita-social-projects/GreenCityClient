import { ICustomersTable } from '@ubs/ubs-admin/models/customers-table.model';

export interface IUbsAdminState {
  table: ICustomersTable;
}

export const initialUbsAdminState: IUbsAdminState = {
  table: null
};
