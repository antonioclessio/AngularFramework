import { EventEmitter } from '@angular/core';
import { IBaseComponent } from '../../components/ibase.component';

/** @description O componente que será carregado no header do tema deve implementar esta interface
 * para garantir a comunicação do componente com o tema. */
export interface IContextHeaderComponent extends IBaseComponent {

    /** @description Saída que garante a passagem de informação do header para o componente principal do tema */
    output: EventEmitter<any>;

}
