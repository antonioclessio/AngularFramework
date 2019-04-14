import { EventEmitter } from '@angular/core';

import { ButtonBarGroup } from '../../components/button-bar/button-bar.group';
import { ButtonItem } from '../../components/button/button.item';
import { IBaseComponent } from '../../components/ibase.component';

/** @description Interface contendo as ações compartilhadas entre o DataList
 * e o DataForm. */
export interface IThemeDataComponent extends IBaseComponent {

    /** @description Prefixo utilizado para identificar o componente com nomenclatura padrão. */
    prefix: string;
        /** @description Título do componente. */
    title: string;
    /** @description Nome do componente que será carregado no form */
    dataFormComponent: string;

    /** @description Grupos de botões com as ações padrão. */
    buttonBarGroup: ButtonBarGroup[];

    /** @description Grupos de botões customizados para a tela. */
    customButtonBarGroup: ButtonBarGroup[];

    /** @description API que será executada nas ações comuns HTTP (get, post, delete, etc) */
    apiAction: string;
    /** @description Representa a key do registro selecionado em grid para manipulação. */
    selectedKey: any;

    /** @description Clique em algum botão na barra de botões. */
    buttonBarClick: EventEmitter<ButtonItem>;

    /** @description Disparado quando o componente for fechado. */
    onCloseData: EventEmitter<any>;

    /** @description Método responsável por fechar o componente e que fará as verificações necessárias para tal. */
    closeData(): void;

    /** @description Configura o comportamento padrão da barra de botões.
    * Sugestão: Executar este método no construtor da classe. */
    configureButtonBarItens(): void;

    /** @description
     * Ação da buttonBar
     * @param e Instância da classe ButtonItem contendo os dados do botão que recebeu o clique.
     */
    onButtonBar_Click(e: ButtonItem): void;

}
