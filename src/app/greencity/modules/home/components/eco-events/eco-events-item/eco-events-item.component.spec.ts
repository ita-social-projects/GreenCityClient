import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { EcoEventsItemComponent } from './eco-events-item.component';
import { EcoEventsComponent } from '../eco-events.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('EcoEventsItemComponent', () => {
  let component: EcoEventsItemComponent;
  let fixture: ComponentFixture<EcoEventsItemComponent>;

  @Pipe({ name: 'translateDate' })
  class MockPipe implements PipeTransform {
    transform(value: string): string {
      return value;
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EcoEventsItemComponent, EcoEventsComponent, MockPipe],
      imports: [RouterTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoEventsItemComponent);
    component = fixture.componentInstance;
    component.ecoEvent = {
      id: 0,
      title: '',
      text: '',
      creationDate: '2022-09-29T13:42:27.399Z',
      imagePath: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
