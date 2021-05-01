import { Photo } from '../photo/photo';
import { Estimate } from '../estimate/estimate';

export class Comment {
  text: string;
  estimate: Estimate;
  photos: Photo[];
}
