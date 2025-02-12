export class FavoritePlace {
  location?: any;
  constructor(placeId: number, name: string) {
    this.placeId = placeId;
    this.name = name;
  }
  placeId: number;
  name: string;
}
