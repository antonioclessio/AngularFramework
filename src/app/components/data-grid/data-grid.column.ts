/** @description Configurações de uma coluna do DataGrid. */
export class DataGridColumn {

    /** @description Título da coluna */
    label: string = null;

    /** @description Tamanho da coluna, podendo ser informada tanto em percentual quanto em pixels. */
    width: string = null;

    /** @description Campo do dataSource que será realizado o binding. */
    field: string = null;

    /** @description Parâmetros adicionais às colunas */
    params: IDataGridColumnParams;

    constructor(
        label: string,
        width: string,
        field: string,
        params: IDataGridColumnParams = null
    ) {
        this.label = label;
        this.width = width;
        this.field = field;
        this.params = params ? params : {};
    }
}


export interface IDataGridColumnParams {
    /** @description Habilita a ordenação na coluna */
    sortable?: boolean;

    /** @description Direcionamento da ordenação. Default: true */
    sortDirectionAsc?: boolean;

    /** @description Determina o nome do tipo por exemplo Date, Time, currency, etc */
    pipeFormatName?: string;

    /** @description Quando a configuração de camel case está sendo utilizada, esta configuração cria exceções para as colunas */
    ignoreCamelCase?: boolean;
}
