export const LANGUAGES = {
  UK: 'uk',
  EN: 'en'
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export type TTelegramBotMessage = {
  id: number;
  lang: Language;
  text: string;
  messageType: string;
};

export type TPaginatedMessages = {
  currentPage: number;
  page: TTelegramBotMessage[];
  totalElements: number;
  totalPages: number;
};

type TBotMessageData = {
  text: string;
  id: number;
};

type TBotSection = {
  [fieldKey: string]: TBotMessageData;
};

export type TTransformedBotData = {
  en: { [sectionKey: string]: TBotSection };
  uk: { [sectionKey: string]: TBotSection };
};
