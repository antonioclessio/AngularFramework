import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';

import { ComponentLibrary } from './../../common/library/component.library';
import { ButtonItem } from '../../components/button/button.item';
import { MainMenuItem } from '../../components/main-menu/main-menu.item';
import { TabStripItem } from '../../components/tab-strip/tab-strip.item';
import { IThemeComponent } from '../interface/itheme.component';
import { OnContextHeaderOutput } from '../interface/events.interface';
import { IContextHeaderComponent } from '../interface/icontext-header.component';
import { ModalService } from '../../components/modal/modal.service';
import { ModalSizeEnum } from '../../components/modal/modal-size.enum';

@Component({
  selector: 'cl-theme',
  templateUrl: './tab-theme.component.html',
  styleUrls: ['./tab-theme.component.scss'],
  providers: [ComponentLibrary, ModalService]
})
export class TabThemeComponent implements IThemeComponent, AfterViewInit, OnChanges {

  TAG_LOGOUT: number = 1;

  @Input() title: string = null;
  @Input() logo: string = null;

  //#region Components DataSources
  @Input('menu') dataSourceMainMenu: MainMenuItem[] = [];
  @Input() tabItem: TabStripItem;
  @Input() showEmptyComponent: boolean;

  @Input() contextComponent: string = null;
  @Input() emptyComponentName: string = null;
  @Input('user') userDropdownItens: MainMenuItem[] = [];
  @Output() logout: EventEmitter<any> = new EventEmitter<any>();
  //#endregion

  /** Valor default é false, mas pode ser alterado pelo componente que estiver consumido este theme. */
  tabItens: TabStripItem[] = [];
  pinMenu: boolean = false;
  backdrop: boolean = true;

  componentRef: ComponentRef<any>;

  constructor(
    private componentLibrary: ComponentLibrary,
    private vcRef: ViewContainerRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private modal: ModalService
  ) { }

  ngOnChanges(e: SimpleChanges): void {
    if (e.contextComponent && e.contextComponent.firstChange) {
      this.loadContextComponent();
    }
  }

  ngAfterViewInit(): void {
  }

  onMenuSelected(e: MainMenuItem) {
    this.tabItem = new TabStripItem(e.Label, (e.Aplicacao as any).Componente, (e.Aplicacao as any).Multiplo);
  }

  onTabStripDataSourceUpdate(e: TabStripItem[]) {
    this.tabItens = e;
    // this.pinMenu = !this.tabItens || this.tabItens.length === 0;
  }

  @HostListener('window:beforeunload', ['$event'])
  pageRefresh($event) {
    $event.returnValue = 'O sistema será recarregado e os dados não salvos serão perdidos. Continuar?';
  }

  onActionUserButtonClick(e: ButtonItem): void {
    if (e.tag === this.TAG_LOGOUT) {
      this.modal.title = 'Encerrar sessão';
      this.modal.message = 'Sair da aplicação?';
      this.modal.modalSize = ModalSizeEnum.Small;
      this.modal.confirmButtonLabel = 'Sim';
      this.modal.cancelButtonLabel = 'Não';
      this.modal.useConfirmButton = true;
      this.modal.useCancelButton = true;
      this.modal.actionSubscription = this.modal.buttonClick.subscribe((response: ButtonItem) => {
        if (response.tag === this.modal.TAG_BUTTON_CONFIRM) {
          this.logout.emit();
        }
      });

      this.modal.show();
    } else {
      // Ação correspondente ao item selecionado.
    }
  }

  loadContextComponent(): void {
    this.componentRef = this.componentLibrary.createComponentInstance(this.contextComponent, this.vcRef);

    (this.componentRef.instance as IContextHeaderComponent).output.subscribe(response => {
      if (((this.vcRef as any)._view.component as OnContextHeaderOutput).clOnContextHeaderOutput) {
        ((this.vcRef as any)._view.component as OnContextHeaderOutput).clOnContextHeaderOutput(response);
      }
    });

    const target = this.elRef.nativeElement.querySelector('[data-type="header-context"]');
    this.renderer.appendChild(target, this.componentRef.location.nativeElement);
  }

}
