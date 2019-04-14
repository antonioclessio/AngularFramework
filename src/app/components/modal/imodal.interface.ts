import { EventEmitter, ComponentRef } from '@angular/core';

import { IBaseComponent } from '../ibase.component';
import { ButtonItem } from '../button/button.item';
import { ButtonBarGroup } from './../button-bar/button-bar.group';
import { ModalSizeEnum } from './modal-size.enum';

export interface IModalService extends IBaseComponent {

  /** @description Titulo da Modal */
  title: string;

  /** @description Mensagem de Confirmação */
  message: string;

  /** @description Texto do Botao de Confirmação */
  confirmButtonLabel: string;

  /** @description Texto do Botao de Cancelamento */
  cancelButtonLabel: string;

  /** @description Nome do Component anexado */
  componentName: string;

  /** @description DataSource do componente que será carregado pela propriedade componentName */
  componentDataSource: any;

  /** @description Define a largura do modal-dialog */
  modalSize: ModalSizeEnum;

  /** @description Instância do componente criado para ser exibido no corpo da modal */
  componentRef: ComponentRef<any>;

  /** @description Ações customizadas para a modal. */
  buttonBar: ButtonBarGroup[];

  /** @description Evento do botão */
  buttonClick: EventEmitter<ButtonItem>;

  /** @description Referência do componente criando com base na configuração componentName. */
  componentValue: EventEmitter<any>;

  /** @description Exibe a Modal */
  show(): void;

  /** @description Fecha a Modal */
  close(): void;

}
