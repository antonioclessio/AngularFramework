import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cep'
})
export class CepPipe implements PipeTransform {
    transform(val) {
        if (!val) { return null; }
        return val.substring(0, 5) + '-' + val.substring(5);
    }
}
