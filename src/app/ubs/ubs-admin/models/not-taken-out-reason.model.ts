export interface NotTakenOutReasonImage {
  src: string;
  name: string | null;
  file: File;
}

export interface DataToSend {
  description: string;
  images?: string[] | null;
}
