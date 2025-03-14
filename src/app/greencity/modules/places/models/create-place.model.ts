export interface CreatePlaceModel {
  placeName: string;
  categoryName: string;
  openingHoursList: OpeningHoursDto[];
  locationName: string;
}
export interface OpeningHoursDto {
  openTime: string;
  closeTime: string;
  weekDay: string;
}
