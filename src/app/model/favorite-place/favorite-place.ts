export class FavoritePlace {
  constructor(placeId: number, name: string) {
    this.placeId = Number(placeId);
    this.name = name;
  }
  placeId: number;
  name: string;
}
