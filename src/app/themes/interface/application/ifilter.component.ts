import { IBaseComponent } from './../../../components/ibase.component';
import { FormGroup } from '@angular/forms';

export interface IFilterComponent extends IBaseComponent {

  /** @description Formulário que contém os controles do componente */
  form: FormGroup;

  /** @description Método que cria o formulário do componente. */
  createForm(): void;
}
