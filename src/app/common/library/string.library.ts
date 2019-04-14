import { Injectable } from '@angular/core';

/** @description Classe "helper" para tratar com strings. */
@Injectable({
    providedIn: 'root'
})
export class StringLibrary {

    /**
     * @description
     * Remove caracteres especiais e acentos do texto
     * @param value String que será tratada
     * @returns Retorna a string passada por paâmetro porém sem os caracteres especiais.
     */
    cleanText(value: string): string {
        if (!value) { return value; }

        do { value = value.replace(' ', ''); } while (value.indexOf(' ') > -1);
        do { value = value.replace('|', ''); } while (value.indexOf('|') > -1);
        do { value = value.replace('/', ''); } while (value.indexOf('/') > -1);
        do { value = value.replace(';', ''); } while (value.indexOf(';') > -1);
        do { value = value.replace('_', ''); } while (value.indexOf('_') > -1);
        do { value = value.replace('+', ''); } while (value.indexOf('+') > -1);
        do { value = value.replace('=', ''); } while (value.indexOf('=') > -1);
        do { value = value.replace(':', ''); } while (value.indexOf(':') > -1);
        do { value = value.replace('.', ''); } while (value.indexOf('.') > -1);
        do { value = value.replace('-', ''); } while (value.indexOf('-') > -1);
        do { value = value.replace('(', ''); } while (value.indexOf('(') > -1);
        do { value = value.replace(')', ''); } while (value.indexOf(')') > -1);
        do { value = value.replace('*', ''); } while (value.indexOf('*') > -1);

        do { value = value.replace('ç', 'c'); } while (value.indexOf('ç') > -1);
        do { value = value.replace('ã', 'a'); } while (value.indexOf('ã') > -1);
        do { value = value.replace('à', 'a'); } while (value.indexOf('à') > -1);
        do { value = value.replace('á', 'a'); } while (value.indexOf('á') > -1);
        do { value = value.replace('ä', 'a'); } while (value.indexOf('ä') > -1);
        do { value = value.replace('ä', 'a'); } while (value.indexOf('ä') > -1);
        do { value = value.replace('â', 'a'); } while (value.indexOf('â') > -1);
        do { value = value.replace('é', 'e'); } while (value.indexOf('é') > -1);
        do { value = value.replace('è', 'e'); } while (value.indexOf('è') > -1);
        do { value = value.replace('ê', 'e'); } while (value.indexOf('ê') > -1);
        do { value = value.replace('ë', 'e'); } while (value.indexOf('ë') > -1);
        do { value = value.replace('ï', 'i'); } while (value.indexOf('ï') > -1);
        do { value = value.replace('í', 'i'); } while (value.indexOf('í') > -1);
        do { value = value.replace('ì', 'i'); } while (value.indexOf('ì') > -1);
        do { value = value.replace('î', 'i'); } while (value.indexOf('î') > -1);
        do { value = value.replace('ô', 'o'); } while (value.indexOf('ô') > -1);
        do { value = value.replace('ó', 'o'); } while (value.indexOf('ó') > -1);
        do { value = value.replace('ò', 'o'); } while (value.indexOf('ò') > -1);
        do { value = value.replace('õ', 'o'); } while (value.indexOf('õ') > -1);
        do { value = value.replace('ö', 'o'); } while (value.indexOf('ö') > -1);
        do { value = value.replace('ú', 'u'); } while (value.indexOf('ú') > -1);
        do { value = value.replace('ù', 'u'); } while (value.indexOf('ù') > -1);
        do { value = value.replace('ü', 'u'); } while (value.indexOf('ü') > -1);

        return value;
    }

    /**
     * @description Aplica a máscara em uma string.
     * @param value String que deve ser aplicada a máscara
     * @param regex Cadeia de regex por caracter que deve aplicada a máscara
     */
    applyInputMask(value: string, regex: any[]): string {
        let newValue: string = '';
        const valueChars: string[] = this.cleanText(value).split('');

        let j: number = 0;
        for (let i = 0; i < valueChars.length; i++) {
            const char: string = valueChars[i];
            let regItem: any = regex[j++];

            if (!regItem) { break; }

            while (typeof regItem === 'string') {
                newValue += regItem;
                regItem = regex[j++];
            }

            const reg = new RegExp(regItem);
            if (reg.test(char)) {
                newValue += char;
            }
        }

        return newValue;
    }

    /**
     * @description Verifica se o CPF informado é válido. Não considera a máscara
     * @param value CPF a ser validado
     */
    validarCPF(value: string): boolean {
        value = this.cleanText(value);

        let Soma: number = 0;
        let Resto: number;

        if (value === '00000000000' ||
            value === '11111111111' ||
            value === '22222222222' ||
            value === '33333333333' ||
            value === '44444444444' ||
            value === '55555555555' ||
            value === '66666666666' ||
            value === '77777777777' ||
            value === '88888888888' ||
            value === '99999999999'
        ) { return false; }

        for (let i = 1; i <= 9; i++) { Soma = Soma + parseInt(value.substring(i - 1, i), null) * (11 - i); }
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) { Resto = 0; }
        if (Resto !== parseInt(value.substring(9, 10), null)) { return false; }

        Soma = 0;
        for (let i = 1; i <= 10; i++) { Soma = Soma + parseInt(value.substring(i - 1, i), null) * (12 - i); }
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) { Resto = 0; }
        if (Resto !== parseInt(value.substring(10, 11), null)) { return false; }
        return true;
    }

    /**
     * @description Verifica se o CNPJ informado é válido. Não considera a máscara.
     * @param value CNPJ a ser validado
     */
    validarCNPJ(value: string): boolean {
        value = this.cleanText(value);

        value = value.replace(/[^\d]+/g, '');

        if (value === '') { return false; }

        if (value.length !== 14) { return false; }

        // Elimina CNPJs invalidos conhecidos
        if (value === '00000000000000' ||
            value === '11111111111111' ||
            value === '22222222222222' ||
            value === '33333333333333' ||
            value === '44444444444444' ||
            value === '55555555555555' ||
            value === '66666666666666' ||
            value === '77777777777777' ||
            value === '88888888888888' ||
            value === '99999999999999') { return false; }

        // Valida DVs
        let tamanho: number = value.length - 2;
        let numeros: string = value.substring(0, tamanho);
        const digitos: string = value.substring(tamanho);
        let soma = 0;
        let pos: number = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i), null) * pos--;
            if (pos < 2) { pos = 9; }
        }

        let resultado: number = soma % 11 < 2 ? 0 : 11 - soma % 11;

        if (resultado !== parseInt(digitos.charAt(0), null)) { return false; }

        tamanho = tamanho + 1;
        numeros = value.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i), null) * pos--;
            if (pos < 2) { pos = 9; }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1), null)) { return false; }

        return true;
    }

    /**
     * @description Verifica se a hora informada é validada. Não considera a máscara.
     * @param value Hora a ser validada
     * @param useAMPM Informa se a hora a ser validada utiliza ou não o formato 24h. Default é false.
     */
    validarHora(value: string, useAMPM: boolean = false): boolean {
        const fragmentos: string[] = value.split(':');
        if (fragmentos.length < 2) { return false; }

        const hora: number = parseInt(fragmentos[0], null);
        const minutos: number = parseInt(fragmentos[1], null);
        const segundos: number = fragmentos[2] ? parseInt(fragmentos[2], null) : null;

        if (useAMPM) {
            if (hora < 0 || hora > 12) { return false; }
        } else {
            if (hora < 0 || hora > 23) { return false; }
        }

        if (minutos < 0 || minutos > 59) { return false; }
        if (segundos < 0 || segundos > 59) { return false; }

        return true;
    }
}
