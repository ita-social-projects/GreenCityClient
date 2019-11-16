export class HabitDto {
  id: number;
  name: string;
  creationDate: Date;

  constructor(id: number, name: string, creationDate: Date) {
    this.id = id;
    this.name = name;
    this.creationDate = creationDate;
  }
}
