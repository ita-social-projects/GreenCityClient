export interface TipsSearchModel {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
  };
  creationDate: string;
  tipsAndTricksTags: Array<string>;
}
