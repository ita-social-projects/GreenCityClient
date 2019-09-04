import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeCafeComponent } from './propose-cafe.component';

describe('ProposeCafeComponent', () => {
  let component: ProposeCafeComponent;
  let fixture: ComponentFixture<ProposeCafeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposeCafeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposeCafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
