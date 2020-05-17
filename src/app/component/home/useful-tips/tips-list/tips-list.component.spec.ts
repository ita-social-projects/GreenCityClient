import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsListComponent } from './tips-list.component';

describe('TipsListComponent', () => {
  let component: TipsListComponent;
  let fixture: ComponentFixture<TipsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
