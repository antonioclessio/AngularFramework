import { IBaseComponent } from './../../../components/ibase.component';
import { ButtonItem } from './../../../components/button/button.item';
import { ButtonBarGroup } from './../../../components/button-bar/button-bar.group';

/**
 * @description Interface com conceito abstrato contendo o que há de comum entre o DataList e o DataForm.
 */
export interface IDataComponent extends IBaseComponent {

    /** @description Código da aplicação */
    ApplicationID: number;

    /** @description Título do component. */
    title: string;

    /** @description Prefixo utilizado na identificação dos componentes com base na convenção de nomes. */
    prefix: string;

    /** @description Barra de botões com as ações padrão do componente. */
    buttonBar: ButtonBarGroup[];

    /** @description API que será executada nas ações comuns HTTP (get, post, delete, etc) */
    apiAction: string;

    /** @description Representa a key do registro selecionado em grid para manipulação. */
    selectedKey: any;

    /** @description
    * Método disparado no clique de cada botão da barra de botões.
    * @param e Instância da classe ButtonItem contendo os dados do botão que recebeu o clique.
    */
    buttonBar_Click?(e: ButtonItem): void;

    onFormLoaded?(): void;

}
