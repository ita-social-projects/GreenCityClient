export interface NewsModel {
  imagePath: string;
  title: string;
  author: {
    id: number;
    name: string;
  };
  tags: Array<NewsTagInterface>;
  creationDate: string;
}

export interface NewsTagInterface {
  id: number;
  name: string;
}
