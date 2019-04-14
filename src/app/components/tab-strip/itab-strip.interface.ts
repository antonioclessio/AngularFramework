import { IBaseComponent } from '../ibase.component';
import { TabStripItem } from './tab-strip.item';

export interface ITabStripComponent extends IBaseComponent {

    /** @description
     * Usado para exibir a logo na empty text box.
     */
    logo: string;

    /** @description
     * Componente a ser carregado no momento em que não houver itens no dataSource
     */
    emptyComponent: string;

    /** @description
     * Propriedade para gerenciar a instância do componente que será tratado no momento (criar, excluir).
     */
    currentItem: TabStripItem;

    /**
     * @description Método responsável em adicionar um item no container de tabs.
     * @param item Instância da classe TabStripItem
     */
    addItem(item: TabStripItem): void;

    /** @description
     * Método responsável por remover um item da lista.
     * @param item Instância da classe TabStripItem
     */
    removeItem(item: TabStripItem): void;

    /** @description Limpa todos os itens do tabStrip. */
    clearItens(): void;

}
