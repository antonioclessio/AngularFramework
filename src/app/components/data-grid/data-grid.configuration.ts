import { ButtonItem } from '../button/button.item';
import { DataGridColumn } from './data-grid.column';

/** @description Configurações do DataGrid. */
export class DataGridConfiguration {

    /** @description Colunas que irão compor o DataGrid. */
    columns: DataGridColumn[] = [];

    /** @description Ações que serão disponibilizadas para cada dataRow no DataGrid. */
    actions: ButtonItem = null;

    /** @description Exibe ou não o botão de ações nos dataRow. */
    hasActions: boolean = true;

    /** @description Define se a lista terá ou não paginação. */
    hasPagination: boolean = false;

    /** @description Utiliza ou não as ações padrão no botão de ações do dataRow. */
    useDefaultActions: boolean = true;

    /** @description Nome do campo utilizado como PK */
    fieldKey: any;

    /** @description Formata o campo no padrão camel case */
    useCamelCase: boolean;

    constructor(
      columns: DataGridColumn[],
      fieldKey: string
    ) {
        this.columns = columns;
        this.fieldKey = fieldKey;
    }
}
