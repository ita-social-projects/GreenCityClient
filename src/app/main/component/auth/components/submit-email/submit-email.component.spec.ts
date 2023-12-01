import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { SubmitEmailComponent } from './submit-email.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('SubmitEmailComponent', () => {
  let component: SubmitEmailComponent;
  let fixture: ComponentFixture<SubmitEmailComponent>;
  class MatDialogRefMock {
    close() {}
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitEmailComponent],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [{ provide: MatDialogRef, useClass: MatDialogRefMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
