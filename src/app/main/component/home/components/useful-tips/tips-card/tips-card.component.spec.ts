import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsCardComponent } from './tips-card.component';

describe('TipsCardComponent', () => {
  let component: TipsCardComponent;
  let fixture: ComponentFixture<TipsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipsCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsCardComponent);
    component = fixture.componentInstance;
    component.tip = {
      imageUrl: 'test',
      text: 'test',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
