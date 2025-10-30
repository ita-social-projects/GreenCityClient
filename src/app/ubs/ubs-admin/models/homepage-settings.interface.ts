export type THomepageContent = {
  uk: {
    how_works: {
      working_hours_caption: string;
      route_caption: string;
      working_hours: string;
      route: string;
    };
    header: {
      caption: string;
      content: string;
    };
    preparing: {
      caption: string;
      step_01: string;
    };
    rules: {
      caption: string;
      content: string;
    };
    bonuses: {
      caption: string;
      content: string;
    };
    price: {
      caption_steps: string;
    };
  };
  en: {
    how_works: {
      working_hours_caption: string;
      route_caption: string;
      working_hours: string;
      route: string;
    };
    header: {
      caption: string;
      content: string;
    };
    preparing: {
      caption: string;
      step_01: string;
    };
    rules: {
      caption: string;
      content: string;
    };
    bonuses: {
      caption: string;
      content: string;
    };
    price: {
      caption_steps: string;
    };
  };
  section: ['HOW_WORKS'];
};

type THomepageMeta = {
  id: number;
  createdAt: string;
  authorEmail: string;
};

export type THomepageContentChange = {
  section: string;
  field: string;
  valueUk: string;
  valueEn: string;
};

export type THomepageSettings = THomepageContent & THomepageMeta;
