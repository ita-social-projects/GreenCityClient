import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { UbsConfirmPageComponent } from './ubs-confirm-page.component';

describe('UbsConfirmPageComponent', () => {
  let component: UbsConfirmPageComponent;
  let fixture: ComponentFixture<UbsConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsConfirmPageComponent],
      imports: [RouterModule.forRoot([])]
    }).compileComponents();
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
