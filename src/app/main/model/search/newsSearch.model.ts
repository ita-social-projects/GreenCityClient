export interface NewsSearchModel {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
  };
  creationDate: string;
  tags: Array<string>;
}
