import { IBaseComponent } from './../ibase.component';

export interface IToastService extends IBaseComponent {

    error(message: string): void;
    warning(message: string): void;
    info(message: string): void;
    success(message: string): void;

}
