import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { HabitDurationComponent } from './habit-duration.component';
import { By } from '@angular/platform-browser';

fdescribe('HabitDurationComponent', () => {
  let component: HabitDurationComponent;
  let fixture: ComponentFixture<HabitDurationComponent>;
  // const fakeRenderer2 =  jasmine.createSpyObj('fakeFirstDep', ['start']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitDurationComponent],
      imports: [TranslateModule.forRoot()],
      // providers: [{provide: Renderer2, useValue: fakeRenderer2}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitDurationComponent);
    component = fixture.componentInstance;
    // fakeRenderer2.start.and.callFake()
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

  // it(' component should be send event', () => {
  //   const event = spyOn(component.changeDuration, 'emit' );
  //   const input = fixture.debugElement.query(By.css('input'));
  //   event.calls.reset();
  //   input.nativeElement.input();
  //   expect(event).toHaveBeenCalledWith();
  // });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
