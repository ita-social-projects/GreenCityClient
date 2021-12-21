export interface ICertificate {
  certificateCode?: string;
  certificateSum: number;
  certificateDate?: string;
  certificates: string[];
  certificateStatusActive: boolean;
  certificateError: boolean;
}
