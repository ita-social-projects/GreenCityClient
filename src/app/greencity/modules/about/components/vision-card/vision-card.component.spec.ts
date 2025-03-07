import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VisionCardComponent } from './vision-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { visionCards } from '../constants/vision-cards.const';

describe('VisionCardComponent', () => {
  let component: VisionCardComponent;
  let fixture: ComponentFixture<VisionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisionCardComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionCardComponent);
    component = fixture.componentInstance;
    component.card = visionCards[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call isEven getter', () => {
    const spy = spyOnProperty(component, 'isEven').and.returnValue(true);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(component.isEven).toBeTruthy();
  });
});
