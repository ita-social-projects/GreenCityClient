export class AdviceDto {
  id: number;
  content: string;
  habitDictionaryId: number;
  habitDictionaryName: string;

  constructor(id: number, name: string, habitDictionaryId: number, habitDictionaryName: string) {
    this.id = id;
    this.content = name;
    this.habitDictionaryId = habitDictionaryId;
    this.habitDictionaryName = habitDictionaryName;
  }
}
