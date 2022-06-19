import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take } from 'rxjs/operators';
import { DialogPopUpComponent } from 'src/app/ubs/ubs-admin/components/shared/components/dialog-pop-up/dialog-pop-up.component';
import { singleNewsImages } from '../../../../image-pathes/single-news-images';
import { TagsArray } from '../../models/event-consts';
import { EventPageResponceDto, TagDto, TagObj } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  private eventId: number;
  public images = singleNewsImages;
  public event: EventPageResponceDto;

  public imagesSlider: Array<string> = [];
  public sliderIndex = 0;
  public isPosting: boolean;
  public userId: number;
  deleteDialogData = {
    popupTitle: 'Delete event',
    popupConfirm: 'yes',
    popupCancel: 'no'
  };

  public tags: Array<TagObj>;

  public address = 'Should be adress';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    public router: Router,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.localStorageService.setEditMode('canUserEdit', true);
    this.getUserId();
    this.tags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.setNewsId();
    this.eventService.getEventById(this.eventId).subscribe((res: EventPageResponceDto) => {
      this.event = res;
      this.localStorageService.setEventForEdit('editEvent', this.event);
      this.imagesSlider = [res.titleImage, ...res.additionalImages];
      this.filterTags(res.tags);
    });
  }

  public routeToEditEvent(): void {
    this.router.navigate(['/events', 'create-event']);
  }

  public getUserId(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => (this.userId = id));
  }

  public checkUserId(): boolean {
    return this.userId === this.event.organizer.id;
  }

  private filterTags(tags: Array<TagDto>): void {
    this.tags.forEach((item) => (item.isActive = tags.some((name) => name.nameEn === item.nameEn)));
  }

  private setNewsId(): void {
    this.eventId = this.route.snapshot.params.id;
  }

  public selectImage(ind: number): void {
    this.sliderIndex = ind;
  }

  public moveRight(): void {
    this.sliderIndex = this.sliderIndex === this.imagesSlider.length - 1 ? 0 : ++this.sliderIndex;
  }

  public moveLeft() {
    this.sliderIndex = this.sliderIndex === 0 ? this.imagesSlider.length - 1 : --this.sliderIndex;
  }

  public deleteEvent(): void {
    const matDialogRef = this.dialog.open(DialogPopUpComponent, {
      data: this.deleteDialogData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: '',
      width: '300px'
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.isPosting = true;
          this.eventService.deleteEvent(this.eventId).subscribe(() => {
            this.isPosting = false;
            this.router.navigate(['/events']);
          });
        }
      });
  }
}
