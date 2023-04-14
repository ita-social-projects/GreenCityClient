export interface HabitPopupInterface {
  enrolled: boolean;
  habitDescription: string;
  habitAssignId: number;
  habitName: string;
}

export interface HabitsForDateInterface {
  enrollDate: string;
  habitAssigns: Array<HabitPopupInterface>;
}
