import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationModel } from '@global-user/models/notification.model';

@Directive({
  selector: '[appNotificContentReplace]'
})
export class NotificContentReplaceDirective implements OnChanges {
  @Input() replacements: NotificationModel;
  replacementKeys = [
    { contentKey: 'user', replacementKey: 'actionUserText', idToNavigate: 'actionUserId' },
    { contentKey: 'message', replacementKey: 'message' },
    { contentKey: 'secondMessage', replacementKey: 'secondMessage' }
  ];
  constructor(
    private el: ElementRef,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  ngOnChanges() {
    if (this.replacements) {
      const replacedContent = this.replaceContent(this.replacements.bodyText, this.replacements);
      const safeHtml: SafeHtml = this.domSanitizer.bypassSecurityTrustHtml(replacedContent);
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.domSanitizer.sanitize(1, safeHtml));
    }
  }

  private replaceContent(content: string, replacements): string {
    let result = content;
    this.replacementKeys.forEach((el) => {
      if (replacements.hasOwnProperty(el.replacementKey)) {
        result = el.idToNavigate
          ? result.replace(`{${el.contentKey}}`, `<a data-userid="${replacements[el.idToNavigate]}">${replacements[el.replacementKey]}</a>`)
          : result.replace(`{${el.contentKey}}`, replacements[el.replacementKey]);
      }
    });
    return result;
  }
}
