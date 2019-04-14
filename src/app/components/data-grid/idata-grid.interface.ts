import { ButtonItem } from '../button/button.item';
import { IBaseComponent } from '../ibase.component';
import { DataGridConfiguration } from './data-grid.configuration';

export interface IDataGridComponent extends IBaseComponent {

    /** @description Configurações gerais da grid. */
    configuration: DataGridConfiguration;

    /** @description Tamanho padrão para última coluna do componente */
    actionsDefaultSize: number;

    /** @description
     * Ação dos botões de Action da Grid
     * @param e Instância da classe ButtonItem contendo os dados do botão que recebeu o clique.
     * @param dataItem Item do dataSource correspondente à linha que contém o botão que recebeu o clique.
     */
    onActionButton_Click(e: ButtonItem, dataItem: any): void;

}
