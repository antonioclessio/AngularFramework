import { ComponentRef } from '@angular/core';

import { IThemeDataComponent } from './itheme-data.component';

/** @description Garante o comportamento do theme DataList. */
export interface IThemeDataListComponent extends IThemeDataComponent {

    /** @description Nome do componente que será carregado na lista de dados */
    listComponent: string;

    /** @description Instância do componente que será carregado. */
    componentRef: ComponentRef<any>;

    /** @description Define se será utilizado o FormShort. */
    useFormShort: boolean;

    /** @description Quando verdadeiro, ao carregar o dataList, o dataForm já será carregado. */
    startWithForm: boolean;

    /** @description Define se será utilizado o detalhamento fixado . */
    detailPinned: boolean
    

    /** @description Carrega o componente correspondente com base na convenção de nomes. */
    loadDataListView(): ComponentRef<any>;

    /** @description Carrega o componente correspondente com base na convenção de nomes. */
    loadDataDetailView(): ComponentRef<any>;

    /** @description Carreag o componente correspondente com base na convenção de nomes. */
    loadDataFilterView(): ComponentRef<any>;

    /** @description Carrega o componente correspondente com base na convenção de nomes. */
    loadDataFormView(loadDataSource: boolean): ComponentRef<any>;

}
