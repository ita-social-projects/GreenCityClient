import {GoalType} from '../../component/user/components/user-goals/add-goal/add-goal-list/GoalType';

export class Goal {
  id: number;
  text: string;
  status: string;
  type: GoalType;
}
