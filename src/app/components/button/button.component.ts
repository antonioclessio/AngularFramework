import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

import { ButtonSize } from './button-size.enum';
import { ButtonItem } from './button.item';
import { IButtonComponent } from './ibutton.interface';
import { CamelCasePipe } from '../../pipes/camel-case/camel-case.pipe';

@Component({
  selector: 'cl-button',
  template: '',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements IButtonComponent, AfterViewInit {

  manualRender: boolean = false;

  @Input('data') dataSource: ButtonItem = null;
  @Output() buttonClick: EventEmitter<ButtonItem> = new EventEmitter<ButtonItem>();

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private camelCasePipe: CamelCasePipe
  ) { }

  ngAfterViewInit() {
    if (!this.manualRender) { this.render(); }
  }

  render(): ElementRef {
    let element: ElementRef = null;
    if (this.dataSource.itens && this.dataSource.itens.length > 0 && this.dataSource.split === true) {
      element = this.renderSplitButton();
    } else if (this.dataSource.itens && this.dataSource.itens.length > 0) {
      element = this.renderDropDownButton();
    } else {
      element = this.renderSingleButton();
    }

    if (this.manualRender) { return element; }

    this.renderer.appendChild(this.elRef.nativeElement, element);
    return element;
  }

  button_click(e: ButtonItem): void {
    if (this.dataSource.disabled) { return; }
    this.buttonClick.emit(e);
  }

  //#region Private Methods
  /** Renderiza um botão com as características padrão. */
  private renderSingleButton(): ElementRef {
    let icon: ElementRef = null;
    if (this.dataSource.icon !== null) {
      icon = this.renderer.createElement('I');
      this.renderer.addClass(icon, 'fa');
      this.renderer.addClass(icon, this.dataSource.icon);
    }

    let span: any = null;
    if (this.dataSource.label !== null && this.dataSource.label.length > 0) {
      span = this.renderer.createElement('SPAN');
      span.innerHTML = this.dataSource.label;
    }

    const button = this.renderer.createElement('BUTTON');
    this.renderer.setAttribute(button, 'type', 'button');

    if (this.dataSource.tooltip !== null) {
      this.renderer.setAttribute(button, 'title', this.dataSource.tooltip);
      this.renderer.setAttribute(button, 'id', this.dataSource.clientId);
    }

    this.renderer.addClass(button, this.dataSource.className);
    this.renderer.addClass(button, 'btn');

    if (this.dataSource.disabled) {
      this.renderer.addClass(button, 'disabled');
    }

    switch (this.dataSource.size) {
      case ButtonSize.Small: this.renderer.addClass(button, 'btn-sm'); break;
      case ButtonSize.Large: this.renderer.addClass(button, 'btn-lg'); break;
    }

    if (this.dataSource.pullRight) { this.renderer.addClass(button, 'pull-right'); }
    if (this.dataSource.inGrid) { this.renderer.addClass(button, 'btn-grid'); }

    if (this.dataSource.itens === null || this.dataSource.itens.length === 0) {
      this.renderer.listen(button, 'click', () => this.button_click(this.dataSource));
    }

    if (icon !== null) { this.renderer.appendChild(button, icon); }
    if (span !== null) { this.renderer.appendChild(button, span); }

    return button;
  }

  /** Renderiza um botão do tipo dropdown, ou seja, com submenu de ações. */
  private renderDropDownButton(): ElementRef {
    const dropDownItensContainer = this.renderer.createElement('DIV');
    this.renderer.addClass(dropDownItensContainer, 'dropdown-menu');

    if (this.dataSource.inGrid || this.dataSource.pullRight) {
      this.renderer.addClass(dropDownItensContainer, 'dropdown-menu-right');
    }

    this.renderItens(dropDownItensContainer);

    const dropDown = this.renderer.createElement('DIV');
    this.renderer.addClass(dropDown, 'btn-group');

    const button = this.renderSingleButton();
    this.renderer.addClass(button, 'dropdown-toggle');
    this.renderer.setAttribute(button, 'data-toggle', 'dropdown');
    this.renderer.setAttribute(button, 'data-haspopup', 'true');
    this.renderer.setAttribute(button, 'aria-expanded', 'false');

    this.renderer.appendChild(dropDown, button);
    this.renderer.appendChild(dropDown, dropDownItensContainer);

    return dropDown;
  }

  private renderSplitButton(): ElementRef {

    const button = this.renderSingleButton();
    this.renderer.listen(button, 'click', () => this.button_click(this.dataSource));

    const dropDown = this.renderer.createElement('DIV');
    this.renderer.addClass(dropDown, 'btn-group');


    const splitButton = this.renderer.createElement('BUTTON');
    this.renderer.setAttribute(splitButton, 'type', 'button');

    this.renderer.addClass(splitButton, this.dataSource.className);
    this.renderer.addClass(splitButton, 'btn');

    switch (this.dataSource.size) {
      case ButtonSize.Small: this.renderer.addClass(splitButton, 'btn-sm'); break;
      case ButtonSize.Large: this.renderer.addClass(splitButton, 'btn-lg'); break;
    }

    this.renderer.addClass(splitButton, 'dropdown-toggle');
    this.renderer.addClass(splitButton, 'dropdown-toggle-split');
    this.renderer.setAttribute(splitButton, 'data-toggle', 'dropdown');
    this.renderer.setAttribute(splitButton, 'data-haspopup', 'true');
    this.renderer.setAttribute(splitButton, 'aria-expanded', 'false');

    const splitItensContainer = this.renderer.createElement('DIV');
    this.renderer.addClass(splitItensContainer, 'dropdown-menu');
    this.renderer.addClass(splitItensContainer, 'dropdown-menu-right');

    this.renderItens(splitItensContainer);

    this.renderer.appendChild(dropDown, button);
    this.renderer.appendChild(dropDown, splitButton);
    this.renderer.appendChild(splitButton, splitItensContainer);

    return dropDown;
  }

  private renderItens(target: ElementRef): any {
    const itens = this.dataSource.itens.forEach((item: ButtonItem) => {
      if (item.isHeader) {
        const header = this.renderer.createElement('H6');
        this.renderer.addClass(header, 'dropdown-header');
        this.renderer.appendChild(target, header);
        header.innerHTML = this.camelCasePipe.transform(item.label);

      } else if (item.isDivider) {
        const divider = this.renderer.createElement('DIV');
        this.renderer.addClass(divider, 'dropdown-divider');
        this.renderer.appendChild(target, divider);

      } else {
        const btnItem = this.renderer.createElement('A');
        this.renderer.addClass(btnItem, 'dropdown-item');
        this.renderer.setAttribute(btnItem, 'href', '#');
        this.renderer.listen(btnItem, 'click', () => this.button_click(item));

        if (item.icon !== null) {
          const icon = this.renderer.createElement('I');
          this.renderer.addClass(icon, 'fa');
          this.renderer.addClass(icon, item.icon);
          this.renderer.appendChild(btnItem, icon);
        }

        const span = this.renderer.createElement('SPAN');
        span.innerHTML = item.label;
        this.renderer.appendChild(btnItem, span);
        this.renderer.appendChild(target, btnItem);
      }
    });

    return itens;
  }
  //#endregion
}
