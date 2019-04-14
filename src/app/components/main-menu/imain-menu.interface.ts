import { IBaseComponent } from '../ibase.component';
import { MainMenuItem } from './main-menu.item';

export interface IMainMenuComponent extends IBaseComponent {
    /** @description
     * Método responsável por abrir ou fechar o menu.
     */
    toggleMenu(): void;

    /** @description
     * Método responsável por exibir ou esconder os itens de algum menu.
     * @param e Evento padrão Angular contendo as informações do clique.
     */
    toggleItens(e: MouseEvent): void;

    /** @description
     * Método disparado quando o usuário escolhe algum item do menu.
     * @param e Instância da classe MainMenuItem contendo os dados do item de menu que recebeu o clique.
     */
    menuItem_Clicked(e: MainMenuItem): void;
}
