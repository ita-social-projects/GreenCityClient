import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoPlacesComponent } from './eco-places.component';

describe('MyEcoPlacesComponent', () => {
  let component: EcoPlacesComponent;
  let fixture: ComponentFixture<EcoPlacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoPlacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
