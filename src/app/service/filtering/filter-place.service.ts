import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterPlaceService {
  discountMin = 0;
  discountMax = 100;
}
