import { EventEmitter } from '@angular/core';

import { IApplicationComponent } from './application/iapplication.component';

/** @description Garante as definições necessárias para que o componente
 * inicial/principal da aplicação realize seu comportamento esperado. */
export interface IThemeComponent extends IApplicationComponent {

    /** @description Evento disparado no clique da opção "Sair" do menu de contexto do usuário. */
    logout: EventEmitter<any>;

}
