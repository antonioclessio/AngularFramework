import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ComponentsModule } from '../../components/components.module';
import { DataFormComponent } from './data-form/full/data-form.component';
import { DataListComponent } from './data-list/data-list.component';
import { TabThemeComponent } from './tab-theme.component';
import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';
import { DataFormShortComponent } from './data-form/short/data-form-short.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    TabThemeComponent,
    DataListComponent,
    DataFormComponent,
    DataFormShortComponent,
    UserDropdownComponent
  ],
  exports: [
    TabThemeComponent,
    DataListComponent,
    DataFormComponent,
    DataFormShortComponent
  ]
})
export class TabThemeModule { }
