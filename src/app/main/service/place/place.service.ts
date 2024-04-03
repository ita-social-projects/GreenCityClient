import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { FilterPlaceCategories, Place } from '../../component/places/models/place';
import { PlaceInfo } from '../../model/place/place-info';
import { UpdatePlaceStatus } from '../../model/place/update-place-status.model';
import { mainLink, placeLink } from '../../links';
import { PlaceAddDto } from '../../model/placeAddDto.model';
import { FilterPlaceService } from '../filtering/filter-place.service';
import { BulkUpdatePlaceStatus } from '../../model/place/bulk-update-place-status.model';
import { TagInterface } from '../../component/shared/components/tag-filter/tag-filter.model';
import { environment } from '@environment/environment';
import { CreatePlaceModel } from '../../component/places/models/create-place.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  public places$: Subject<Place[]> = new Subject<Place[]>();
  places: Place[];
  showHours = false;
  private baseUrl = `${mainLink}place/`;
  private placeStatus: UpdatePlaceStatus;
  private bulkUpdateStatus: BulkUpdatePlaceStatus;
  private ids: any;
  private backEnd = environment.backendLink;
  private tagsType = 'PLACES_FILTER';

  constructor(
    private http: HttpClient,
    private filterService: FilterPlaceService
  ) {}

  public getAllPlaces(page: number, size: number) {
    return this.http.get(`${this.baseUrl}all?page=${page}&size=${size}`);
  }

  getFilteredPlaces() {
    const filterDto = this.filterService.getFilters();
    this.http.post<Place[]>(`${placeLink}filter`, filterDto).subscribe((res) => (this.places = res));
  }

  updatePlaces(filtersDto: any) {
    this.http.post<Place[]>(`${placeLink}filter`, filtersDto).subscribe((response: Place[]) => {
      this.places$.next(response);
    });
  }

  save(place: PlaceAddDto) {
    this.http.post(`${placeLink}propose`, place);
  }

  getPlaceInfo(id: number): Observable<PlaceInfo> {
    return this.http.get<PlaceInfo>(`${placeLink}info/${id}`);
  }

  getFavoritePlaceInfo(id: number): Observable<PlaceInfo> {
    return this.http.get<PlaceInfo>(`${placeLink}info/favorite/${id}`);
  }

  updatePlaceStatus(id: number, status: string): Observable<UpdatePlaceStatus> {
    this.placeStatus = new UpdatePlaceStatus();
    this.placeStatus.id = id;
    this.placeStatus.status = status;

    return this.http.patch<UpdatePlaceStatus>(`${placeLink}status`, this.placeStatus);
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${placeLink}` + id);
  }

  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${placeLink}statuses`);
  }

  public getAllPresentTags(): Observable<Array<TagInterface>> {
    return this.http.get<Array<TagInterface>>(`${this.backEnd}tags/v2/search?type=${this.tagsType}`);
  }

  public getAllFilterPlaceCategories(): Observable<FilterPlaceCategories[]> {
    return this.http.get<FilterPlaceCategories[]>(`${this.backEnd}place/v2/filteredPlacesCategories`);
  }

  createPlace(createPlace: CreatePlaceModel) {
    return this.http.post(`${this.backEnd}place/v2/save`, createPlace);
  }
}
