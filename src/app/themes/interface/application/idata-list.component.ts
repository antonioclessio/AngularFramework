import { ButtonItem } from './../../../components/button/button.item';
import { IDataComponent } from './idata.component';

/** @description Garante o comportamento necessário para todos os componentes
 * no projeto cliente com a função List. */
export interface IDataListComponent extends IDataComponent {

    /** @description Quando true, o dataForm é carregado logo ao iniciar o componente List. */
    startWithForm?: boolean;

}
