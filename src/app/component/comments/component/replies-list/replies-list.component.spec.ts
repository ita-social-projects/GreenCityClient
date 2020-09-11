import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliesListComponent } from './replies-list.component';

describe('RepliesListComponent', () => {
  let component: RepliesListComponent;
  let fixture: ComponentFixture<RepliesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepliesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
