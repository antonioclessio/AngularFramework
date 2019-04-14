import { StringLibrary } from './../../common/library/string.library';

export class ContentSwitchItem {

    /** Título do item na navegação */
    label: string;

    /** Referência ao container que será aberto quando o item receberá o clique */
    target: string;

    /** Define se o item será o primeiro a ser exibido quando o componente for carregado */
    active: boolean;

    /** Client ID padrão. Propriedade ID do elemento HTML */
    clientId: string;

    constructor(label: string, target: string, active: boolean = false) {
        const stringLibrary = new StringLibrary();

        this.label = label;
        this.target = target;
        this.active = active;

        this.clientId = stringLibrary.cleanText(label) + '_' + new Date().getMilliseconds();
    }
}
