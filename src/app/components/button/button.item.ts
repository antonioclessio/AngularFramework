import { ButtonSize } from './button-size.enum';
import { BtnLight, BtnOutline_Primary } from './button-type.class';
import { ButtonTypeEnum } from './button-type.enum';

/** @description Determina o comportamento do botão da aplicação. */
export class ButtonItem {

    /** @description Define o item como um header, de acordo com a documentação do bootstrap.
     * Use a propriedade "Label" para que seja renderizado no header.
     */
    isHeader: boolean;

    /** @description Define o item como um divider, de acordo com a documentação do bootstrap */
    isDivider: boolean;

    /** @description Icone que será exibido no botão. Esta opção é opcional. */
    icon: string = null;

    /** @description Label exibido no botão. Esta opçaõ é opcional. */
    label: string = null;

    /** @description Com base nos tipos pré-determinados, define o tipo do botão que será renderiado. */
    type: ButtonTypeEnum = ButtonTypeEnum.Default;

    /** @description Identificação HTML do elemento. Atributo ID. */
    clientId: string = null;

    /** @description Tag que auxilia na identificação do botão no caso de alguma ação disparada. */
    tag: number = null;

    /** @description Tooltip padrão */
    tooltip: string = null;

    /** @description Nome da classe que determina o visual do botão. Contém valor default. */
    className: string = null;

    /** @description No caso de um botão do tipo Dropdown, os itens do dropdown devem ser configurados nesta opçaõ. */
    itens: ButtonItem[] = null;

    /** @description Tamanho do botão. Valor padrão: Small. */
    size: ButtonSize = ButtonSize.Small;

    /** @description Posiciona o botão no lado direito. */
    pullRight: boolean = false;

    /** @description Deve ser informado como true se o botão for renderizado em uma grid. */
    inGrid: boolean = false;

     /** @description Caso o componente esteja sendo utilizado como SplitButton, esta opção dever ser true */
    split: boolean;

    /** @description Define se o botão estará desabilitado para clique */
    disabled: boolean;

    private defaultClass = BtnLight;

    constructor(type: ButtonTypeEnum = ButtonTypeEnum.Default) {
        this.type = type;

        switch (type) {
            case ButtonTypeEnum.Close:
                this.icon = 'fa-times';
                this.label = 'Fechar';
                this.clientId = 'btnClose';
                this.tooltip = 'Fechar';
                this.className = this.defaultClass;
            break;
            case ButtonTypeEnum.New:
                this.label = 'Novo';
                this.icon = 'fa-plus';
                this.clientId = 'btnNew';
                this.tooltip = 'Novo registro';
                this.className = this.defaultClass;
            break;
            case ButtonTypeEnum.Edit:
                this.label = 'Editar';
                this.icon = 'fa-pencil';
                this.clientId = 'btnEdit';
                this.tooltip = 'Editar registro selecionado';
                this.className = this.defaultClass;
            break;
            case ButtonTypeEnum.Delete:
                this.icon = 'fa-trash';
                this.clientId = 'btnDelete';
                this.tooltip = 'Remove o registro selecionado';
                this.className = this.defaultClass;
            break;
            case ButtonTypeEnum.Search:
                this.label = 'Pesquisar';
                this.icon = 'fa-search';
                this.clientId = 'btnSearch';
                this.tooltip = 'Abre o formulário de pesquisa';
                this.className = this.defaultClass;
            break;
            case ButtonTypeEnum.Save:
                this.label = 'Salvar';
                this.icon = 'fa-floppy-o';
                this.clientId = 'btnSave';
                this.tooltip = 'Salvar formulário';
                this.className = BtnOutline_Primary;
            break;
            case ButtonTypeEnum.Refresh:
                this.label = 'Limpar filtro';
                this.icon = 'fa-refresh';
                this.clientId = 'btnClearFilter';
                this.tooltip = 'Limpa a pesquisa realizada exibindo a grid em seu estado inicial';
                this.className = this.defaultClass;
            break;
            default:
                this.className = this.defaultClass;
            break;
        }
    }
}
