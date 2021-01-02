import { HabitInterface } from './habit.interface';

export interface HabitAssignInterface {
  id: number;
  status: 'SUSPENDED' | 'INPROGRESS' | 'ACQUIRED';
  createDateTime: Date;
  habit: HabitInterface;
  userId: number;
  duration: number;
  workingDays: number;
  habitStreak: number;
  lastEnrollmentDate: Date;
  habitStatusCalendarDtoList: Array<HabitStatusCalendarListInterface>;
}

export interface HabitStatusCalendarListInterface {
  enrollDate: string;
  id: number;
}

export interface ResponseInterface {
  id: number;
  status: 'SUSPENDED' | 'INPROGRESS' | 'ACQUIRED';
  createDateTime: Date;
  habit: number;
  userId: number;
  duration: number;
  workingDays: number;
  habitStreak: number;
  lastEnrollmentDate: Date;
}
