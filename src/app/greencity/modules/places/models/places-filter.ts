import { MapBoundsDto } from './map-bounds-dto';
import { MoreOptionsFormValue } from './more-options-filter.model';

export interface PlacesFilter {
  searchName: string;
  moreOptionsFilters: MoreOptionsFormValue;
  basicFilters: string[];
  mapBoundsDto: MapBoundsDto;
  position: any;
}
