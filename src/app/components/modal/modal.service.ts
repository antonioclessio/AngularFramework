import { ComponentRef, ElementRef, EventEmitter, Injectable, Renderer2, ViewContainerRef, Injector } from '@angular/core';

import { ComponentLibrary } from './../../common/library/component.library';
import { BtnPrimary } from './../button/button-type.class';
import { ButtonTypeEnum } from './../button/button-type.enum';
import { ButtonItem } from './../button/button.item';
import { IModalService } from './imodal.interface';
import { ModalSizeEnum } from './modal-size.enum';

import { ButtonBarGroup } from './../button-bar/button-bar.group';
import { IButtonBarComponent } from './../button-bar/ibutton-bar.interface';
import { IBaseComponent } from '../ibase.component';
import { OnBeforeSubmit } from '../../themes/interface/events.interface';

declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class ModalService implements IModalService {
  CONST_BUTTON_COMPONENT: string = 'ButtonComponent';
  TAG_BUTTON_CONFIRM: number = 1;
  TAG_BUTTON_CANCEL: number = 2;

  actionSubscription: any = null;

  modalSize: ModalSizeEnum = ModalSizeEnum.Normal;
  title: string = '{Não configurado}';
  message: string = null;
  confirmButtonLabel: string = 'Ok';
  cancelButtonLabel: string = 'Cancelar';
  componentName: string = null;
  componentDataSource: any = null;
  dataSource: any;
  componentRef: ComponentRef<any> = null;
  buttonBar: ButtonBarGroup[] = null;

  buttonClick: EventEmitter<ButtonItem> = new EventEmitter<ButtonItem>();
  componentValue: EventEmitter<any> = new EventEmitter<any>();

  useConfirmButton: boolean = true;
  useCancelButton: boolean = true;
  lockOpenned: boolean = false;
  onClosing: EventEmitter<any> = new EventEmitter<any>();

  private elRef: ElementRef;
  private renderer: Renderer2;
  private componentLibrary: ComponentLibrary;
  private vcRef: ViewContainerRef;

  constructor(private inject: Injector) {
    this.elRef = this.inject.get(ElementRef);
    this.renderer = this.inject.get(Renderer2);
    this.componentLibrary = this.inject.get(ComponentLibrary);
    this.vcRef = this.inject.get(ViewContainerRef);
  }

  //#region Métodos da Interface
  show(): void {
    this.renderModal();
    $('.modal').on('hidden.bs.modal', () => {
      this.componentName = null;
      this.modalSize = ModalSizeEnum.Normal;
      if (this.componentRef) {
        this.componentRef.destroy();
      }
      $('.modal').remove();
      this.onClosing.emit();
    });
    $('.modal').modal('show');
  }
  //#endregion

  button_click(e: ButtonItem): void {
    if (this.componentName) {

      switch (e.tag) {
        case this.TAG_BUTTON_CONFIRM:
          let componentDataSource: any = this.componentRef.instance.form.value;
          if ((this.componentRef.instance as OnBeforeSubmit).clOnBeforeSubmit) {
            const retorno = (this.componentRef.instance as OnBeforeSubmit).clOnBeforeSubmit();

            if (typeof retorno === 'boolean' && retorno === false) { return; }
            componentDataSource = retorno;
          }
          if (this.componentRef.instance.form.invalid) {
            this.componentLibrary.showFormErrors(this.componentRef.instance.form, this.componentRef.location.nativeElement);
          } else {
            this.componentValue.emit(componentDataSource);
          }
          break;
        case this.TAG_BUTTON_CANCEL:
          this.close();
          break;
        default:
          this.componentValue.emit(e);
          break;
      }

    } else {

      this.buttonClick.emit(e);
      this.close();

    }
  }

  close() {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    $('.modal').modal('hide');
  }

  //#region Métodos Privados

  private renderModal(): void {
    const modal = this.renderer.createElement('DIV');

    this.renderer.addClass(modal, 'modal');
    this.renderer.addClass(modal, 'fade');
    this.renderer.setAttribute(modal, 'tabindex', '-1');
    this.renderer.setAttribute(modal, 'role', 'dialog');
    this.renderer.setAttribute(modal, 'aria-hidden', 'true');

    this.renderer.appendChild(modal, this.renderModalDialog());


    this.renderer.appendChild(this.elRef.nativeElement.ownerDocument.body, modal);
  }

  private renderModalDialog(): ElementRef {
    const modalDialog = this.renderer.createElement('DIV');
    this.renderer.addClass(modalDialog, 'modal-dialog');
    this.renderer.setAttribute(modalDialog, 'role', 'document');

    switch (this.modalSize) {
      case ModalSizeEnum.Large: this.renderer.addClass(modalDialog, 'modal-lg'); break;
      case ModalSizeEnum.Small: this.renderer.addClass(modalDialog, 'modal-sm'); break;
      case ModalSizeEnum.ExtraLarge: this.renderer.addClass(modalDialog, 'modal-xl'); break;
    }

    this.renderer.appendChild(modalDialog, this.renderModalContent());

    return modalDialog;

  }

  private renderModalContent(): ElementRef {
    const modalContent = this.renderer.createElement('DIV');
    this.renderer.addClass(modalContent, 'modal-content');

    this.renderer.appendChild(modalContent, this.renderModalHeader());
    this.renderer.appendChild(modalContent, this.renderModalBody());
    this.renderer.appendChild(modalContent, this.renderModalFooter());

    return modalContent;

  }

  private renderModalHeader(): ElementRef {
    const modalHeader = this.renderer.createElement('DIV');
    this.renderer.addClass(modalHeader, 'modal-header');

    const modalTitle = this.renderer.createElement('H5');
    this.renderer.addClass(modalTitle, 'modal-title');
    (modalTitle as any).innerHTML = this.title;

    this.renderer.appendChild(modalHeader, modalTitle);
    this.renderer.appendChild(modalHeader, this.renderButtonClose());

    return modalHeader;
  }

  private renderModalBody(): ElementRef {
    const modalBody = this.renderer.createElement('DIV');
    this.renderer.addClass(modalBody, 'modal-body');
    if (this.componentName !== null && this.componentName.length > 0) {
      this.componentRef = this.componentLibrary.createComponentInstance(this.componentName, this.vcRef);
      if (this.componentDataSource) {
        (this.componentRef.instance as IBaseComponent).dataSource = this.componentDataSource;
      }
      this.renderer.appendChild(modalBody, this.componentRef.location.nativeElement);
    } else {
      (modalBody as any).innerHTML = this.message;
    }

    return modalBody;
  }

  private renderModalFooter(): ElementRef {
    const modalFooter = this.renderer.createElement('DIV');
    this.renderer.addClass(modalFooter, 'modal-footer');

    //#region Cancel Action Button
    if (this.useCancelButton) {
      const btnItemCancel: ButtonItem = new ButtonItem(ButtonTypeEnum.Close);
      btnItemCancel.label = this.cancelButtonLabel;
      btnItemCancel.tag = this.TAG_BUTTON_CANCEL;

      const cancelButtonRef = this.componentLibrary.createComponentInstance(this.CONST_BUTTON_COMPONENT, this.vcRef);
      cancelButtonRef.instance.dataSource = btnItemCancel;
      cancelButtonRef.instance.manualRender = true;
      cancelButtonRef.instance.buttonClick.subscribe(response => this.button_click(response));
      this.renderer.appendChild(modalFooter, cancelButtonRef.instance.render());
    }
    //#endregion

    //#region Button Bar Action
    if (this.buttonBar && this.buttonBar.length > 0) {
      const buttonBarRef: ComponentRef<any> = this.componentLibrary.createComponentInstance('ButtonBarComponent', this.vcRef);
      (buttonBarRef.instance as IButtonBarComponent).dataSource = this.buttonBar;
      this.renderer.appendChild(modalFooter, (buttonBarRef.instance as IButtonBarComponent).render(null));
      (buttonBarRef.instance as IButtonBarComponent).buttonClick.subscribe(response => this.button_click(response));
    }
    //#endregion

    //#region Confirm Action Button
    if (this.useConfirmButton) {
      const btnItemConfirm: ButtonItem = new ButtonItem();
      btnItemConfirm.label = this.confirmButtonLabel;
      btnItemConfirm.className = BtnPrimary;
      btnItemConfirm.icon = 'fa-check';
      btnItemConfirm.tag = this.TAG_BUTTON_CONFIRM;
      btnItemConfirm.tooltip = this.confirmButtonLabel;

      const confirmButtonRef = this.componentLibrary.createComponentInstance(this.CONST_BUTTON_COMPONENT, this.vcRef);
      confirmButtonRef.instance.dataSource = btnItemConfirm;
      confirmButtonRef.instance.manualRender = true;
      confirmButtonRef.instance.buttonClick.subscribe(response => this.button_click(response));
      this.renderer.appendChild(modalFooter, confirmButtonRef.instance.render());
    }
    //#endregion

    return modalFooter;
  }

  private renderButtonClose(): ElementRef {
    const buttonClose = this.renderer.createElement('BUTTON');
    this.renderer.setAttribute(buttonClose, 'type', 'button');
    this.renderer.addClass(buttonClose, 'close');
    this.renderer.setAttribute(buttonClose, 'data-dismiss', 'modal');
    this.renderer.setAttribute(buttonClose, 'aria-label', 'Close');

    const span = this.renderer.createElement('SPAN');
    this.renderer.setAttribute(span, 'aria-hidden', 'true');
    (span as any).innerHTML = '&times;';

    this.renderer.appendChild(buttonClose, span);

    return buttonClose;
  }
  //#endregion
}
