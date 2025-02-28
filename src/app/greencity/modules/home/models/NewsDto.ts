export class NewsDto {
  id: number;
  title: string;
  text: string;
  creationDate: string;
  imagePath: string;
  constructor(id: number, title: string, text: string, creationDate: string, imagePath: string) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.creationDate = creationDate;
    this.imagePath = imagePath;
  }
}
