export class AchievementDto {
  id: number;
  name: string;
  nameEng: string;
  title: string;
  achievementCategory: {
    id: number;
    name: string;
  };
  condition: number;
  progress: number;
}
