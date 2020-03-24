export interface EcoNewsModel {
    id: number;
    imagePath: string;
    title: string;
    text: string;
    author: {
        id: number;
        firstName: string;
        lastName: string;
    };
    tags: Array<string>;
    creationDate: string;
}
