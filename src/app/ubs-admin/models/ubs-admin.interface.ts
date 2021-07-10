export interface Bags {
  bags: Bag[];
  points: number;
}
export interface Bag {
  id: number;
  name: string;
  capacity: number;
  price: number;
  code: string;
}

export interface IUserInfo {
  customerName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientEmail: string;
  totalUserViolations: number;
  userViolationForCurrentOrder: number;
}

export interface UserProfile {
  addressDto: {
    actual: boolean;
    city: string;
    coordinates: {
      latitude?: number;
      longitude?: number;
    };
    district: string;
    entranceNumber: string;
    houseCorpus: string;
    houseNumber: string;
    id: number;
    street: string;
  };
  recipientEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientSurname: string;
}
