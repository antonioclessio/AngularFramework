import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bool'
})
export class BooleanTranslatePipe implements PipeTransform {
    transform(val) {
        switch (val) {
            case false: return 'Não';
            case true: return 'Sim';
            default: return val;
        }
    }
}
