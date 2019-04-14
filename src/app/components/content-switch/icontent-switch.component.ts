import { EventEmitter } from '@angular/core';
import { IBaseComponent } from '../ibase.component';
import { ContentSwitchItem } from './content-switch-item.component';

export interface IContentSwitchComponent extends IBaseComponent {

    /** @description Evento disparado na troca de itens */
    select: EventEmitter<ContentSwitchItem>;

    /** @description Método que executa o switch dos containeres de informações. */
    switchItem(e: ContentSwitchItem): void;
}
