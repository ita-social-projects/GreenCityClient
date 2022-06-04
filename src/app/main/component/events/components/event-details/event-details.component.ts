import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  public tags: Array<TagObj>;

  constructor(private route: ActivatedRoute, private eventService: EventsService) {}

  ngOnInit(): void {
    this.tags = TagsArray.reduce((ac, cur) => [...ac, { ...cur }], []);
    this.setNewsId();
    this.eventService.getEventById(this.eventId).subscribe((res: EventPageResponceDto) => {
      this.event = res;
      console.log(res);
      this.imagesSlider = [res.titleImage, ...res.additionalImages];
      this.filterTags(res.tags);
    });
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
}
