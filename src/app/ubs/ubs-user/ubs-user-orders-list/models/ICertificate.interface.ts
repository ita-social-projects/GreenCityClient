export interface ICertificate {
  certificateCode?: string;
  certificateSum: number;
  creationDate?: string;
  certificates: ICertificatePayment[];
  certificateStatusActive: boolean;
  certificateError: boolean;
}

export interface ICertificatePayment {
  certificateCode: string;
  certificateSum: number;
}
