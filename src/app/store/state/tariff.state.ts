import { Locations } from 'src/app/ubs/ubs-admin/models/tariffs.interface';

export interface ILocationsState {
  locations: Locations;
  error: string | null;
}

export const initialLocationsState: ILocationsState = {
  locations: null,
  error: null
};
