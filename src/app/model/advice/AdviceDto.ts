export class AdviceDto {
  id: number;
  advice: string;
  habitDictionaryId: number;
  habitDictionaryName: string;

  constructor(id: number, name: string, habitDictionaryId: number, habitDictionaryName: string) {
    this.id = id;
    this.advice = name;
    this.habitDictionaryId = habitDictionaryId;
    this.habitDictionaryName = habitDictionaryName;
  }
}
