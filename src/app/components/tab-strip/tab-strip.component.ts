import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
  HostListener,
  OnInit,
  ComponentRef,
  AfterViewInit,
} from '@angular/core';

import { ComponentLibrary } from './../../common/library/component.library';
import { ITabStripComponent } from './itab-strip.interface';
import { TabStripItem } from './tab-strip.item';
import {
  OnTabClosing, OnTabClosed, OnCloseData, OnLoadComponentInstance, OnAfterLoadDataSource
} from '../../themes/interface/events.interface';
import { ToastService } from '../toast/toast.service';
import { IBaseComponent } from '../ibase.component';
import { IDataFormComponent } from '../../themes/interface/application/idata-form.component';

declare let $: any;

@Component({
  selector: 'tabstrip',
  templateUrl: './tab-strip.component.html',
  styleUrls: ['./tab-strip.component.scss'],
  providers: [ComponentLibrary, ToastService]
})
export class TabStripComponent implements ITabStripComponent, OnChanges, AfterViewInit {

  dataSource: TabStripItem[] = [];
  emptyComponentRef: ComponentRef<any> = null;

  @Input() logo: string = null;
  @Input() emptyComponent: string = null;
  @Input('newItem') currentItem: TabStripItem = null;
  @Input() showEmptyComponent: boolean = false;

  @Output() dataSourceUpdated: EventEmitter<TabStripItem[]> = new EventEmitter<TabStripItem[]>();

  constructor(
    private vcRef: ViewContainerRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private componentLibrary: ComponentLibrary,
    private toast: ToastService
  ) { }

  //#region Lyfecicle Hooks
  ngOnChanges(e: SimpleChanges): void {
    if (e.currentItem && !e.currentItem.firstChange) {
      this.addItem(this.currentItem);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadEmptyComponent();
    }, 500);
  }
  //#endregion

  //#region Métodos da Interface
  addItem(e: TabStripItem) {
    if (this.dataSource.find(a => a.id === e.id)) {
      this.selectItem(e);
      return;
    }

    this.dataSource.push(e);
    // Este timeOut foi necessário para aguardar a execução do Lifecycle.
    setTimeout(() => this.createItem(e), 50);
  }

  @HostListener('mousedown', ['$event'])
  mouseClick(e: MouseEvent): void {
    if (e.which !== 2) { return; }

    const targetId: string = (e.target as any).tagName === 'I'
      ? (e.target as any).parentElement.attributes['aria-controls'].value
      : (e.target as any).attributes['aria-controls'].value;

    const targetTabItem: TabStripItem = this.dataSource.find(a => a.id === targetId);

    this.removeItem(targetTabItem);
  }

  removeItem(e: TabStripItem) {
    // Evento
    // Verificando se a tab pode ser fechada. Isto implica em matar a instância do componente criado.
    if ((e.componentInstance.instance as OnTabClosing).clOnTabClosing
      && (e.componentInstance.instance as OnTabClosing).clOnTabClosing(e) === false) {
      this.toast.warning('A aba não pode ser fechada.');
      return;
    }

    $('.tooltip').tooltip('dispose');

    // Remove os elementos HTML (UL).
    const targetUL = this.elRef.nativeElement.querySelector('div[data-type="tabStrip"]>ul');
    const liRemove = targetUL.querySelector(`a#${e.id}-tab`);
    this.renderer.removeChild(targetUL, liRemove.parentElement);

    // Remove os elementos HTML (DIV).
    const targetDIV = this.elRef.nativeElement.querySelector('div[data-type="tabStrip"]>div.tab-content');
    const divRemove = targetDIV.querySelector(`div#${e.id}`);
    this.renderer.removeChild(targetDIV, divRemove);

    // Marca o último item da tab como ativo.
    setTimeout(() => this.setLastItemAsActive(), 50);

    // Remove a tab dataSource principal do componente.
    this.dataSource = this.dataSource.filter(a => a.id !== e.id);

    // Evento
    // Dispara um evento de conclusão do fechamento da tab.
    if ((e.componentInstance.instance as OnTabClosed).clOnTabClosed) { (e.componentInstance.instance as OnTabClosed).clOnTabClosed(e); }

    // Caso esteja implementado, chama o método que finaliza a instância do componente.
    if ((e.componentInstance.instance as OnCloseData).clOnCloseData) { (e.componentInstance.instance as OnCloseData).clOnCloseData(); }

    e.componentInstance.destroy();

    if (this.dataSource.length === 0) {
      setTimeout(() => this.loadEmptyComponent(), 50);
    }
  }

  clearItens(): void {
    this.dataSource.forEach(item => this.removeItem(item));
    this.dataSource = [];
  }

  canShowEmptyComponent(): boolean {
    const show: boolean = (this.dataSource.length === 0 && this.emptyComponent !== null) || this.showEmptyComponent;
    return show;
  }
  //#endregion

  //#region Demais métodos
  private loadEmptyComponent(): void {
    if (!this.emptyComponent) { return; }
    this.emptyComponentRef = this.componentLibrary.createComponentInstance(this.emptyComponent, this.vcRef);
    this.renderer.appendChild(this.elRef.nativeElement.querySelector('.no-tabs'), this.emptyComponentRef.location.nativeElement);
  }

  private createItem(e: TabStripItem): void {
    if (this.emptyComponentRef !== null) {
      this.emptyComponentRef.destroy();
    }

    const targetUL = this.elRef.nativeElement.querySelector('div[data-type="tabStrip"]>ul.nav-tabs');
    this.renderer.appendChild(targetUL, this.createULItem(e));

    const targetDIV = this.elRef.nativeElement.querySelector('div[data-type="tabStrip"]>div.tab-content');
    const newDiv = this.createDIVItem(e);
    this.renderer.appendChild(targetDIV, newDiv);

    this.setLastItemAsActive();

    const componentRef = this.componentLibrary.createComponentInstance(e.componentName, this.vcRef);

    // Evento executado logo após a criação da instância do componente.
    if ((componentRef.instance as OnLoadComponentInstance).clOnLoadComponentInstance) {
      (componentRef.instance as OnLoadComponentInstance).clOnLoadComponentInstance(e);
    }

    if (e.dataItemKey) {
      (componentRef.instance as IDataFormComponent).selectedKey = e.dataItemKey;
      // (componentRef.instance as IBaseComponent).dataSource = e.componentDataSource;
      // if ((componentRef.instance as OnAfterLoadDataSource).clOnAfterLoadDataSource) {
      //   (componentRef.instance as OnAfterLoadDataSource).clOnAfterLoadDataSource();
      // }
    }

    this.dataSource.find(a => a.id === e.id).componentInstance = componentRef;
    this.renderer.appendChild(newDiv, componentRef.location.nativeElement);
  }

  private createULItem(e: TabStripItem): ElementRef {
    const times = this.renderer.createElement('I');
    this.renderer.addClass(times, 'fa-times');
    this.renderer.addClass(times, 'fa');
    this.renderer.setAttribute(times, 'title', 'Fechar tab');
    this.renderer.setAttribute(times, 'data-toggle', 'tooltip');
    this.renderer.setAttribute(times, 'data-original-title', 'Fechar tab');
    this.renderer.listen(times, 'click', () => this.removeItem(e));

    const link = this.renderer.createElement('A');
    this.renderer.addClass(link, 'nav-link');
    this.renderer.setAttribute(link, 'id', `${e.id}-tab`);
    this.renderer.setAttribute(link, 'href', `#${e.id}`);
    this.renderer.setAttribute(link, 'data-toggle', 'tab');
    this.renderer.setAttribute(link, 'role', 'tab');
    this.renderer.setAttribute(link, 'aria-controls', e.id);
    this.renderer.setAttribute(link, 'aria-selected', 'true');
    link.innerHTML = e.label;
    this.renderer.appendChild(link, times);

    const liEL = this.renderer.createElement('LI');
    this.renderer.addClass(liEL, 'nav-item');
    this.renderer.appendChild(liEL, link);

    return liEL;
  }

  private createDIVItem(e: TabStripItem): ElementRef {
    const div = this.renderer.createElement('DIV');
    this.renderer.addClass(div, 'fade');
    this.renderer.addClass(div, 'tab-pane');
    this.renderer.setAttribute(div, 'role', 'tabpanel');
    this.renderer.setAttribute(div, 'id', e.id);
    this.renderer.setAttribute(div, 'aria-labelledby', `${e.id}-tab`);

    return div;
  }

  private selectItem(e: TabStripItem): void {
    const activeClass = 'active';
    const currentULActive = this.elRef.nativeElement.querySelector('ul.nav-tabs>li>a.active');
    const currentDIVActive = this.elRef.nativeElement.querySelector('.tab-content>div.active');

    if (currentULActive) {
      this.renderer.removeClass(currentULActive, activeClass);
      this.renderer.removeClass(currentDIVActive, activeClass);
      this.renderer.removeClass(currentDIVActive, 'show');
    }

    const toActiveUL = this.elRef.nativeElement.querySelector(`ul>li>a#${e.id}-tab`);
    const toActiveDiv = this.elRef.nativeElement.querySelector(`div[data-type="tabStrip"]>.tab-content>div#${e.id}`);

    if (toActiveUL) {
      this.renderer.addClass(toActiveUL, activeClass);
      this.renderer.addClass(toActiveDiv, activeClass);
      this.renderer.addClass(toActiveDiv, 'show');
    }
  }

  private setLastItemAsActive() {
    const activeClass = 'active';
    const currentULActive = this.elRef.nativeElement.querySelector('ul.nav-tabs>li>a.active');
    const currentDIVActive = this.elRef.nativeElement.querySelector('.tab-content>div.active');

    if (currentULActive) {
      this.renderer.removeClass(currentULActive, activeClass);
      this.renderer.removeClass(currentDIVActive, activeClass);
      this.renderer.removeClass(currentDIVActive, 'show');
    }

    const lastUL = this.elRef.nativeElement.querySelector('ul>li:last-child>a');
    const lastDIV = this.elRef.nativeElement.querySelector('div[data-type="tabStrip"]>.tab-content>div:last-child');

    if (lastUL) {
      this.renderer.addClass(lastUL, activeClass);
      this.renderer.addClass(lastDIV, activeClass);
      this.renderer.addClass(lastDIV, 'show');
    }
  }
  //#endregion
}
