export interface Platform {
  name: string;
  status: string;
  body: {
    en: string;
    ua: string;
  };
}

export interface NotificationTemplate {
  id: number;
  title: {
    en: string;
    ua: string;
  };
  schedule: string | null;
  trigger: string;
  time: string;
  status: string;
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
