import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { PipesModule } from '../pipes/pipes.module';
import { CamelCasePipe } from '../pipes/camel-case/camel-case.pipe';

import { BackdropComponent } from './backdrop/backdrop.component';
import { ButtonBarComponent } from './button-bar/button-bar.component';
import { ButtonComponent } from './button/button.component';
import { ContentSwitchHComponent } from './content-switch-h/content-switch-h.component';
import { ContentSwitchComponent } from './content-switch/content-switch.component';
import { DataGridComponent } from './data-grid/data-grid.component';
import { DatePickerModule } from './date-picker/date-picker.module';
import { FormInputComponent } from './form-input/form-input.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { TabStripComponent } from './tab-strip/tab-strip.component';
import { ComponentLibrary } from './../common/library/component.library';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { AlertComponent } from './alert/alert.component';
import { ToastService } from './toast/toast.service';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DatePickerModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      enableHtml: true
    })
  ],
  declarations: [
    AutoCompleteComponent,
    MainMenuComponent,
    BackdropComponent,
    TabStripComponent,
    ButtonBarComponent,
    DataGridComponent,
    ButtonComponent,
    FormInputComponent,
    ContentSwitchComponent,
    ContentSwitchHComponent,
    LoginComponent,
    AlertComponent
  ],
  exports: [
    AutoCompleteComponent,
    MainMenuComponent,
    BackdropComponent,
    TabStripComponent,
    ButtonComponent,
    ButtonBarComponent,
    DataGridComponent,
    FormInputComponent,
    ContentSwitchComponent,
    ContentSwitchHComponent,
    LoginComponent,
    AlertComponent
  ],
  entryComponents: [
    ButtonComponent,
    BackdropComponent
  ],
  providers: [ComponentLibrary, CamelCasePipe, ToastService]
})
export class ComponentsModule { }
