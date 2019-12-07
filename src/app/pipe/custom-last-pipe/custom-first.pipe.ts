import {Pipe, PipeTransform} from '@angular/core';
import {Goal} from '../../model/goal/Goal';
import {GoalType} from '../../component/user/user-goals/add-goal/add-goal-list/GoalType';

@Pipe({
  name: 'customLast'
})
export class CustomLastPipe implements PipeTransform {

  transform(goals: Goal[]): any {
    goals.sort((a, b) => a.type === GoalType.CUSTOM ? 1 : -1);

    return goals;
  }

}
