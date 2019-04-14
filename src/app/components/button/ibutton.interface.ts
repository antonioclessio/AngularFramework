import { EventEmitter } from '@angular/core';

import { IBaseComponent } from '../ibase.component';
import { ButtonItem } from './button.item';

export interface IButtonComponent extends IBaseComponent {

    /** @description
     * Caso o componente esteja sendo instanciado dinamicamente, a renderização do mesmo poderá ser controlada,
     * ativando esta flag, caso contrário a renderização ocorrerá na execução do ngOnInit()
     */
    manualRender: boolean;

    /** @description
     * Evento que é disparado no clique do botão. Os demais componentes que consomem o cl-button,
     * devem assinar este evento para interação.
     */
    buttonClick: EventEmitter<ButtonItem>;

    /** @description
     * Método responsável pela renderização do botão.
     */
    render(): void;

    /** @description
     * Método disparado no clique do botão.
     * @param e Instância do botão ButtonItem e que contém os dados do botão que recebeu o clique.
     */
    button_click(e: ButtonItem): void;

}
