export interface CommentsModel {
    currentPage: number,
    page: Array<object>,
    totalElements: number
}

export interface AuthorDTO {
    id: number,
    name: string,
    userProfilePicturePath: null
}

export interface CommentsDTO {
    author: AuthorDTO,
    id: number,
    modifiedDate: string,
    text: string
}
