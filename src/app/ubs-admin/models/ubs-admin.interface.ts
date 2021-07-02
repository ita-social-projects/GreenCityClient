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
