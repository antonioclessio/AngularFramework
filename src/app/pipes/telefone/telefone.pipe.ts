import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'telefone'
})
export class TelefonePipe implements PipeTransform {
    transform(val, args) {
        if (!val) { return; }
        if (val.toString().length === 8) {
            return val.toString().substring(0, 4) + '-' + val.toString().substring(4);
        }

        if (val.toString().length === 9) {
            return val.toString().substring(0, 5) + '-' + val.toString().substring(5);
        }

        if (val.toString().length === 10) {
            return '(' + val.toString().substring(0, 2) + ') ' + val.toString().substring(2, 6) + '-' + val.toString().substring(6);
        }
        if (val.toString().length === 11) {
            return '(' + val.toString().substring(0, 2) + ') ' + val.toString().substring(2, 7) + '-' + val.toString().substring(7);
        }

        return null;
    }
}
