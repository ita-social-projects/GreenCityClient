export interface SearchModel {
  author: {
    id: number;
    name: string;
  };
  creationDate: string;
  id: number;
  tags: Array<string>;
  title: string;
}
