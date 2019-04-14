export class MainMenuItem {
    Label: string;
    Icon: string;
    Aplicacao: string;
    TemDivisor: boolean;
    Itens: MainMenuItem[];

    constructor (
        label: string,
        icon: string,
        aplicacao: any,
        temDivisor: boolean,
        itens: MainMenuItem[]) {

        this.Label = label;
        this.Icon = icon;
        this.Aplicacao = aplicacao;
        this.TemDivisor = temDivisor;
        this.Itens = itens;
    }
}
