export interface Group {
  id: string;
  nameEn: string;
  nameUk: string;
  authorities: Permission[];
}

export interface Permission {
  name: string;
  descriptionEn: string;
  descriptionUk: string;
}
