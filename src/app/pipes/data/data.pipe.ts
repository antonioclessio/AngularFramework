import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'data'
})
export class DataPipe implements PipeTransform {
    transform(val, hour: boolean = false, seconds: boolean = false) {
        if (!val) { return null; }

        if (val.toString().indexOf('/') === -1) {
            return new DatePipe('pt-BR').transform(val, hour ? (seconds ? 'dd/MM/yyyy hh:mm:ss' : 'dd/MM/yyyy hh:mm') : 'dd/MM/yyyy');
        }

        const data = val.split('/');
        if (hour) {
            const onLyData = val.split(' ')[0];
            const onlyHours = val.split(' ')[1].split(':');
            return new Date(parseInt(onLyData[2], null),
                            parseInt(onLyData[1], null) - 1,
                            parseInt(onLyData[0], null),
                            parseInt(onlyHours[0], null),
                            parseInt(onlyHours[1], null));
        } else {
            return new Date(parseInt(data[2], null), parseInt(data[1], null) - 1, parseInt(data[0], null));
        }
    }
}
