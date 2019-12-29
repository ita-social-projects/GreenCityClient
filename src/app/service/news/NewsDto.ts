export class NewsDto {
  id: number;
  title: string;
  text: string;
  creationDate: string;
  constructor(id: number, title: string, text: string, creationDate: string) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.creationDate = creationDate;
  }
}
