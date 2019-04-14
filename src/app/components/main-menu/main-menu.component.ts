import { Component, Input, Output, Renderer2, ElementRef, EventEmitter, OnChanges } from '@angular/core';
import { MainMenuItem } from './main-menu.item';
import { IMainMenuComponent } from './imain-menu.interface';

@Component({
    selector: 'main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements IMainMenuComponent, OnChanges {

    @Input('data') dataSource: MainMenuItem[] = [];
    @Output() menuSelected: EventEmitter<any> = new EventEmitter<any>();

    constructor (
        private elementRef: ElementRef,
        private render: Renderer2
    ) {}

    ngOnChanges(): void {
    }

    toggleMenu(): void {
        const target = this.elementRef.nativeElement.querySelector('.menu > ul');
        if (target.classList.contains('open')) {
            this.render.removeClass(target, 'open');
        } else {
            this.render.addClass(target, 'open');
        }
    }

    toggleItens(): void {}

    menuItem_Clicked(e: MainMenuItem): void {
        if (!e.Aplicacao) { return; }
        this.menuSelected.emit(e);
    }
}
