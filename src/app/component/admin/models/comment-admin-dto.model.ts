import { AdminPlace } from './admin-place.model';
import { PhotoAdminModel } from './photo-admin.model';

export class CommentAdminDto {
  id: number;
  text: string;
  place: AdminPlace;
  photos: PhotoAdminModel;
}
