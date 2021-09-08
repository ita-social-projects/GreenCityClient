import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsMainPageComponent } from './ubs-main-page.component';

describe('UbsMainPageComponent', () => {
  let component: UbsMainPageComponent;
  let fixture: ComponentFixture<UbsMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [UbsMainPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
