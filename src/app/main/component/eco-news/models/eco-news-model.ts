export interface EcoNewsModel {
  countComments: number;
  id: number;
  imagePath: string;
  title: string;
  text: string;
  author: {
    id: number;
    name: string;
  };
  tags: Array<NewsTagInterface>;
  creationDate: string;
  likes: number;
  source?: string;
}
// export interface NewsResponseDTO {
//   id: number;
//   title: string;
//   text: string;
//   ecoNewsAuthorDto: { id: number; firstName: string; lastName: string };
//   creationDate: string;
//   imagePath: string;
//   tags: Array<string>;
// }

export interface NewsTagInterface {
  id: number;
  name: string;
}
