export class HabitFactDto {
  id: number;
  fact: string;
  habitDictionaryId: number;
  habitDictionaryName: string;

  constructor(id: number, name: string, habitDictionaryId: number, habitDictionaryName: string) {
    this.id = id;
    this.fact = name;
    this.habitDictionaryId = habitDictionaryId;
    this.habitDictionaryName = habitDictionaryName;
  }
}
