import { ButtonItem } from '../button/button.item';

/** @description
 * Classe para configurar a barra de botões. A barra é configurada por um ou mais grupos de botões.
 */
export class ButtonBarGroup {

    /** @description Botões que compõe um grupo */
    itens: ButtonItem[];

    constructor(itens: ButtonItem[]) {
        this.itens = itens;
    }
}
