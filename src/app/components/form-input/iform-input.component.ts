import { EventEmitter } from '@angular/core';
import { IBaseComponent } from '../ibase.component';

/** @description Interface responsável por todos os form inputs gerenciados pela biblioteca. */
export interface IFormInputComponent extends IBaseComponent {

    useGroup: boolean;

    /** @description Nome do input */
    name: string;

    /** @description Nome do grupo no qual o controle faz parte. */
    groupName: string;

    /** @description Label do input */
    label: string;

    /** @description HTML Id para interação de DOM */
    clientId: string;

    /** @description Placeholder padrão */
    placeholder: string;

    /** @description Mensagem explicativa do input */
    helpText: string;

    /** @description Configura se o compontente receberá o foco inicial ao carregar o formulário */
    focus: boolean;

    /** @description Tipo do input que será renderizado */
    type: string;

    /** @description No caso do type ser dropdown, é necessário ter uma lista de dados que irá alimentar o input */
    listItens: any[];

    /** @description Se for passado dados para o listItens, deve ser informado qual o campo que será usado para exibir no input */
    textField: string;

    /** @description
     * Se for passado dados para o listItens, deve ser informado qual o campo que será usado para manipular o valor do input
     * */
    valueField: string;

    /** @description Valor do componente. */
    value: any;

    /** @description Determina o estado de ativo / inativo do componente. */
    disabled: boolean;

    /** @description Propriedade específica para o tipo date, onde renderiza um calendário sem ser com dropdown. */
    inline: string;

    /** @description Válido somente no caso de tipo date */
    editableField: string;

    /** @description Evento disparado no momento que o valor sofre alteração */
    valueChange: EventEmitter<any>;

    /** @description Evento disparado ao término da renderização do controle */
    afterLoadControl: EventEmitter<any>;

    /** @description Evento disparado ao término da execução do método que renderiza os itens do dropdown */
    afterLoadDropdownItens: EventEmitter<any>;

    /** @description Esta configuração somente é utilizada em caso do type ser textarea */
    rows: number;

    /** @description Renderiza o controle no formulário */
    render(): void;
}
