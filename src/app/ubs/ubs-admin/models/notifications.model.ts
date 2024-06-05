export interface Platform {
  name: string;
  nameEng: string;
  status: string;
  body: string;
  bodyEng: string;
  receiverType: string;
}

export interface NotificationTemplateUpdateInfoDto {
  title: string;
  titleEng: string;
  trigger: string;
  type: string;
  time: string;
  schedule: string | null;
}

export interface NotificationTemplateMainInfoDto extends NotificationTemplateUpdateInfoDto {
  triggerDescription: string;
  triggerDescriptionEng: string;
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

export interface NotificationTemplateUpdate {
  notificationTemplateUpdateInfo: NotificationTemplateUpdateInfoDto;
  platforms: Platform[];
}
