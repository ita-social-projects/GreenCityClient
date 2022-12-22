import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffSelectorComponent } from './tariff-selector.component';

describe('TariffSelectorComponent', () => {
  let component: TariffSelectorComponent;
  let fixture: ComponentFixture<TariffSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TariffSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
