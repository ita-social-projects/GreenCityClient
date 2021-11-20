import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appReferenceDirective]'
})
export class ReferenceDirective {
  constructor(public containerRef: ViewContainerRef) {}
}
