import { ElementRef, EventEmitter } from '@angular/core';

import { ButtonItem } from '../button/button.item';
import { IBaseComponent } from '../ibase.component';
import { ButtonBarGroup } from './button-bar.group';

export interface IButtonBarComponent extends IBaseComponent {

    /** @description Evento que enviará as informações do botão que recebeu o clique. */
    buttonClick: EventEmitter<ButtonItem>;

    /** @description Renderiza a barra de botões. */
    render(e: ButtonBarGroup): ElementRef;

    /** @description Renderiza um grupo de botões. */
    renderGroup(e: ButtonBarGroup): ElementRef;

    /** @description Ação de clique do botão */
    button_click(e: ButtonItem): void;

}
