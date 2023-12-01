import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoogleBtnComponent } from './google-btn.component';

describe('GoogleBtnComponent', () => {
  let component: GoogleBtnComponent;
  let fixture: ComponentFixture<GoogleBtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleBtnComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
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
