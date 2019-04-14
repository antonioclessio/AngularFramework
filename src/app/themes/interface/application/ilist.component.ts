import { IBaseComponent } from './../../../components/ibase.component';
import { EventEmitter } from '@angular/core';
import { DataGridConfiguration } from './../../../components/data-grid/data-grid.configuration';

/** @description Garante o comportamento necessário para todos os componentes
 * no projeto cliente com a função DataList. */
export interface IListComponent extends IBaseComponent {

  /** @description Contém as configurações gerais da grid */
  dataGridConfig: DataGridConfiguration;

  /** @description DataSource que irá alimentar a grid com base nas configurações definidas. */
  dataSourceGrid: any;

  /** @description Dados digitados no campo de pesquisa rápida */
  searchCriteria: string;

  /** @description Representa a key do registro selecionado em grid para manipulação. */
  selectedKey: EventEmitter<any>;

  /** @description Implementa a ação de duplo clique na grid. */
  doubleClick: EventEmitter<number>;

  /** @description Representa o botão clicado na grid para manipulação. */
  selectedAction: EventEmitter<any>;

  /** @description Método que irá alimentar as configurações. */
  dataGridConfiguration(): void;

  /** @description Método que irá carregar os dados providos do serviço (grid) */
  loadDataSource(): void;
}
