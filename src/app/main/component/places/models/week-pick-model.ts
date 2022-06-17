export interface WeekPickModel {
  dayToDisplay: string;
  timeFrom: string;
  timeTo: string;
  isSelected: boolean;
  fromSelected: string[];
  toSelected: string[];
  dayToSend: string;
}

export interface WorkingTime {
  dayOfWeek: string;
  timeFrom?: string;
  timeTo?: string;
  isSelected: boolean;
}
