export class HabitDto {
  id: number;
  habitName: string;
  createDate: Date;

  constructor(id: number, name: string, creationDate: Date) {
    this.id = id;
    this.habitName = name;
    this.createDate = creationDate;
  }
}
