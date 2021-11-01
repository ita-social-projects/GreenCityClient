export interface Notifications {
  page: NotificationBody[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
}

export interface NotificationBody {
  id: number;
  notificationTime: string;
  orderId: number;
  read: boolean;
  title: string;
  body: string;
  isOpen: boolean;
}
