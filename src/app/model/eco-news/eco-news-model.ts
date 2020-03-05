import { EcoNews } from './eco-news.enum';

export interface EcoNewsModel {
    id: number;
    imagePath: string;
    title: string;
    text: string;
    name: string;
    tag: EcoNews;
    creationDate: string;
}
