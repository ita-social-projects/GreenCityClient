export interface NotificationArrayModel {
  currentPage: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  last: boolean;
  number: number;
  page: NotificationModel[];
  totalElements: number;
  totalPages: number;
}

export interface NotificationModel {
  actionUserId: number;
  actionUserText: string;
  bodyText: string;
  message: string;
  notificationId: number;
  notificationType: string;
  projectName: string;
  secondMessage: string;
  secondMessageId: number;
  targetId: number;
  time: any;
  titleText: string;
  viewed: boolean;
}

export enum FilterApproach {
  ALL = 'all',
  ORIGIN = 'origin',
  TYPE = 'type'
}

export enum NotificationType {}
