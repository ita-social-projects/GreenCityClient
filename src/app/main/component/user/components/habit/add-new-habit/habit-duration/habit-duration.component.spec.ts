import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HabitDurationComponent } from './habit-duration.component';

fdescribe('HabitDurationComponent', () => {
  let component: HabitDurationComponent;
  let fixture: ComponentFixture<HabitDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitDurationComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('thumbWidth should be equal to 12px ', () => {
    expect(component.thumbWidth).toEqual('12px');
  });

  it('emit should be called', () => {
    const event = spyOn(component.changeDuration, 'emit');
    component.updateDuration();
    expect(event).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
