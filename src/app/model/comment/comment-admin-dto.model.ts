import {AdminPlace} from '../place/admin-place.model';
import {PhotoAdminModel} from '../photo-admin.model';

export class CommentAdminDto {
  id: number;
  text: string;
  place: AdminPlace;
  photos: PhotoAdminModel;
}
