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
