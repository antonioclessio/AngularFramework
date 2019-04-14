import {
  Component, ComponentRef, ElementRef, forwardRef, Input, OnInit, Renderer2,
  ViewContainerRef, OnChanges, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ComponentLibrary } from './../../common/library/component.library';
import { IFormInputComponent } from './iform-input.component';
import { StringLibrary } from './../../common/library/string.library';
import { CamelCasePipe } from '../../pipes/camel-case/camel-case.pipe';
import {
  MASK_Celular,
  MASK_TelefoneFixo,
  MASK_Celular_Regex,
  MASK_TelefoneFixo_Regex,
  MASK_CPF,
  MASK_CPF_Regex,
  MASK_CNPJ,
  MASK_CNPJ_Regex,
  MASK_CEP,
  MASK_CEP_Regex,
  MASK_Time,
  MASK_Time_Short_Regex,
  MASK_Time_Regex,
  MASK_Time_Short
} from './form-input-mask.constants';

@Component({
  selector: 'cl-input',
  template: '',
  styleUrls: ['./form-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormInputComponent),
    multi: true
  }, ComponentLibrary, StringLibrary, CamelCasePipe]
})
export class FormInputComponent implements IFormInputComponent, ControlValueAccessor, OnInit, OnChanges {

  @Input() useGroup: boolean = true;
  @Input() label: string;
  @Input() type: string;
  @Input('id') clientId: string;
  @Input() placeholder: string = '';
  @Input() helpText: string = null;
  @Input() focus: boolean;
  @Input() listItens: any[] = null;
  @Input() textField: string = null;
  @Input() valueField: string = null;
  @Input() value: any = null;
  @Input() groupName: string = null;
  @Input() disabled: boolean = false;
  @Input() inline: string = null;
  @Input() editableField: string = 'true';
  @Input() rows: number = 5;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterLoadControl: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterLoadDropdownItens: EventEmitter<any> = new EventEmitter<any>();

  inputElement: ElementRef<any> = null;

  name: string;

  private inputNameSpace: string = null;
  private datePickerComponentRef: ComponentRef<any> = null;

  constructor(
    private renderer: Renderer2,
    private componentLibrary: ComponentLibrary,
    private stringLibrary: StringLibrary,
    private vcRef: ViewContainerRef,
    private elRef: ElementRef,
    private camelCasePipe: CamelCasePipe
  ) { }

  ngOnInit(): void {
    this.render();
  }

  ngOnChanges(e: SimpleChanges): void {
    if (e.listItens) {
      this.renderDropdown_Itens();
    }

    if (e.value && e.value.firstChange === false) {
      this.setValue();
    }
  }

  //#region >> Interface ControlValueAccessor
  writeValue = (value: any): void => {
    this.value = value;
    if (this.value) { this.setValue(); }
  }

  propagateChange = (_: any) => {
    this.valueChange.emit(this.value);
  }
  registerOnChange = (fn: (value: any) => void): void => {
    this.propagateChange = fn;
  }
  registerOnTouched = (fn: any): void => { };

  setDisabledState(isDisabled: boolean): void {
    const control: ElementRef = this.getControl();
    if (isDisabled) {
      this.renderer.setAttribute(control, 'disabled', null);
    } else {
      this.renderer.removeAttribute(control, 'disabled');
    }
  }
  //#endregion

  //#region >> Renderização
  render(): void {
    const formControlName = this.elRef.nativeElement.attributes['formControlName'];
    this.name = formControlName ? formControlName.value : `clInput_${new Date().getMilliseconds()}`;
    if ((this.groupName && this.name !== null) || (this.name && this.groupName !== null)) {
      this.inputNameSpace = this.groupName + '.' + this.name;
    } else {
      this.inputNameSpace = this.name;
    }

    let control: ElementRef = null;
    switch (this.type) {
      case 'phone': control = this.renderTelefoneInput(); break;
      case 'cpf': control = this.renderCpfInput(); break;
      case 'cnpj': control = this.renderCnpjInput(); break;
      case 'cep': control = this.renderCEPInput(); break;
      case 'time': control = this.renderTimeInput(); break;
      case 'url':
      case 'text': control = this.renderInput(); break;
      case 'color': control = this.renderColorInput(); break;
      case 'number': control = this.renderInput(); break;
      case 'email': control = this.renderInput(); break;
      case 'password': control = this.renderInput(); break;
      case 'date':
      case 'datetime': control = this.renderDatePicker(); break;
      case 'dropdown': control = this.renderDropdown(); break;
      case 'checkbox': control = this.renderCheckboxRadio('checkbox'); break;
      case 'radio': control = this.renderCheckboxRadio('radio'); break;
      case 'textarea': control = this.renderTextarea(); break;
    }

    if (!this.useGroup) {
      this.renderer.addClass(control, 'no-group');
      this.renderer.appendChild(this.elRef.nativeElement, control);
    } else {
      const group = this.renderGroup();
      this.renderer.appendChild(group, control);

      this.renderer.appendChild(group, this.renderValidation());

      if (this.helpText !== null && this.helpText.length > 0) {
        this.renderer.appendChild(group, this.renderHelpText());
      }

      this.renderer.appendChild(this.elRef.nativeElement, group);
    }

    this.afterLoadControl.emit();
  }

  /** @description Renderiza o grupo padrão para quase todos os controles. */
  private renderGroup(): ElementRef {
    const element = this.renderer.createElement('DIV');
    this.renderer.addClass(element, 'form-group');

    if (this.label !== null && this.label !== undefined) {
      const label = this.renderer.createElement('LABEL');
      this.renderer.setAttribute(label, 'for', this.clientId ? this.clientId : this.stringLibrary.cleanText(this.name));
      label.innerHTML = this.label;

      this.renderer.appendChild(element, label);
    }

    return element;
  }

  /** @description Renderiza o HelpText. */
  private renderHelpText(): ElementRef {
    const element = this.renderer.createElement('SMALL');
    this.renderer.addClass(element, 'text-muted');
    this.renderer.addClass(element, 'form-text');
    this.renderer.setAttribute(element, 'id', `${this.clientId ? this.clientId : this.stringLibrary.cleanText(this.name)}Help`);
    element.innerHTML = this.helpText;

    return element;
  }

  /** @description Renderiza as configurações padrões para todos os form-inputs. */
  private renderInputBase(type: string, event: string): ElementRef {
    const element = this.renderer.createElement(type);
    this.renderer.addClass(element, 'form-control-sm');
    this.renderer.addClass(element, 'form-control');
    this.renderer.setAttribute(element, 'data-form', this.inputNameSpace);
    this.renderer.setAttribute(element, 'name', this.name);
    this.renderer.setAttribute(element, 'id', this.clientId ? this.clientId : this.stringLibrary.cleanText(this.name));
    this.renderer.setAttribute(element, 'aria-describedby',
      `${this.clientId ? this.clientId : this.stringLibrary.cleanText(this.name)}Help`);

    if (this.disabled) {
      this.renderer.setAttribute(element, 'disabled', this.disabled.toString());
    }

    if (this.value !== null) {
      this.renderer.setAttribute(element, 'value', this.value);
    }

    if (this.focus) { this.renderer.setAttribute(element, 'autofocus', null); }
    this.renderer.listen(element, event, _ => {
      this.value = (element as any).value;
      this.propagateChange(this.value);
    });
    this.renderer.listen(element, 'change', _ => {
      this.renderer.removeClass(element, 'is-invalid');
    });

    this.inputElement = element;
    return element;
  }

  /** @description Renderiza os inputs básicos e de características semelhantes: text, number, e-mail */
  private renderInput(): ElementRef {
    const element = this.renderInputBase('INPUT', 'keyup');
    this.renderer.setAttribute(element, 'type', this.type);
    this.renderer.setValue(element, this.value);

    if (this.type === 'email') {
      this.placeholder = 'usuario@dominio.com';
    }

    if (this.placeholder && this.placeholder.length > 0) { this.renderer.setAttribute(element, 'placeholder', this.placeholder); }
    if (!this.useGroup) { return element; }

    return element;
  }

  /** Renderização de um text-area */
  private renderTextarea(): ElementRef {
    const element = this.renderInputBase('TEXTAREA', 'keyup');
    this.renderer.setAttribute(element, 'rows', this.rows.toString());
    this.renderer.setValue(element, this.value);

    if (this.placeholder && this.placeholder.length > 0) { this.renderer.setAttribute(element, 'placeholder', this.placeholder); }
    if (!this.useGroup) { return element; }

    return element;
  }

  private renderColorInput(): ElementRef {
    const element = this.renderInputBase('INPUT', 'change');
    this.renderer.setAttribute(element, 'type', this.type);
    this.renderer.setValue(element, this.value);

    if (!this.useGroup) { return element; }

    return element;
  }

  /** @description Renderiza os DropDowns */
  private renderDropdown(): ElementRef {
    this.inputElement = this.renderInputBase('SELECT', 'change');
    this.renderer.setAttribute(this.inputElement, 'data-form', this.inputNameSpace);

    if (this.placeholder && this.placeholder.length > 0) {
      const firstOption = this.renderer.createElement('OPTION');
      firstOption.innerHTML = this.placeholder;

      this.renderer.appendChild(this.inputElement, firstOption);
    }

    this.renderDropdown_Itens();

    return this.inputElement;
  }

  /** @description Renderiza apenas os itens do dropdown.
   * Está em um método separado pois a renderização dos itens podem ocorrer em mais de um momento */
  private renderDropdown_Itens(): void {
    if (!this.inputElement || !this.listItens) { return; }

    this.listItens.forEach(item => {
      const option = this.renderer.createElement('OPTION');
      this.renderer.setAttribute(option, 'value', item[this.valueField]);
      option.innerHTML = this.camelCasePipe.transform(item[this.textField]);

      this.renderer.appendChild(this.inputElement, option);
    });

    this.afterLoadDropdownItens.emit();
  }

  /** @description Renderiza os DatePickers */
  private renderDatePicker(): ElementRef {
    const inline: boolean = this.inline === 'true' ? true : false;
    const editable: boolean = this.editableField === 'true' ? true : false;

    this.datePickerComponentRef = this.componentLibrary.createComponentInstance('DatePickerComponent', this.vcRef);
    this.datePickerComponentRef.instance.locale = 'pt-br';
    this.datePickerComponentRef.instance.name = this.inputNameSpace;
    this.datePickerComponentRef.instance.opts.inline = inline;
    this.datePickerComponentRef.instance.opts.editableDateField = editable;
    this.datePickerComponentRef.instance.elementLoaded.subscribe(_ => {
      this.datePickerComponentRef.instance.setValidation(this.renderValidation());
    });

    this.datePickerComponentRef.instance.setLocaleOptions();
    this.datePickerComponentRef.instance.setOptions();

    this.datePickerComponentRef.instance.dateChanged.subscribe(response => {
      this.value = response;
      this.propagateChange(response);
    });

    return this.datePickerComponentRef.instance.elem.nativeElement;
  }

  /** @description Renderiza checkbox */
  private renderCheckboxRadio(type: string): ElementRef {
    const input = this.renderer.createElement('INPUT');
    this.renderer.addClass(input, 'form-check-input');
    this.renderer.setAttribute(input, 'name', this.name);
    this.renderer.setAttribute(input, 'data-form', this.inputNameSpace);
    this.renderer.setAttribute(input, 'type', type);
    this.renderer.setAttribute(input, 'id', this.clientId ? this.clientId : this.stringLibrary.cleanText(this.name));
    this.renderer.listen(input, 'click', _ => {
      this.renderer.removeClass(input, 'is-invalid');
      if (type === 'checkbox') {
        this.value = input.checked;
        this.propagateChange(input.checked);
      } else {
        this.value = input.value;
        this.propagateChange(input.value);
      }
    });

    if (this.value !== null) {
      this.renderer.setAttribute(input, 'value', this.value);
    }

    const label = this.renderer.createElement('LABEL');
    this.renderer.addClass(label, 'form-check-label');
    this.renderer.setAttribute(label, 'for', this.clientId ? this.clientId : this.stringLibrary.cleanText(this.name));
    label.innerHTML = this.label;

    return input;
  }

  /** @description Renderiza o input com todas as caracteristicas para Telefone */
  private renderTelefoneInput(): ElementRef {
    const element = this.renderInputBase('INPUT', 'keyup');
    this.renderer.setAttribute(element, 'type', 'text');
    this.renderer.setAttribute(element, 'placeholder', '(00) 00000-0000');
    this.renderer.setValue(element, this.value);

    this.renderer.listen(element, 'keyup', (response: KeyboardEvent) => {
      const target = response.target as any;

      if (!target.value || target.value.length === 0) {
        this.renderer.removeClass(target, 'is-invalid');
      } else {
        if (this.stringLibrary.cleanText(target.value).length < 11) {
          target.value = this.stringLibrary.applyInputMask(target.value, MASK_TelefoneFixo);
        } else {
          target.value = this.stringLibrary.applyInputMask(target.value, MASK_Celular);
        }

      }
    });

    this.renderer.listen(element, 'change', (response: KeyboardEvent) => {
      const target = response.target as any;
      const regCelular: RegExp = new RegExp(MASK_Celular_Regex);
      const regFixo: RegExp = new RegExp(MASK_TelefoneFixo_Regex);

      if (!regCelular.test(target.value) && !regFixo.test(target.value)) {
        this.renderer.addClass(target, 'is-invalid');
        target.parentElement.querySelector('.invalid-tooltip').innerText = 'Telefone inválido';
      }
    });

    return element;
  }

  /** @description Renderiza o input com todas as caracteristicas para CPF */
  private renderCpfInput(): ElementRef {
    const element = this.renderInputBase('INPUT', 'keyup');
    this.renderer.setAttribute(element, 'type', 'text');
    this.renderer.setAttribute(element, 'placeholder', '000.000.000-00');
    this.renderer.setValue(element, this.value);
    this.renderer.addClass(element, 'input-align-right');

    this.renderer.listen(element, 'keyup', (response: KeyboardEvent) => {
      const target = response.target as any;

      if (!target.value || target.value.length === 0) {
        this.renderer.removeClass(target, 'is-invalid');
      } else {
        target.value = this.stringLibrary.applyInputMask(target.value, MASK_CPF);
      }
    });

    this.renderer.listen(element, 'change', (response: KeyboardEvent) => {
      const target = response.target as any;
      const reg: RegExp = new RegExp(MASK_CPF_Regex);

      if (!reg.test(target.value) && !this.stringLibrary.validarCPF(target.value)) {
        this.renderer.addClass(target, 'is-invalid');
        target.parentElement.querySelector('.invalid-tooltip').innerText = 'CPF inválido';
      }
    });

    return element;
  }

  /** @description Renderiza o input com todas as caracteristicas para CNPJ */
  private renderCnpjInput(): ElementRef {
    const element = this.renderInputBase('INPUT', 'keyup');
    this.renderer.setAttribute(element, 'type', 'text');
    this.renderer.setAttribute(element, 'placeholder', '00.000.000/0000-00');
    this.renderer.setValue(element, this.value);
    this.renderer.addClass(element, 'input-align-right');

    this.renderer.listen(element, 'keyup', (response: KeyboardEvent) => {
      const target = response.target as any;

      if (!target.value || target.value.length === 0) {
        this.renderer.removeClass(target, 'is-invalid');
      } else {
        target.value = this.stringLibrary.applyInputMask(target.value, MASK_CNPJ);
      }
    });

    this.renderer.listen(element, 'change', (response: KeyboardEvent) => {
      const target = response.target as any;
      const reg: RegExp = new RegExp(MASK_CNPJ_Regex);

      if (!reg.test(target.value) && !this.stringLibrary.validarCNPJ(target.value)) {
        this.renderer.addClass(target, 'is-invalid');
        target.parentElement.querySelector('.invalid-tooltip').innerText = 'CNPJ inválido';
      }
    });

    return element;
  }

  /** @description Renderiza o input com todas as caracteristicas para CEP */
  private renderCEPInput(): ElementRef {
    const element = this.renderInputBase('INPUT', 'keyup');
    this.renderer.setAttribute(element, 'type', 'text');
    this.renderer.setAttribute(element, 'placeholder', '00000-000');
    this.renderer.setValue(element, this.value);
    this.renderer.addClass(element, 'input-align-right');

    this.renderer.listen(element, 'keyup', (response: KeyboardEvent) => {
      const target = response.target as any;

      if (!target.value || target.value.length === 0) {
        this.renderer.removeClass(target, 'is-invalid');
      } else {
        target.value = this.stringLibrary.applyInputMask(target.value, MASK_CEP);
      }
    });

    this.renderer.listen(element, 'change', (response: KeyboardEvent) => {
      const target = response.target as any;
      const reg: RegExp = new RegExp(MASK_CEP_Regex);

      if (!reg.test(target.value) && !this.stringLibrary.validarCNPJ(target.value)) {
        this.renderer.addClass(target, 'is-invalid');
        target.parentElement.querySelector('.invalid-tooltip').innerText = 'CEP inválido';
      }
    });

    return element;
  }

  /** @description Renderiza o input com todas as caracteristicas para CEP */
  private renderTimeInput(): ElementRef {
    const element = this.renderInputBase('INPUT', 'keyup');
    this.renderer.setAttribute(element, 'type', 'text');
    this.renderer.setAttribute(element, 'placeholder', '00:00:00');
    this.renderer.setValue(element, this.value);
    this.renderer.addClass(element, 'input-align-right');

    this.renderer.listen(element, 'keyup', (response: KeyboardEvent) => {
      const target = response.target as any;

      if (!target.value || target.value.length === 0) {
        this.renderer.removeClass(target, 'is-invalid');
      } else {
        target.value = this.stringLibrary.applyInputMask(target.value, MASK_Time);
      }
    });

    this.renderer.listen(element, 'change', (response: KeyboardEvent) => {
      const target = response.target as any;
      const reg: RegExp = new RegExp(MASK_Time_Short_Regex);
      const regSegundos: RegExp = new RegExp(MASK_Time_Regex);

      if (this.stringLibrary.cleanText(target.value).length === 4) {
        if (!reg.test(target.value) || !this.stringLibrary.validarHora(target.value)) {
          this.renderer.addClass(target, 'is-invalid');
          const targetMessage = target.parentElement.querySelector('.invalid-tooltip');
          if (targetMessage) { targetMessage.innerText = 'Hora inválida'; }
        }
      } else {
        if (!regSegundos.test(target.value) || !this.stringLibrary.validarHora(target.value)) {
          this.renderer.addClass(target, 'is-invalid');
          const targetMessage = target.parentElement.querySelector('.invalid-tooltip');
          if (targetMessage) { targetMessage.innerText = 'Hora inválida'; }
        }
      }
    });

    return element;
  }

  /** @description Renderiza a estrutura necessária para a validação */
  private renderValidation(): ElementRef {
    const divElement = this.renderer.createElement('DIV');
    this.renderer.addClass(divElement, 'invalid-tooltip');
    this.renderer.setAttribute(divElement, 'data-form-message', this.inputNameSpace);

    return divElement;
  }

  /** @description Com base no input criado, o valor é setado. */
  private setValue(): void {
    let control: any = null;

    switch (this.type) {
      case 'text':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.value);
        break;

      case 'number':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.value);
        break;

      case 'email':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.value);
        break;

      case 'phone':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.stringLibrary.applyInputMask(this.value,
          this.value.toString().length === 11 ? MASK_Celular : MASK_TelefoneFixo));
        break;

      case 'cpf':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.stringLibrary.applyInputMask(this.value, MASK_CPF));
        break;

      case 'cnpj':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.stringLibrary.applyInputMask(this.value, MASK_CNPJ));
        break;

      case 'url':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.value);
        break;

      case 'cep':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.stringLibrary.applyInputMask(this.value, MASK_CEP));
        break;

      case 'color':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.value);
        break;

      case 'time':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'value', this.stringLibrary.applyInputMask(this.value,
          this.value.toString().length === 4 ? MASK_Time_Short : MASK_Time));
        break;

      case 'textarea':
        control = this.elRef.nativeElement.querySelector('textarea');
        control.innerText = this.value;
        break;

      case 'date':
      case 'datetime':
        control = this.elRef.nativeElement.querySelector('date-picker');
        this.datePickerComponentRef.instance.onUserDateInput(this.value.toString());
        break;

      case 'dropdown':
        const selectedOption = this.elRef.nativeElement.querySelector('select>option[selected="true"]');
        if (selectedOption) { this.renderer.removeAttribute(selectedOption, 'selected'); }

        control = this.elRef.nativeElement.querySelector(`select>option[value="${this.value}"]`);
        if (control) { this.renderer.setAttribute(control, 'selected', 'true'); }
        break;

      case 'checkbox':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'checked', this.value);
        break;

      case 'radio':
        control = this.elRef.nativeElement.querySelector('input');
        this.renderer.setAttribute(control, 'checked', (this.value === control.value).toString());
        break;
    }
  }

  private getControl(): ElementRef {
    switch (this.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'phone':
      case 'cpf':
      case 'cnpj':
      case 'url':
      case 'cep':
      case 'color':
      case 'time': return this.elRef.nativeElement.querySelector('input');
      case 'textarea': return this.elRef.nativeElement.querySelector('textarea');
      case 'date':
      case 'datetime': return this.elRef.nativeElement.querySelector('date-picker');
      case 'dropdown': return this.elRef.nativeElement.querySelector('select');
      case 'checkbox': return this.elRef.nativeElement.querySelector('input');
      case 'radio': return this.elRef.nativeElement.querySelector('input');
    }
  }
  //#endregion
}
