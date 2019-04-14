import { Injectable, Injector } from '@angular/core';

import { IToastService } from './itoast.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastService implements IToastService {

    private _toast: ToastrService;
    constructor(private injector: Injector) {
        this._toast = this.injector.get(ToastrService);
    }

    error(message: string): void {
        this._toast.error(message);
    }

    warning(message: string): void {
        this._toast.warning(message);
    }

    info(message: string): void {
        this._toast.info(message);
    }
    success(message: string): void {
        this._toast.success(message);
    }

}
