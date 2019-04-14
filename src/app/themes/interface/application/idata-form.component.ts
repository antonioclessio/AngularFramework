import { EventEmitter } from '@angular/core';

import { ButtonItem } from './../../../components/button/button.item';
import { IDataComponent } from './idata.component';

/** @description Garante o comportamento necessário para todos os componentes
 * no projeto cliente com a função Form. */
export interface IDataFormComponent extends IDataComponent {

    /** @description Determina se a tela utilizará o botão para fechar */
    useCloseButton?: boolean;

    /** @description Disparado quando o formulário for fechado. */
    onCloseData: EventEmitter<boolean>;

   /** @description Método responsável por fechar o formulário e que fará as verificações necessárias para tal. */
   closeData(reloadList: boolean): void;

}
