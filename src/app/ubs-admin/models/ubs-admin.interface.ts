export interface Employees {
  currentPage: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  last: boolean;
  number: number;
  page: Page[];
  totalElements: number;
  totalPages: number;
}

export interface Page {
  email: string;
  employeePositions: EmployeePositions[];
  firstName: string;
  id: number;
  image: string;
  lastName: string;
  phoneNumber: string;
  receivingStations: ReceivingStations[];
}

export interface EmployeePositions {
  id: number;
  name: string;
}

export interface ReceivingStations {
  id: number;
  name: string;
}

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
  addressDto: AddressDto;
  recipientEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientSurname: string;
}

export interface AddressDto {
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
}
