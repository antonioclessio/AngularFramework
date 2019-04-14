import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FilterMenuPipe } from './filter-menu/filter-menu.pipe';
import { FilterPipe } from './filter/filter.pipe';
import { CamelCasePipe } from './camel-case/camel-case.pipe';
import { BooleanTranslatePipe } from './boolean-translate/booleantranslate.pipe';
import { CepPipe } from './cep/cep.pipe';
import { CpfPipe } from './cpf/cpf.pipe';
import { CustomCurrencyPipe } from './custom-currency/customcurrency.pipe';
import { DataPipe } from './data/data.pipe';
import { DataFeriadoPipe } from './data-feriado/data-feriado.pipe';
import { DataSourceFilter } from './datasource-filter/datasource-filter.pipe';
import { MesPipe } from './mes/mes.pipe';
import { TelefonePipe } from './telefone/telefone.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FilterPipe,
    FilterMenuPipe,
    CamelCasePipe,
    BooleanTranslatePipe,
    CepPipe,
    CpfPipe,
    CustomCurrencyPipe,
    DataPipe,
    DataFeriadoPipe,
    DataSourceFilter,
    MesPipe,
    TelefonePipe,
    TruncatePipe
  ],
  exports: [
    FilterPipe,
    FilterMenuPipe,
    CamelCasePipe,
    BooleanTranslatePipe,
    CepPipe,
    CpfPipe,
    CustomCurrencyPipe,
    DataPipe,
    DataFeriadoPipe,
    DataSourceFilter,
    MesPipe,
    TelefonePipe,
    TruncatePipe
  ]
})
export class PipesModule { }
