import { IBaseComponent } from './../../../components/ibase.component';
import { FormGroup } from '@angular/forms';

/** @description Garante o comportamento necessário para todos os componentes
 * no projeto cliente com a função DataForm. */
export interface IFormComponent extends IBaseComponent {

       /** @description Formulário manipulado pelo componente. */
    form: FormGroup;

    /** @description Configura o formulário reativo. Executar este método no construtor da classe. */
    createForm(): void;

    /** @description Método necessário quando for editar dados */
    formSetValue?(): void;
}
