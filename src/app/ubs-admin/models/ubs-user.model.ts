export interface Notifications {
  page: NotificationBody[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
}

export interface NotificationBody {
  id: number;
  orderId: number;
  notificationTime: string;
  read: boolean;
  title: string;
  body?: string;
  isOpen?: boolean;
}
