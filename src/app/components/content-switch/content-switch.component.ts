import { Component, ElementRef, Input, OnInit, Renderer2, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { ContentSwitchItem } from './content-switch-item.component';
import { IContentSwitchComponent } from './icontent-switch.component';

@Component({
  selector: 'content-switch',
  templateUrl: './content-switch.component.html',
  styleUrls: ['./content-switch.component.scss']
})
export class ContentSwitchComponent implements IContentSwitchComponent, OnInit, AfterViewInit {

  @Input('data') dataSource: ContentSwitchItem[] = [];
  @Output() select: EventEmitter<ContentSwitchItem> = new EventEmitter<ContentSwitchItem>();

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    const allItens = this.elRef.nativeElement.querySelectorAll(`div[data-target]`);
    allItens.forEach(element => this.renderer.setAttribute(element, 'style', 'display: none'));

    const activeItem = this.dataSource.find(a => a.active === true);
    const elToActive = this.elRef.nativeElement.querySelector(`div[data-target="${activeItem.target}"]`);
    this.renderer.setAttribute(elToActive, 'style', 'display: block');
  }

  ngAfterViewInit(): void {
    this.select.emit(this.dataSource.find(a => a.active === true));
  }

  switchItem(e: ContentSwitchItem): void {
    let activeItem = this.elRef.nativeElement.querySelector('ul[data-type="nav"]>li>a.active');
    this.renderer.removeClass(activeItem, 'active');

    activeItem = this.elRef.nativeElement.querySelector(`ul[data-type="nav"]>li[id=${e.clientId}]>a`);
    this.renderer.addClass(activeItem, 'active');

    let elActive = this.elRef.nativeElement.querySelector('div[data-target][style="display: block"]');
    this.renderer.removeAttribute(elActive, 'style');
    this.renderer.setAttribute(elActive, 'style', 'display: none');

    elActive = this.elRef.nativeElement.querySelector(`div[data-target="${e.target}"]`);
    this.renderer.setAttribute(elActive, 'style', 'display: block');

    this.select.emit(e);
  }

}
