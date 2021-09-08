import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { UbsUserComponent } from './ubs-user.component';

describe('UbsUserComponent', () => {
  let component: UbsUserComponent;
  let fixture: ComponentFixture<UbsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
