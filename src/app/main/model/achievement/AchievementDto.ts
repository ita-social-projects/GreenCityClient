export class AchievementDto {
  id: number;
  title: string;
  description: string;
  message: string;

  constructor(id: number, title: string, description: string, message: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.message = message;
  }
}
