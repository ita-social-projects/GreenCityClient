export interface EcoNewsModel {
  author: {
    id: number;
    name: string;
  };
  content: string;
  countComments: number;
  creationDate: string;
  id: number;
  imagePath: string;
  likes: number;
  shortInfo: string;
  source: string;
  tags: Array<string>;
  title: string;
}
export interface NewsTagInterface {
  id: number;
  name: string;
}
