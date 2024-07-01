import { FormControl } from '@angular/forms';
import LatLngLiteral = google.maps.LatLngLiteral;

type FormControllers<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export interface Place {
  name: string;
  type: string;
  address: {
    address: string;
    coords: undefined | LatLngLiteral;
  };
}

export type PlaceFormGroup = FormControllers<Place>;
