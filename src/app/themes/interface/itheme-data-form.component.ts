import { ComponentRef } from '@angular/core';

import { IThemeDataComponent } from './itheme-data.component';

/** @description Garante o comportamento do theme DataForm. */
export interface IThemeDataFormComponent extends IThemeDataComponent {

    /** @description  */
    useCloseButton: boolean;

    /** @description Instância do componente que será carregado. */
    componentRef: ComponentRef<any>;

    /** @description Método responsável por enviar o formulário e que fará as verificações necessárias para tal. */
    submitForm(): void;

}
