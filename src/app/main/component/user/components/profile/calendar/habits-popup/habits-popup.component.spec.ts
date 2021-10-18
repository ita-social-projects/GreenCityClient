import { of } from 'rxjs';
import { HabitPopupInterface } from '../habit-popup-interface';
import { HabitsPopupComponent } from './habits-popup.component';

describe('HabitsPopupComponent', () => {
  const mockPopupHabits: HabitPopupInterface[] = [
    {
      enrolled: false,
      habitDescription: 'Eating local food is good for air quality and reducing environmental emissions!',
      habitId: 503,
      habitName: 'Buy local products'
    },
    {
      enrolled: true,
      habitDescription: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia',
      habitId: 506,
      habitName: 'Use less transport'
    }
  ];
  const dialogRefMock = {
    beforeClosed() {
      return of(true);
    },
    close() {
      return of(true);
    }
  };
});
