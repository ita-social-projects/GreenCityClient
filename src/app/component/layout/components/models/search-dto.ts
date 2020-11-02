import { SearchModel } from '@global-models/search/search.model';

export interface SearchDto {
    page: Array<SearchItem>;
    totalElements: number;
    currentPage: number;
    totalPages: number;
}

interface SearchItem {
    author: object;
    creationDate: string;
    id: number;
    tags: Array<string>;
    title: string;
}
