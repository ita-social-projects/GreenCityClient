interface PartTemplates {
  every: string;
  value: string;
  list: string;
  range: string;
}

interface Locale {
  parts: {
    specificTime: string;
    and: string;
    minute: PartTemplates;
    hour: PartTemplates;
    dayOfMonth: PartTemplates;
    month: PartTemplates;
    dayOfWeek: PartTemplates;
  };
  months: string[];
  daysOfWeek: string[];
}

declare module '*.json' {
  const value: Locale;
  export default value;
}
