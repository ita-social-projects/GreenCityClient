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
  ALL = 'All',
  ORIGIN = 'Origin',
  TYPE = 'Type'
}

export interface NotificationFilter {
  name: string;
  nameEn?: string;
  nameUa?: string;
  isSelected: boolean;
  filterArr?: string[];
}
export enum NotificationType {
  COMMENT_LIKE = 'COMMENT_LIKE',
  COMMENT_REPLY = 'COMMENT_REPLY',
  ECONEWS_LIKE = 'ECONEWS_LIKE',
  ECONEWS_CREATED = 'ECONEWS_CREATED',
  ECONEWS_COMMENT = 'ECONEWS_COMMENT',
  EVENT_CREATED = 'EVENT_CREATED',
  EVENT_CANCELED = 'EVENT_CANCELED',
  EVENT_UPDATED = 'EVENT_UPDATED',
  EVENT_JOINED = 'EVENT_JOINED',
  EVENT_COMMENT = ' EVENT_COMMENT',
  FRIEND_REQUEST_RECEIVED = 'FRIEND_REQUEST_RECEIVED',
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED'
}
