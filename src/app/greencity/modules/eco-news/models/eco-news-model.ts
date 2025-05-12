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
  tagsEn: Array<string>;
  tagsUk: Array<string>;
  title: string;
  countOfEcoNews?: number;
  favorite?: boolean;
}
