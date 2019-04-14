import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewContainerRef } from '@angular/core';

import { ComponentLibrary } from './../../common/library/component.library';
import { ButtonItem } from '../button/button.item';
import { ButtonBarGroup } from './button-bar.group';
import { IButtonBarComponent } from './ibutton-bar.interface';

@Component({
  selector: 'button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss'],
  providers: [ComponentLibrary]
})
export class ButtonBarComponent implements IButtonBarComponent, OnInit {

  @Input('data') dataSource: ButtonBarGroup[] = [];
  @Output() buttonClick: EventEmitter<ButtonItem> = new EventEmitter<ButtonItem>();

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private componentLibrary: ComponentLibrary,
    private vcRef: ViewContainerRef
  ) { }

  //#region Lifecycle hooks
  ngOnInit() {
    this.render();
  }
  //#endregion

  //#region Métodos da Interface
  render(): ElementRef {
    const target = this.elRef.nativeElement.querySelector('.btn-toolbar');

    this.dataSource.forEach(group => {
      this.renderer.appendChild(target, this.renderGroup(group));
    });

    return target;
  }

  renderGroup(e: ButtonBarGroup): ElementRef {
    const div = this.renderer.createElement('DIV');
    this.renderer.addClass(div, 'mr-2');
    this.renderer.addClass(div, 'btn-group-sm');
    this.renderer.addClass(div, 'btn-group');

    e.itens.forEach(button => {
      const clButton = this.componentLibrary.createComponentInstance('ButtonComponent', this.vcRef);

      clButton.instance.buttonClick.subscribe(response => this.button_click(response));
      clButton.instance.dataSource = button;
      clButton.instance.manualRender = true;

      this.renderer.appendChild(div, clButton.instance.render());
    });

    return div;
  }

  button_click(e: ButtonItem) {
    this.buttonClick.emit(e);
  }
  //#endregion

}
