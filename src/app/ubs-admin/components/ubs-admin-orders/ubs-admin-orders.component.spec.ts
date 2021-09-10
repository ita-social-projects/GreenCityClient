import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminOrdersComponent } from './ubs-admin-orders.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

describe('UbsAdminOrdersComponent', () => {
  let component: UbsAdminOrdersComponent;
  let fixture: ComponentFixture<UbsAdminOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrdersComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
