import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCase'
})
export class CamelCasePipe implements PipeTransform {

  excecoes: string[] = ['sim', 'não', 'dia', 'de', 'da', 'do', 'dos', 'das', 'já', 'em', 'e'];

  transform(value: any, ignoreSigla?:boolean, args?: any): any {
    if (!value || value == null || typeof value !== 'string') { return value; }

    const itens = value.split(' ');
    let fullName = '';

    itens.forEach(item => {
      if (ignoreSigla !== true && item.length <= 3 && !this.excecoes.find(a => a.toString().toLocaleLowerCase() === item.toString().toLocaleLowerCase())) {
        fullName += item + ' ';
      } else {
        fullName += item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase() + ' ';
      }
    });

    return fullName.substr(0, fullName.length - 1);
  }

}
