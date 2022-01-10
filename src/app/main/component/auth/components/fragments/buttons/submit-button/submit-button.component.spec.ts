import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitButtonComponent } from './submit-button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SubmitButtonComponent', async () => {
  const component: SubmitButtonComponent = TestBed.inject(SubmitButtonComponent);
  let fixture: ComponentFixture<SubmitButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitButtonComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitButtonComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
