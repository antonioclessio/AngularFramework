import { IBaseComponent } from './../../../components/ibase.component';
import { MainMenuItem } from './../../../components/main-menu/main-menu.item';

export interface IApplicationComponent extends IBaseComponent {

    /** @description Título do sistema. */
    title: string;

    /** @description Logo a ser exibido no Header. */
    logo: string;

     /** @description Itens do menu de contexto do sistema */
    contextComponent: string;

    /** @description Itens do menu de contexto do usuário */
    userDropdownItens: MainMenuItem[];

    /** @description DataSource do menu que irá compor o sistema. */
    dataSourceMainMenu: MainMenuItem[];

}
