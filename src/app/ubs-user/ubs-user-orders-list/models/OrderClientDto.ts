export class OrderClientDto {
  certificates?: string[];
  orderId: number;
  pointsToUse: number;
  constructor() {
    this.pointsToUse = 0;
  }
}
