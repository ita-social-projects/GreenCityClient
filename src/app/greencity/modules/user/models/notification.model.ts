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
  actionUserId: number[];
  actionUserText: string[];
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
  status?: NotificationStatus;
}

export enum FilterCriteria {
  ALL = 'All',
  ORIGIN = 'Origin',
  TYPE = 'Type'
}

export interface NotificationFilter {
  name: string;
  nameEn?: string;
  nameUk?: string;
  isSelected: boolean;
  filterArr?: string[];
}

export enum NotificationCriteria {
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
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',
  HABIT_INVITATION = 'HABIT_INVITE'
}

export const filterCriteriaOptions = [
  { name: FilterCriteria.ALL, isSelected: true, nameUk: 'Усі', nameEn: 'All' },
  { name: FilterCriteria.TYPE, isSelected: false, nameUk: 'Типом', nameEn: 'Type' },
  { name: FilterCriteria.ORIGIN, isSelected: false, nameUk: 'Джерелом', nameEn: 'Origin' }
];

export const notificationCriteriaOptions: NotificationFilter[] = [
  {
    name: 'All',
    nameEn: 'All',
    nameUk: 'Усі',
    isSelected: true
  },
  {
    name: NotificationCriteria.COMMENT_LIKE,
    nameEn: 'Comment like',
    nameUk: 'Вподобання коментаря',
    filterArr: ['ECONEWS_COMMENT_LIKE', 'EVENT_COMMENT_LIKE'],
    isSelected: true
  },
  {
    name: NotificationCriteria.COMMENT_REPLY,
    nameEn: 'Comment reply',
    nameUk: 'Відповідь на коментар',
    filterArr: ['ECONEWS_COMMENT_REPLY', 'EVENT_COMMENT_REPLY'],
    isSelected: true
  },
  { name: NotificationCriteria.ECONEWS_LIKE, nameEn: ' News Like', nameUk: 'Вподобання новини', isSelected: true },
  { name: NotificationCriteria.ECONEWS_CREATED, nameEn: ' News Created', nameUk: 'Створення новини', isSelected: true },
  { name: NotificationCriteria.ECONEWS_COMMENT, nameEn: ' News Commented', nameUk: 'Коментарі новин', isSelected: true },
  { name: NotificationCriteria.EVENT_CREATED, nameEn: 'Event created', nameUk: 'Створення події', isSelected: true },
  { name: NotificationCriteria.EVENT_CANCELED, nameEn: 'Event canceled', nameUk: 'Скасування події', isSelected: true },
  { name: NotificationCriteria.EVENT_UPDATED, nameEn: 'Event updated', nameUk: 'Зміни у подіях', isSelected: true },
  { name: NotificationCriteria.EVENT_JOINED, nameEn: 'Event joined', nameUk: 'приєднання до події', isSelected: true },
  { name: NotificationCriteria.EVENT_COMMENT, nameEn: 'Event commented', nameUk: 'Коментарі подій', isSelected: true },
  {
    name: NotificationCriteria.FRIEND_REQUEST_RECEIVED,
    nameEn: 'Friend request received',
    nameUk: 'Нові запити дружити',
    isSelected: true
  },
  {
    name: NotificationCriteria.FRIEND_REQUEST_ACCEPTED,
    nameEn: 'Friend request accepted',
    nameUk: 'Підтверджені запити дружити',
    isSelected: true
  }
];
export const projects: NotificationFilter[] = [
  { name: 'All', nameEn: 'All', nameUk: 'Усі', isSelected: true },
  { name: 'GREENCITY', nameEn: 'GreenCity', isSelected: false },
  { name: 'PICKUP', nameEn: 'Pick up', isSelected: false }
];

export enum NotificationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED'
}
