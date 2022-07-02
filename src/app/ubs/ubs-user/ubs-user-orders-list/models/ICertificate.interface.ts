export interface ICertificate {
  certificateCode?: string;
  certificateSum: number;
  creationDate?: string[];
  dateOfUse?: string[];
  expirationDate?: string[];
  certificates: ICertificatePayment[];
  certificateStatusActive: boolean;
  certificateError: boolean;
}

export interface ICertificatePayment {
  certificateCode: string;
  certificateSum: number;
  certificateStatus?: string;
}

export interface ICertificateResponse {
  points: number;
  certificateStatus: string;
  creationDate?: string;
  dateOfUse?: string;
  expirationDate?: string;
  code?: string;
}
