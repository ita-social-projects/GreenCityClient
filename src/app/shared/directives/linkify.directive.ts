import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Patterns } from 'src/assets/patterns/patterns';

@Directive({
  selector: '[appLinkify]'
})
export class LinkifyDirective implements OnChanges {
  @Input() appLinkify = '';

  constructor(private el: ElementRef, private sanitizer: DomSanitizer, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appLinkify) {
      this.updateLinkify();
    }
  }

  updateLinkify(): void {
    if (this.appLinkify) {
      const linkifiedText = this.linkify(this.appLinkify);
      const safeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(linkifiedText);
      this.setHtmlContent(safeHtml);
    }
  }

  linkify(text: string): string {
    text = text.replace(Patterns.emailLinkifyPattern, (match) => `<a href="mailto:${match}">${match}</a>`);
    text = text.replace(Patterns.urlLinkifyPattern, (match) => `<a href="${match}" target="_blank">${match}</a>`);
    text = text.replace(Patterns.phoneLinkifyPattern, (match) => `<a href="tel:${match}">${match}</a>`);
    return text;
  }

  setHtmlContent(html: SafeHtml): void {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.sanitizer.sanitize(1, html));
  }
}
