import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cpf'
})
export class CpfPipe implements PipeTransform {
    transform(val, args) {
        if (!val) { return null; }
        return val.substring(0, 3) + '.' + val.substring(3, 6) + '.' + val.substring(6, 9) + '-' + val.substring(9, 11);
    }
}
