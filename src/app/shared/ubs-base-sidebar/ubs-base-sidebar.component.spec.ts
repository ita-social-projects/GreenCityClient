import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsBaseSidebarComponent } from './ubs-base-sidebar.component';

describe('UbsBaseSidebarComponent', () => {
  let component: UbsBaseSidebarComponent;
  let fixture: ComponentFixture<UbsBaseSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsBaseSidebarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsBaseSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
