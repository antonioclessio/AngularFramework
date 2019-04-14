import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
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
import { ModalSizeEnum } from '../../../components/modal/modal-size.enum';
import { ModalService } from '../../../components/modal/modal.service';
import { IDataFormComponent } from '../../interface/application/idata-form.component';
import { IDetailComponent } from '../../interface/application/idetail.component';
import { IListComponent } from '../../interface/application/ilist.component';
import { OnAfterDelete, OnBeforeDelete, OnSearch } from '../../interface/events.interface';
import { IThemeDataListComponent } from '../../interface/itheme-data-list.component';
import { ToastService } from '../../../components/toast/toast.service';
import { IDataListComponent } from '../../interface/application/idata-list.component';
import { SecurityLibrary } from './../../../common/library/security.library';

@Component({
  selector: 'cl-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
  providers: [ModalService, ToastService]
})
export class DataListComponent implements IThemeDataListComponent, OnInit, AfterViewInit {

  //#region Inputs / Outputs / Construtor
  @Input() prefix: string = null;
  @Input() title: string = null;
  @Input() dataFormComponent: string = 'DataFormComponent';
  @Input() listComponent: string = 'ListComponent';
  @Input() filterListComponent: string = 'FilterComponent';
  @Input() detailsComponent: string = 'DetailComponent';
  @Input() useFormShort: boolean = false;
  @Input() useDefaultActions: boolean = true;
  @Input('buttons') customButtonBarGroup: ButtonBarGroup[] = null;
  @Input() apiAction: string = null;
  @Input() quickSearch: boolean = null;
  @Input() detailPinned: boolean = true;
  @Input() startWithForm: boolean = false;

  @Output() buttonBarClick: EventEmitter<ButtonItem> = new EventEmitter<ButtonItem>();
  @Output() onCloseData: EventEmitter<any> = new EventEmitter<any>();

  actionSelected: any = null;
  buttonBarGroup: ButtonBarGroup[] = [];
  componentRef: ComponentRef<any> = null;
  detailComponentRef: ComponentRef<any> = null;
  selectedKey: any = null;

  constructor(
    private componentLibrary: ComponentLibrary,
    private vcRef: ViewContainerRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private modal: ModalService,
    private toast: ToastService,
    private http: HttpClient,
    private securityLib: SecurityLibrary
  ) { }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    if (this.quickSearch) { this.loadQuickSearch(); }
    if (this.useDefaultActions) { this.configureButtonBarItens(); }
    this.loadDataListView();

    if (this.startWithForm) {
      this.loadDataFormView(false);
    }
  }
  ngAfterViewInit(): void {
    if (this.detailPinned === false) {
      this.setDetailAbsolute();
    }
  }
  //#endregion

  //#region Métodos da Interface
  configureButtonBarItens(): void {
    const refreshAction: ButtonBarGroup = new ButtonBarGroup([]);
    const defaultActions: ButtonBarGroup = new ButtonBarGroup([]);

    const applicationId: number = ((this.vcRef as any)._view.component as IDataListComponent).ApplicationID;
    if (this.apiAction !== null) {
      refreshAction.itens.push(new ButtonItem(ButtonTypeEnum.Refresh));
      defaultActions.itens.push(new ButtonItem(ButtonTypeEnum.Search));

      if (this.securityLib.checkPermission(applicationId, 2)) { defaultActions.itens.push(new ButtonItem(ButtonTypeEnum.New)); }
      if (this.securityLib.checkPermission(applicationId, 3)) { defaultActions.itens.push(new ButtonItem(ButtonTypeEnum.Edit)); }
      if (this.securityLib.checkPermission(applicationId, 4)) { defaultActions.itens.push(new ButtonItem(ButtonTypeEnum.Delete)); }
    }

    if (this.customButtonBarGroup && this.customButtonBarGroup.length > 0) {
      this.customButtonBarGroup.forEach(item => this.buttonBarGroup.push(item));
    }

    this.buttonBarGroup.push(refreshAction, defaultActions);
  }

  onButtonBar_Click(e: ButtonItem): void {
    this.buttonBarClick.emit(e);

    switch (e.type) {
      case ButtonTypeEnum.Refresh: this.btnRefresh_Click(); break;
      case ButtonTypeEnum.New: this.btnNew_Click(); break;
      case ButtonTypeEnum.Edit: this.btnEdit_Click(); break;
      case ButtonTypeEnum.Delete: this.btnDelete_Click(); break;
      case ButtonTypeEnum.Search: this.btnPesquisa_Click(); break;
    }
  }

  loadQuickSearch(): void {
    const inputSearch: ElementRef = this.renderer.createElement('INPUT');
    this.renderer.addClass(inputSearch, 'form-control');
    this.renderer.addClass(inputSearch, 'form-control-sm');
    this.renderer.setAttribute(inputSearch, 'type', 'search');
    this.renderer.setAttribute(inputSearch, 'placeholder', 'Pesquisa...');

    this.renderer.listen(inputSearch, 'keyup', (e) => {
      this.onSearch(e.target.value);
    });

    this.renderer.appendChild(this.elRef.nativeElement.querySelector('div[data-type="quick-search"]'), inputSearch);
  }

  onSearch(e: string): void {
    if (this.componentRef.instance.clOnSearch) {
      (this.componentRef.instance as OnSearch).clOnSearch(e);
    }
  }

  loadDataListView(): ComponentRef<any> {

    const componentName: string = `${this.prefix}${this.listComponent}`;
    this.componentRef = this.componentLibrary.createComponentInstance(componentName, this.vcRef);
    this.renderer.appendChild(this.elRef.nativeElement.querySelector('div[data-type="dataList"]'),
      this.componentRef.location.nativeElement);

    (this.componentRef.instance as IListComponent).doubleClick.subscribe(response => {
      this.selectedKey = [response];
      this.loadDataFormView(true);
    });

    (this.componentRef.instance as IListComponent).selectedKey.subscribe(response => {
      ((this.componentRef as any)._view.viewContainerParent.component as IDataListComponent).selectedKey = response;
      if (response) {
        this.selectedKey = response;
        this.http.get(`${this.apiAction}/${this.selectedKey}`).subscribe((dataResponse: any) => {
          if (this.detailComponentRef === null) { this.loadDataDetailView(); }
          const hasDataObject: boolean = dataResponse.Data && typeof dataResponse.Data === 'object';
          (this.detailComponentRef.instance as IDetailComponent).dataSource = hasDataObject ? dataResponse.Data : dataResponse;
        });
      } else {
        this.closeDetail();
      }
    });
    if (!(this.componentRef.instance as IListComponent).selectedAction) {
      return this.componentRef;
    }

    (this.componentRef.instance as IListComponent).selectedAction.subscribe(response => {
      const e = response.button;
      this.selectedKey = response.selectedKey;

      switch (e.type) {
        case ButtonTypeEnum.Delete: this.btnDelete_Click(); break;
        case ButtonTypeEnum.Open: this.btnEdit_Click(); break;
      }
    });

    return this.componentRef;
  }

  loadDataDetailView(): ComponentRef<any> {
    const componentName: string = `${this.prefix}${this.detailsComponent}`;
    this.detailComponentRef = this.componentLibrary.createComponentInstance(componentName, this.vcRef);
    this.renderer.appendChild(this.elRef.nativeElement.querySelector('div[data-type="detail"]'),
      this.detailComponentRef.location.nativeElement);

    return this.detailComponentRef;
  }

  closeDetail(): void {
    this.selectedKey = null;
    this.detailComponentRef.destroy();
    this.detailComponentRef = null;
  }

  /**
  * @description Em caso de o tema ter o detail configurado como não fixo (pinned), este método faz a adaptação dos containeres.
  */
  setDetailAbsolute(): void {
    const dataList = this.elRef.nativeElement.querySelector('div[data-type="dataList"]');
    this.renderer.removeClass(dataList, 'col-md-9');
    this.renderer.addClass(dataList, 'col-md-12');

    const detailView = this.elRef.nativeElement.querySelector('div[data-type="detailView"]');
    this.renderer.removeClass(detailView, 'col-md-3');
    this.renderer.addClass(detailView, 'detail');

    const backdropRef = this.componentLibrary.createComponentInstance('BackdropComponent', this.vcRef);
    backdropRef.instance.parentRestriction = true;
    this.renderer.addClass(backdropRef.location.nativeElement.querySelector('.backdrop'), 'no-margins-details');

    const backdropTarget = this.elRef.nativeElement.querySelector('div[data-type="dataList"]');
    this.renderer.appendChild(backdropTarget, backdropRef.location.nativeElement);

  }

  loadDataFilterView(): ComponentRef<any> {
    this.modal.title = 'Pesquisa';
    this.modal.cancelButtonLabel = 'Fechar';
    this.modal.confirmButtonLabel = 'Ok';
    this.modal.componentName = `${this.prefix + this.filterListComponent}`;
    this.modal.actionSubscription = this.modal.componentValue.subscribe(response => {
      if (this.componentRef.instance.clOnSearch) {
        (this.componentRef.instance as OnSearch).clOnSearch(response);
      }

      this.modal.close();
    });

    this.modal.show();
    return null;
  }

  loadDataFormView(loadDataSource: boolean): ComponentRef<any> {
    if (loadDataSource) {
      if (this.selectedKey === undefined || this.selectedKey === null) {
        this.toast.warning('Selecione um registro para editar');
        return;
      }

      if (Array.isArray(this.selectedKey) && this.selectedKey.length > 1) {
        this.toast.warning('Selecione apenas um registro para editar');
        return;
      }
    }

    if (this.useFormShort) {
      return this.loadDataFormView_Short();
    }
    return this.loadDataFormView_Full();
  }

  loadDataFormView_Full(): ComponentRef<any> {
    // Escondendo o dataList, para evitar que elementos ativos fiquem sobrepostos sobre o dataForm.
    this.renderer.setAttribute(this.elRef.nativeElement, 'style', 'display: none');

    // Criando o elemento dataForm e carregando o componente correspondente.
    return this.loadDataFormView_Base(() => {
      (this.componentRef.instance as IListComponent).loadDataSource();
      this.renderer.removeAttribute(this.elRef.nativeElement, 'style');
    });
  }

  loadDataFormView_Short(): ComponentRef<any> {
    const backdropRef = this.componentLibrary.createComponentInstance('BackdropComponent', this.vcRef);
    backdropRef.instance.parentRestriction = true;

    this.renderer.addClass(backdropRef.location.nativeElement.querySelector('.backdrop'), 'no-margins');

    const backdropTarget = this.elRef.nativeElement.querySelector('div[data-type="content"]');
    this.renderer.appendChild(backdropTarget, backdropRef.location.nativeElement);

    return this.loadDataFormView_Base(() => {
      backdropRef.destroy();
    });
  }

  loadDataFormView_Base(fn: any): ComponentRef<any> {
    // Criando o elemento dataForm e carregando o componente correspondente.
    const componentName: string = `${this.prefix}${this.dataFormComponent}`;
    const componentRef = this.componentLibrary.createComponentInstance(componentName, this.vcRef);
    (componentRef.instance as IDataFormComponent).useCloseButton = true;
    (componentRef.instance as IDataFormComponent).onCloseData.subscribe(() => {
      this.selectedKey = null;
      (componentRef.instance as IDataFormComponent).selectedKey = null;

      if (this.detailComponentRef) {
        this.detailComponentRef.destroy();
        this.detailComponentRef = null;
      }

      (this.componentRef.instance as IListComponent).loadDataSource();

      fn();
    });
    this.renderer.appendChild(this.elRef.nativeElement.parentElement, componentRef.location.nativeElement);
    (componentRef.instance as IDataFormComponent).selectedKey = this.selectedKey;

    if ((componentRef.instance as IDataFormComponent).onFormLoaded) {
      (componentRef.instance as IDataFormComponent).onFormLoaded();
    }

    return componentRef;
  }

  closeData(): void {
    this.componentRef.destroy();
    this.onCloseData.emit(null);
  }
  //#endregion

  //#region Métodos Privados
  private btnRefresh_Click(): void {
    (this.componentRef.instance as IListComponent).loadDataSource();
  }
  private btnPesquisa_Click(): void {
    this.loadDataFilterView();
  }

  private btnNew_Click(): void {
    this.selectedKey = null;
    this.loadDataFormView(false);
  }

  private btnEdit_Click(): void {
    this.loadDataFormView(true);
  }

  private btnDelete_Click(): void {
    if (this.selectedKey === undefined || this.selectedKey === null) {
      this.toast.warning('Selecione um registro para excluir');
      return;
    }

    this.modal.title = 'Excluir';
    this.modal.message = 'Deseja realmente excluir?';
    this.modal.cancelButtonLabel = 'Não';
    this.modal.confirmButtonLabel = 'Sim';
    this.modal.modalSize = ModalSizeEnum.Small;
    this.modal.actionSubscription = this.modal.buttonClick.subscribe(response => {
      if ((response as ButtonItem).tag === this.modal.TAG_BUTTON_CONFIRM) {

        if (this.componentRef.instance.clOnBeforeDelete &&
          !(this.componentRef.instance as OnBeforeDelete).clOnBeforeDelete()) {
          return;
        }

        this.http.delete(`${this.apiAction}/${this.selectedKey}`).subscribe(() => {
          this.toast.success('Registro removido com sucesso.');

          if (this.componentRef.instance.clOnAfterDelete) {
            (this.componentRef.instance as OnAfterDelete).clOnAfterDelete();
          }

          this.closeDetail();
          (this.componentRef.instance as IListComponent).loadDataSource();
        });
      }
    });

    this.modal.show();
  }
  //#endregion

}
