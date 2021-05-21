import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsSidebarComponent } from './ubs-sidebar.component';

describe('UbsSidebarComponent', () => {
  let component: UbsSidebarComponent;
  let fixture: ComponentFixture<UbsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsSidebarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
