import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleBtnComponent } from './google-btn.component';
import { TranslateModule } from '@ngx-translate/core';

describe('GoogleBtnComponent', () => {
  let component: GoogleBtnComponent;
  let fixture: ComponentFixture<GoogleBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleBtnComponent ],
      imports: [TranslateModule.forRoot(), ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
