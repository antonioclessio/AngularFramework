import { Router } from '@angular/router';
import { Inject, Injector } from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpHandler, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { filter, take, switchMap } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';

import { APP_SESSION, APP_SESSION_EXPIRES, APP_AUTH, APP_TOKEN } from './../../common/constants';
import { ToastService } from '../../components/toast/toast.service';

/** @description
 * Classe base para interceptação de HTTP Request.
 * Funções realizadas:
 *      * Tratamento de Erros
 */
export abstract class HttpBaseService {

    spinner: NgxSpinnerService;
    router: Router;
    toast: ToastService;
    private http: HttpClient;

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(
        @Inject(NgxSpinnerService) _spinner: NgxSpinnerService,
        @Inject(Router) _router: Router,
        @Inject(HttpClient) _http: HttpClient,
        private injector: Injector
    ) {
        this.spinner = _spinner;
        this.router = _router;
        this.http = _http;

        this.toast = this.injector.get(ToastService);
    }

    //#region Token Handler
    /** @description Tratamento de erro padrão */
    errorHandler(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (navigator.onLine === false) {
            this.toast.error('Sem conexão com a internet');
            return Observable.throw(error);
        }

        if (error instanceof HttpErrorResponse) {
            let errorMessage: string = null;

            switch ((<HttpErrorResponse>error).status) {
                case 0:
                case 400:
                    if (typeof error.error === 'string') {
                        errorMessage = error.error;
                    } else if (error.error.error === 'UserNotFound') {
                        return throwError(error);
                    } else if (error.error.Data && typeof error.error.Data === 'string') {
                        errorMessage = error.error.Data;
                    } else {
                        errorMessage = error.message;
                    }
                    break;
                case 401:
                    if (request.url.indexOf(APP_TOKEN) > -1) {
                        this.logout(error.error.error);
                    }

                    return this.handle401Error(request, next);
            }

            this.toast.error(errorMessage);
            return throwError(errorMessage);
        } else {
            return throwError(error);
        }
    }

    /**
     * Refresh token implementado com base no artigo:
     * http://ericsmasal.com/2018/07/02/angular-6-with-jwt-and-refresh-tokens-and-a-little-rxjs-6/
     **/
    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            this.tokenSubject.next(null);

            const tokenUrl: string = `${request.url.substring(0, request.url.indexOf('/api'))}${APP_TOKEN}`;
            const reqHeader: HttpHeaders = new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded' });
            const auth: Authentication = JSON.parse(localStorage.getItem(APP_AUTH));

            return this.http.post(tokenUrl, `grant_type=refresh_token&username=${auth.username}&&refresh_token=${auth.refresh_token}`,
                { headers: reqHeader })
                .pipe(
                    switchMap((response: Authentication) => {
                        if (!response) { this.logout('Ocorreu um erro na requisição. Refaça o login.'); }
                        auth.access_token = response.access_token;
                        auth.refresh_token = response.refresh_token;
                        this.tokenSubject.next(response.access_token);
                        localStorage.removeItem(APP_AUTH);
                        localStorage.setItem(APP_AUTH, JSON.stringify(auth));

                        return next.handle(
                            request.clone({
                                headers: new HttpHeaders({ 'Authorization': `${response.token_type} ${response.access_token}` }
                                )
                            })
                        );
                    }),
                    finalize(() => {
                        this.isRefreshingToken = false;
                    })
                );
        } else {
            this.isRefreshingToken = false;

            return this.tokenSubject.pipe(filter(token => token != null),
                take(1),
                switchMap(token => {
                    const auth: Authentication = JSON.parse(localStorage.getItem(APP_AUTH));
                    return next.handle(
                        request.clone({
                            headers: new HttpHeaders({ 'Authorization': `${auth.token_type} ${token}` }
                            )
                        })
                    );
                }));
        }
    }
    //#endregion

    //#region Session Handler
    logout(message: string = null): void {
        localStorage.clear();

        if (message !== null) {
            this.router.navigate(['/login'], { queryParams: { m: message } });
        } else {
            this.router.navigate(['/login']);
        }
    }

    setSession(): void {
        const sessionData: Session = { timestamp: new Date().getTime() };
        localStorage.setItem(APP_SESSION, JSON.stringify(sessionData));
    }

    getSession(): Session {
        const cookie = localStorage.getItem(APP_SESSION);
        if (cookie == null) { return null; }
        return JSON.parse(cookie) as Session;
    }

    updateSession(): void {
        localStorage.removeItem(APP_SESSION);
        this.setSession();
    }

    checkActiveSession(): boolean {
        const session: Session = this.getSession();
        if (session == null) { return false; }

        const diff: number = Math.floor((new Date().getTime() - new Date(session.timestamp).getTime()) / 1000 / 60);
        return diff < APP_SESSION_EXPIRES;
    }
    //#endregion

}

/** @description Configurações de segurança */
export class Authentication {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    loja_cnpj: string;
    loja_id: string;
    loja_nome: string;
    token_type: string;
    usuario_nome: string;
    username: string;

    constructor(token: string) {
        this.access_token = token;
    }
}

/** @description Classe controladora da sessão e do refresh token.
 * Se a sessão estiver expirada, redireciona para a login, caso contrário realiza o refresh token.
 */
export class Session {
    timestamp: number;
}
