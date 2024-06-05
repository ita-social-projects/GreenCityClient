import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SetCountComponent } from './set-count.component';

describe('SetCountComponent', () => {
  let component: SetCountComponent;
  let fixture: ComponentFixture<SetCountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SetCountComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCountComponent);
    component = fixture.componentInstance;
    component.tabName = 'habits';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
