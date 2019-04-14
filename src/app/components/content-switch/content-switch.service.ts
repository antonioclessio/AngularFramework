import { Injectable, Renderer2, Injector, ElementRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ContentSwitchService {

    private renderer: Renderer2;
    private elRef: ElementRef;

    constructor(
        private inject: Injector
    ) {
        this.renderer = this.inject.get(Renderer2);
        this.elRef = this.inject.get(ElementRef);
    }

    selectFirst(): void {
        let activeItem = this.elRef.nativeElement.querySelector('ul[data-type="nav"]>li>a.active');
        if (activeItem) { this.renderer.removeClass(activeItem, 'active'); }

        activeItem = this.elRef.nativeElement.querySelector(`ul[data-type="nav"]>li>a`);
        if (activeItem) { this.renderer.addClass(activeItem, 'active'); }

        let elActive = this.elRef.nativeElement.querySelector('div[data-target][style="display: block"]');
        if (elActive) {
            this.renderer.removeAttribute(elActive, 'style');
            this.renderer.setAttribute(elActive, 'style', 'display: none');
        }

        elActive = this.elRef.nativeElement.querySelector(`div[data-target]`);
        if (elActive) { this.renderer.setAttribute(elActive, 'style', 'display: block'); }
    }

    selectLast(): void {
        let activeItem = this.elRef.nativeElement.querySelector('ul[data-type="nav"]>li>a.active');
        this.renderer.removeClass(activeItem, 'active');

        activeItem = this.elRef.nativeElement.querySelectorAll(`ul[data-type="nav"]>li>a`);
        if (activeItem) {
            this.renderer.addClass(activeItem[activeItem.length], 'active');
        }

        let elActive = this.elRef.nativeElement.querySelector('div[data-target][style="display: block"]');
        if (elActive) {
            this.renderer.removeAttribute(elActive, 'style');
            this.renderer.setAttribute(elActive, 'style', 'display: none');
        }

        elActive = this.elRef.nativeElement.querySelectorAll(`div[data-target]`);
        if (elActive) { this.renderer.setAttribute(elActive[elActive.length], 'style', 'display: block'); }
    }

}
