export interface EcoNewsModel {
    id: number;
    imagePath: string;
    title: string;
    text: string;
    author: {
        id: number;
        name: string;
    };
    tags: Array<string>;
    creationDate: string;
}
