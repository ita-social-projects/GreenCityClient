export interface Platform {
  name: string;
  status: string;
  body: {
    en: string;
    ua: string;
  };
}

export interface NotificationTemplate {
  type: string;
  title: string;
  titleEng: string;
  schedule: string | null;
  trigger: string;
  triggerDescription?: string;
  triggerDescriptionEng?: string;
  time: string;
  timeDescription: string;
  timeDescriptionEng: string;
  notificationStatus: string;
  platforms: Platform[];
}

export interface NotificationTemplatesPage {
  currentPage: number;
  page: NotificationTemplate[];
  totalElements: number;
  totalPages: number;
}

export interface NotificationFilterParams {
  title?: string;
  triggers?: string[];
  status?: string;
}
