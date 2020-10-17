import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ErrorComponent } from './error.component';


describe('error component', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorComponent, TestHostComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  it('should create the app', () => {
    const val = new FormControl();
    val.setErrors({ email: true });
    testHostComponent.setInput(val);
    testHostFixture.detectChanges();
    expect(testHostComponent).toBeTruthy();
  });
});

@Component({
  selector: `app-host-component`,
  template: `<app-error *ngIf="input" [formElement]="input"></app-error>`
})
class TestHostComponent {
  public input;

  setInput(newInput) {
    this.input = newInput;
  }
}
