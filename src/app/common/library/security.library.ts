import { Injectable } from '@angular/core';
import { APP_STRUCTURE } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class SecurityLibrary {
    getPermissions(idAplicacao: number): any {
        const objSession = JSON.parse(localStorage.getItem('appStructure'));
        const aplicacao = objSession.Aplicacao.find(a => a.IdAplicacao === idAplicacao);
        return !aplicacao ? null : aplicacao.Permissoes.split('.');
    }

    checkPermission(aplicacao: number, permissao: number): boolean {
        const currentAppPermissoes = this.getPermissions(aplicacao);
        if (!currentAppPermissoes) { return false; }

        return currentAppPermissoes.filter(a => parseInt(a, null) === permissao).length > 0;
    }
}
