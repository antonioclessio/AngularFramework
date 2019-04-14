import { HttpClient } from '@angular/common/http';
import {
  ComponentRef,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';

import { ComponentLibrary } from './../../../common/library/component.library';
import { ButtonBarGroup } from '../../../components/button-bar/button-bar.group';
import { ButtonTypeEnum } from '../../../components/button/button-type.enum';
import { ButtonItem } from '../../../components/button/button.item';
import { ModalService } from '../../../components/modal/modal.service';
import { IFormComponent } from '../../interface/application/iform.component';
import {
  OnAfterLoadDataSource,
  OnAfterSubmit,
  OnBeforeLoadDataSource,
  OnBeforeSubmit,
  OnErrorSubmit,
} from '../../interface/events.interface';
import { IThemeDataFormComponent } from '../../interface/itheme-data-form.component';
import { ToastService } from '../../../components/toast/toast.service';

export abstract class DataFormBaseComponent implements IThemeDataFormComponent, OnInit {
  //#region Inputs / Outputs / Construtor
  @Input() prefix: string = null;
  @Input() title: string = null;
  @Input() titleField: string = null;
  @Input() dataFormComponent: string = 'FormComponent';
  @Input('buttons') customButtonBarGroup: ButtonBarGroup[] = null;
  @Input() apiAction: string = null;
  @Input() selectedKey: any;
  @Input() useCloseButton: boolean = true;
  @Input() v3: boolean = false;
  @Output() buttonBarClick: EventEmitter<ButtonItem> = new EventEmitter<ButtonItem>();
  @Output() onCloseData: EventEmitter<any> = new EventEmitter<any>();

  buttonBarGroup: ButtonBarGroup[] = [];
  componentRef: ComponentRef<any>;
  //#endregion

  componentLibrary: ComponentLibrary;
  vcRef: ViewContainerRef;
  elRef: ElementRef;
  renderer: Renderer2;
  modal: ModalService;
  http: HttpClient;
  toast: ToastService;

  constructor(
    @Inject(ComponentLibrary) componentLibrary: ComponentLibrary,
    @Inject(ViewContainerRef) vcRef: ViewContainerRef,
    @Inject(ElementRef) elRef: ElementRef,
    @Inject(Renderer2) renderer: Renderer2,
    @Inject(ModalService) modal: ModalService,
    @Inject(HttpClient) http: HttpClient,
    @Inject(ToastService) toast: ToastService
  ) {
    this.componentLibrary = componentLibrary;
    this.vcRef = vcRef;
    this.elRef = elRef;
    this.renderer = renderer;
    this.modal = modal;
    this.http = http;
    this.toast = toast;
  }

  //#region Lifecycle Hooks
  ngOnInit() {
    this.configureButtonBarItens();
    this.loadDataFormView();
  }
  //#endregion

  //#region Métodos data Interface
  configureButtonBarItens(): void {
    if (this.customButtonBarGroup && this.customButtonBarGroup.length > 0) {
      this.customButtonBarGroup.forEach(item => this.buttonBarGroup.push(item));
    }

    const saveActions: ButtonBarGroup = new ButtonBarGroup([new ButtonItem(ButtonTypeEnum.Save)]);
    this.buttonBarGroup.push(saveActions);

    if (this.useCloseButton) {
      const closeActions: ButtonBarGroup = new ButtonBarGroup([new ButtonItem(ButtonTypeEnum.Close)]);
      this.buttonBarGroup.push(closeActions);
    }
  }

  onButtonBar_Click(e: ButtonItem): void {
    switch (e.type) {
      case ButtonTypeEnum.Close: this.closeData(); break;
      case ButtonTypeEnum.Save: this.submitForm(); break;
      case ButtonTypeEnum.Default: this.buttonBarClick.emit(e); break;
    }
  }

  loadDataFormView(): ComponentRef<any> {
    const componentName: string = `${this.prefix}${this.dataFormComponent}`;
    this.componentRef = this.componentLibrary.createComponentInstance(componentName, this.vcRef);
    this.renderer.appendChild(this.elRef.nativeElement.querySelector('div[data-type="dataForm"]'),
      this.componentRef.location.nativeElement);

    if (this.componentRef.instance.clOnBeforeLoadDataSource) {
      (this.componentRef.instance as OnBeforeLoadDataSource).clOnBeforeLoadDataSource();
    }

    if (this.selectedKey === null) { return this.componentRef; }

    let url: string = `${this.apiAction}/${this.selectedKey}/edit`;
    this.http.get(url).subscribe((res: any) => {
      const dataSource = res.Data && typeof res.Data === 'object' ? res.Data : res;
      (this.componentRef.instance as IFormComponent).dataSource = dataSource;

      if (this.titleField) {
        this.title = this.getTitleFromTitleField(dataSource);
      }

      if ((this.componentRef.instance as OnAfterLoadDataSource).clOnAfterLoadDataSource) {
        (this.componentRef.instance as OnAfterLoadDataSource).clOnAfterLoadDataSource();
      }

      this.componentRef.instance.form.markAsPristine();
    });

    return this.componentRef;
  }

  private getTitleFromTitleField(data: any): string {
    if (!this.titleField) { return null; }
    if (this.titleField.indexOf('.') === -1) { return data[this.titleField]; }

    const slices: string[] = this.titleField.split('.');
    let tempData: any = null;
    slices.forEach(item => {
      if (!tempData) {
        tempData = data[item];
      } else {
        tempData = tempData[item];
      }
    });

    return tempData;
  }

  closeData(): void {
    if (!this.componentRef.instance.form.pristine) {
      this.modal.title = 'Atenção';
      this.modal.message = 'O formulário sofreu alterações e os dados serão descartados se fechar.<br />Continuar?';
      this.modal.confirmButtonLabel = 'Sim';
      this.modal.cancelButtonLabel = 'Não';
      this.modal.actionSubscription = this.modal.buttonClick.subscribe(response => {
        if ((response as ButtonItem).tag === this.modal.TAG_BUTTON_CANCEL) { return; }

        this.runCloseData();
      });
      this.modal.show();
    } else {
      this.runCloseData();
    }
  }

  /** Conclusão da execução do método closeData() */
  private runCloseData(): void {
    this.componentRef.destroy();
    this.elRef.nativeElement.remove();
    this.onCloseData.emit();
  }

  submitForm(): void {
    if (this.componentRef.instance.form.valid) {
      let dataSource: any = this.componentRef.instance.form.value;
      // Se foi implementado o evento e o mesmo retorna false, então aborta o submit.
      if (this.componentRef.instance.clOnBeforeSubmit) {

        /** O evento clOnBeforeSubmit pode retornar boolean ou um objeto qualquer. Caso o retorno seja false, deve-se abortar
         * a ação de submit, caso contrário o valor retornado deve ser atribuido ao dataSource somente se o valor for diferente de nulo.
         */
        const temp_value: any = (this.componentRef.instance as OnBeforeSubmit).clOnBeforeSubmit();
        if (temp_value === false) { return; }

        if (temp_value !== null && temp_value !== undefined && temp_value !== true) {
          dataSource = temp_value;
        }
      }

      this.http.post(`${this.apiAction}`, dataSource).subscribe(response => {
        this.toast.success('Dados salvos com sucesso');

        if ((this.componentRef.instance as OnAfterSubmit).clOnAfterSubmit) {
          (this.componentRef.instance as OnAfterSubmit).clOnAfterSubmit(response);
        }

        this.componentRef.instance.form.markAsPristine();
        this.closeData();
      }, (e) => {
        if ((this.componentRef.instance as OnErrorSubmit).clOnErrorSubmit) {
          (this.componentRef.instance as OnErrorSubmit).clOnErrorSubmit(e);
        }
      });
    } else {
      this.toast.warning('O formulário não foi preenchido corretamente. Verifique!');
      this.componentLibrary.showFormErrors(this.componentRef.instance.form, this.componentRef.location.nativeElement);
    }
  }
  //#endregion
}
