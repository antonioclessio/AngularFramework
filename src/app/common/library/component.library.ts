import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, Type, ViewContainerRef, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

declare let $: any;

/** @description
 * Classe helper para trabalhar com componentes e instâncias.
 */
@Injectable({
    providedIn: 'root'
})
export class ComponentLibrary {
    constructor(
        private resolver: ComponentFactoryResolver,
        private renderer: Renderer2
    ) { }

    /** @description
     * Retorna o componente um passo antes de ser instanciado, ou seja, preparado para ser instanciado.
     * @param componentName Nome do componente que será carregado, lembrando que este componente deve estar declarado
     * no entryComponents do módulo
     */
    createComponentFactory(componentName: string): ComponentFactory<any> {
        const factories = Array.from(this.resolver['_factories'].keys());
        const factoryClass = <Type<any>>factories.find((x: any) => x.name === componentName);
        return this.resolver.resolveComponentFactory(factoryClass);
    }

    /** @description
     * Retorna a instância criada do componente informado por parâmetro
     * @param componentName Nome do componente que será carregado, lembrando que este componente deve estar declarado
     * no entryComponents do módulo.
     * @param target Instância injetada do ViewContainerRef (nativo Angular) e que será utilizado para carregar a instância
     * do componente passado no parâmetro anterior
     */
    createComponentInstance(componentName: string, target: ViewContainerRef): ComponentRef<any> {
        const factory = this.createComponentFactory(componentName);
        const componentRef = target.createComponent(factory);

        return componentRef;
    }

    /** @description
     * Retorna em um objeto flat todos os controles de um determinado grupo do formulário
     * @param e Instância do formulário contém os controles que serão verificados.
     * @returns Array com duas propriedades: Name e control.
     */
    getAllControlsFromGroup(e: any): any[] {
        const objReturn: any[] = [];

        const props = Object.getOwnPropertyNames(e);
        props.forEach(prop => {
            if (e[prop].controls !== undefined) {
                const temp = this.getAllControlsFromGroup(e[prop].controls);
                temp.forEach(item => objReturn.push(item));
            } else {
                objReturn.push({ name: prop, control: e[prop] });
            }
        });

        return objReturn;
    }

    /** @description
     * Retorna um array de strings contendo todos os caminhos dos controles do form.
     * @param e Instância do formulário que contém os controles que serão verificados.
     * @param groupName Nome do grupo que deve ser verificado.
     * @returns Array de strings contendo o path de todos os controles incluindo o nome do grupo.
     * Ex: nomeGrupo.NomeControle
     */
    getAllControlPathFromGroup(e: any, groupName: string = null): string[] {
        const objReturn: string[] = [];

        const props = Object.getOwnPropertyNames(e);
        props.forEach(prop => {
            if (e[prop].controls !== undefined) {
                const inputNameSpace: string = groupName ? `${groupName}.${prop}` : prop;
                const temp = this.getAllControlPathFromGroup(e[prop].controls, inputNameSpace);
                temp.forEach(item => objReturn.push(item));
            } else {
                objReturn.push(groupName ? `${groupName}.${prop}` : prop);
            }
        });

        return objReturn;
    }

    /** @description
     * Retorna todos os controls com algum erro de um determinado grupo de formulário. O objeto de retorno
     * Traz os objetos de forma flat caso o grupo passado por parâmetro tenha subgrupos.
     * @param e Instância do formulário que contém os controles que serão verificados
     * @returns Array com objetos com a seguinte característica: { name: string, control: FormControl }
     */
    getAllControlsFromGroupWithErrors(e: any): any[] {
        const objRetorno: any[] = [];
        const controls = this.getAllControlsFromGroup(e);
        controls.forEach(item => {
            if (item.control.invalid) {
                objRetorno.push(item);
            }
        });

        return objRetorno;
    }

    /** @description
     * Aplica a validação de formulários.
     * @param e: Controles dos formulários. Ex: FormGroup.Controls.
     * @param nativeElement: Propriedade de mesmo nome do elemento. Ex: this.elRef.nativeElement.
     */
    showFormErrors(e: any, nativeElement: any): void {
        const allControls = this.getAllControlPathFromGroup(e.controls ? e.controls : e);

        allControls.forEach(item => {
            const control: FormControl = e.get(item);
            const controlElement = nativeElement.querySelector(`[data-form="${item}"]`);
            if (control.invalid) {
                this.renderer.addClass(controlElement, 'is-invalid');

                const tooltipMessage = nativeElement.querySelector(`[data-form-message="${item}"]`);

                if (control.errors.required) {
                    tooltipMessage.innerHTML = 'Campo obrigatório';
                } else if (control.errors.email) {
                    tooltipMessage.innerHTML = 'E-mail inválido';
                }
            } else if (control.valid && control.touched) {
                this.renderer.addClass(controlElement, 'is-valid');
            }
        });
    }
}
