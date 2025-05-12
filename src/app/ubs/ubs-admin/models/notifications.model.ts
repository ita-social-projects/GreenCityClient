export interface Platform {
  name: string;
  nameEn: string;
  status: string;
  bodyUk: string;
  bodyEn: string;
  receiverType: string;
}

export interface NotificationTemplateUpdateInfoDto {
  titleUk: string;
  titleEn: string;
  trigger: string;
  type: string;
  time: string;
  schedule: string | null;
}

export interface NotificationTemplateMainInfoDto extends NotificationTemplateUpdateInfoDto {
  triggerDescriptionUk: string;
  triggerDescriptionEn: string;
  timeDescriptionUk: string;
  timeDescriptionEn: string;
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
