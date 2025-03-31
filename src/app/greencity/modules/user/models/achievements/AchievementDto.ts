export class AchievementDto {
  id: number;
  nameUk: string;
  nameEn: string;
  title: string;
  achievementCategory: {
    id: number;
    name: string;
  };
  condition: number;
  progress: number;
}
