import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleAndMetaTagsService {

  constructor(
    private titleService: Title,
    private meta: Meta
  ) {}

  public initTitleAndMeta(meta): void {
    this.titleService.setTitle(meta.title);
    this.meta.updateTag({name: 'keywords', content: meta && meta.keywords || ''});
    this.meta.updateTag({name: 'description', content: meta && meta.description || ''});
  }
}
