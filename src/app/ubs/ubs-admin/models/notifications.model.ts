export interface Platform {
  name: string;
  nameEng: string;
  status: string;
  body: string;
  bodyEng: string;
  receiverType: string;
}

export interface NotificationTemplateMainInfoDto {
  type: string;
  title: string;
  titleEng: string;
  schedule: string | null;
  trigger: string;
  triggerDescription: string;
  triggerDescriptionEng: string;
  time: string;
  timeDescription: string;
  timeDescriptionEng: string;
  notificationStatus: string;
}

export interface NotificationTemplate {
  notificationTemplateMainInfoDto: NotificationTemplateMainInfoDto;
  platforms: Platform[];
}

export interface NotificationTemplatesPage {
  currentPage: number;
  page: NotificationPage[];
  totalElements: number;
  totalPages: number;
}

export interface NotificationPage {
  id: number;
  notificationTemplateMainInfoDto: NotificationTemplateMainInfoDto;
}
