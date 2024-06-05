import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchNotFoundComponent } from './search-not-found.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SearchNotFoundComponent', () => {
  let component: SearchNotFoundComponent;
  let fixture: ComponentFixture<SearchNotFoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchNotFoundComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event', () => {
    spyOn(component.closeUnsuccessfulSearchResults, 'emit');
    // trigger the click
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('.search_not-found-item-wrp a');
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.closeUnsuccessfulSearchResults.emit).toHaveBeenCalled();
  });
});
