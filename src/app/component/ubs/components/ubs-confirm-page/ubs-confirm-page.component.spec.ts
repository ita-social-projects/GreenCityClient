import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsConfirmPageComponent } from './ubs-confirm-page.component';

describe('UbsConfirmPageComponent', () => {
  let component: UbsConfirmPageComponent;
  let fixture: ComponentFixture<UbsConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbsConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
