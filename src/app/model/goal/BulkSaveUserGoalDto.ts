import {UserGoalDto} from './UserGoalDto';
import {UserCustomGoalDto} from './UserCustomGoalDto';

export class BulkSaveUserGoalDto {
  userGoals: UserGoalDto[];
  userCustomGoal: UserCustomGoalDto[];
}
