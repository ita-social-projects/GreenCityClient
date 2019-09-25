import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreComponent } from './restore.component';

describe('RestoreComponent', () => {
  let component: RestoreComponent;
  let fixture: ComponentFixture<RestoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
