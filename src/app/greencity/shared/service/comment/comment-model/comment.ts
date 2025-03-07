import { Photo } from 'src/app/shared/models/photo/photo';
import { Estimate } from '@shared/service/comment/comment-model/estimate/estimate';

export class Comment {
  text: string;
  estimate: Estimate;
  photos: Photo[];
}
