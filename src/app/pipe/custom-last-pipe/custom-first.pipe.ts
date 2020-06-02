import {Pipe, PipeTransform} from '@angular/core';
import {Goal} from '../../model/goal/Goal';
import {GoalType} from '../../component/user/components/user-goals/add-goal/add-goal-list/GoalType';

@Pipe({
  name: 'customLast'
})
export class CustomLastPipe implements PipeTransform {

  transform(goals: Goal[]): any {
    goals.sort((a, b) => {
      const first = a.type === GoalType.TRACKED ? 2 : (a.type === GoalType.PREDEFINED ? 1 : 0);
      const second = b.type === GoalType.TRACKED ? 2 : (b.type === GoalType.PREDEFINED ? 1 : 0);

      return second - first;
    });

    return goals;
  }

}
