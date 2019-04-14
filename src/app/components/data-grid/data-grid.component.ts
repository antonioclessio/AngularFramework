import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, Renderer2, ElementRef } from '@angular/core';

import { ButtonItem } from '../button/button.item';
import { DataGridConfiguration } from './data-grid.configuration';
import { IDataGridComponent } from './idata-grid.interface';
import { ComponentLibrary } from './../../common/library/component.library';
import { DataGridColumn } from './data-grid.column';
import { HelperLibrary } from './../../common/library/helper.library';
import { CamelCasePipe } from '../../pipes/camel-case/camel-case.pipe';
import { StringLibrary } from '../../common/library/string.library';
import { MASK_CPF, MASK_CNPJ, MASK_Celular, MASK_TelefoneFixo, MASK_CEP } from '../form-input/form-input-mask.constants';

@Component({
  selector: 'data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  providers: [ComponentLibrary, HelperLibrary, StringLibrary, CamelCasePipe]
})
export class DataGridComponent implements IDataGridComponent, OnChanges {

  sortableDescription: string = 'Ordenar por ';
  actionsDefaultSize: number = 5;
  buttonActionsItens: ButtonItem[];
  isSingleClick: boolean = true;

  @Input('config') configuration: DataGridConfiguration = null;
  @Input('data') dataSource: any[] = [];
  @Input() searchCriteria: string = null;
  @Output() actionButtonClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowsSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() doubleClick: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private helperLibrary: HelperLibrary,
    private stringLibrary: StringLibrary,
    private camelCasePipe: CamelCasePipe
  ) { }

  //#region Lifecycle Hooks
  ngOnChanges(e: SimpleChanges) {
    if (e.configuration && e.configuration.firstChange) {
      this.initActions();
    }
  }
  //#endregion

  /** Retorna o dataSource em seu estado original ou então ordenado pelo campo informado. */
  getDataSource(column: DataGridColumn = null): any[] {
    if (column) { return this.sortData(column.field); }

    if (this.searchCriteria !== null) {
      return this.dataSource.filter(dataItem => {
        let result: boolean = false;

        this.configuration.columns.forEach((columnItem: DataGridColumn) => {
          if (!result) {
            result = dataItem[columnItem.field].toString().toLowerCase().indexOf(this.searchCriteria.toLowerCase()) > -1;
          }
        });

        return result;
      });
    } else {
      return this.dataSource;
    }
  }

  sortData(field: string): any[] {
    const asc = this.configuration.columns.find(a => a.field === field).params.sortDirectionAsc;
    this.configuration.columns.find(a => a.field === field).params.sortDirectionAsc = !asc;

    return this.dataSource.sort((a, b) => {
      if (a[field] < b[field]) { return asc ? -1 : 1; }
      if (a[field] > b[field]) { return asc ? 1 : -1; }

      return 0;
    });
  }

  getDataItemValue(fieldName: any, path: string): any {
    let value = this.helperLibrary.getPropertyValue(fieldName, path);
    const column: DataGridColumn = this.configuration.columns.find(a => a.field === fieldName);

    if (value) {

      switch (column.params.pipeFormatName) {
        case 'date-short': value = value ? this.formatDateShort(value) : null; break;
        case 'date': value = value ? this.formatDate(value) : null; break;
        case 'datetime':
          if (value) {
            const date = this.formatDate(value.split('T')[0]);
            const time = value.split('T')[1].split('.')[0];
            value = `${date} ${time}`;
          } else {
            value = null;
          }
          break;
        case 'cpf': value = this.stringLibrary.applyInputMask(value, MASK_CPF); break;
        case 'cnpj': value = this.stringLibrary.applyInputMask(value, MASK_CNPJ); break;
        case 'telefone':
          if (this.stringLibrary.cleanText(value).length === 11) {
            value = this.stringLibrary.applyInputMask(value, MASK_Celular);
          } else {
            value = this.stringLibrary.applyInputMask(value, MASK_TelefoneFixo);
          }
          break;
        case 'cep': value = this.stringLibrary.applyInputMask(value, MASK_CEP); break;
      }

    }

    if (this.configuration.useCamelCase && !column.params.ignoreCamelCase) { return this.camelCasePipe.transform(value, true); }
    return value;
  }

  //#region Private Methods
  /** Método responsável por inicializar SOMENTE as ações da Grid.
   * Todas as demais configurações são tratadas no template.
   */
  private initActions(): void {
    // Se for configurado que não haverá actions, então não tem o que configurar.
    if (!this.configuration.hasActions) { return; }

    this.createActionButton();
    this.createActions();
    this.resizeDataGrid();
  }

  private createActionButton(): void {
    if (!this.configuration.actions) {
      this.configuration.actions = new ButtonItem();
    }

    this.configuration.actions.inGrid = true;
    this.configuration.actions.pullRight = true;

    this.configuration.actions.tooltip = this.configuration.actions.tooltip === null ? 'Ações' : this.configuration.actions.tooltip;
    this.configuration.actions.icon = this.configuration.actions.icon === null ? 'fa-ellipsis-h' : this.configuration.actions.icon;
  }

  private createActions(): void {
    let customActions: ButtonItem[] = null;
    if (this.configuration.actions.itens && this.configuration.actions.itens.length > 0) {
      customActions = this.configuration.actions.itens;
    }

    if (this.configuration.useDefaultActions) {
      const btnActionAbrir = new ButtonItem();
      btnActionAbrir.label = 'Abrir',
        btnActionAbrir.icon = 'fa-pencil';
      btnActionAbrir.tag = 1;

      const btnActionExcluir = new ButtonItem();
      btnActionExcluir.label = 'Excluir',
        btnActionExcluir.icon = 'fa-trash';
      btnActionExcluir.tag = 9;

      this.configuration.actions.itens = [btnActionAbrir, btnActionExcluir];

      if (customActions !== null) {
        let position: number = 1;
        customActions.forEach(item => this.configuration.actions.itens.splice(position++, 0, item));
      }
    }
  }

  private resizeDataGrid(): void {
    let totalWidth: number = 0;

    this.configuration.columns.forEach(column => {
      if (column.width.indexOf('%') > -1) {
        totalWidth += parseFloat(column.width.toString().replace('%', ''));
      }
    });

    if (totalWidth === 100) {
      const width = this.configuration.columns[this.configuration.columns.length - 1].width;
      this.configuration.columns[this.configuration.columns.length - 1].width = `${(parseFloat(width) - this.actionsDefaultSize)}%`;
    }
  }

  private formatDateShort(value: any): string {
    const date = new Date(value);
    const dia: string = date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate();
    const mes: string = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1);
    return `${dia}/${mes}`;
  }

  private formatDate(value: any): string {
    const date = new Date(value);
    const dia: string = date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate();
    const mes: string = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1);
    const ano: number = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  onRowSelect_Click(e: any, dataItem: any): void {

    this.isSingleClick = true;
    setTimeout(() => {

      if (!this.isSingleClick) {
        return;
      }

      // TODO Esta lógica irá mudar no caso de multi-seleção.
      let target: any = null;
      switch (e.target.localName) {
        case 'span':
          target = e.target.parentNode.parentNode;
          break;

        case 'td':
          target = e.target.parentNode;
          break;

        case 'tr':
          target = e.target;
          break;
      }

      // Este if garante que se a linha que recebeu o clique for a que já está selecionada, então remove a seleção.
      if (target.classList.contains('selected')) {
        this.renderer.removeClass(target, 'selected');
        this.rowsSelected.emit(null);
        return;
      }

      const allSelecteds: any = this.elRef.nativeElement.querySelectorAll('tr.selected');
      allSelecteds.forEach(item => this.renderer.removeClass(item, 'selected'));

      this.renderer.addClass(target, 'selected');
      this.rowsSelected.emit(dataItem[this.configuration.fieldKey]);

    }, 200);
  }

  onRow_DoubleClick(e: any, dataItem: any): void {
    this.isSingleClick = false;
    this.doubleClick.emit(dataItem[this.configuration.fieldKey]);
  }
  //#endregion

  onActionButton_Click(e: ButtonItem, dataItem: any): void {
    this.actionButtonClick.emit({ buttonItem: e, dataItem: dataItem });
  }
}
