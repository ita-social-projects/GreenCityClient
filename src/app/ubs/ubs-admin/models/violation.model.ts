export interface IViolation {
  orderId: number;
  userName: string;
  violationLevel: string;
  description: string;
  images: string[];
  violationDate: Date;
}
