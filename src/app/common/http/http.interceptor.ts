import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';

import { HttpBaseService, Authentication } from './http-base.service';
import { APP_AUTH, APP_TOKEN } from './../../common/constants';

@Injectable({
    providedIn: 'root'
})
export class HttpServiceInterceptor extends HttpBaseService implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinner.show();

        let newHeader: HttpHeaders = null;

        // Se na URL tiver o token, significa que é o login, então...
        if (req.url.indexOf(APP_TOKEN) > -1) {
            // Trata o header como esperado.
            newHeader = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded');
        } else { // ... caso contrário

            // Verificando se a sessão está expirada.
            if (!this.checkActiveSession() && req.url.indexOf('/login') === -1) { this.logout('Sessão expirada'); }

            this.updateSession();

            const auth: Authentication = JSON.parse(localStorage.getItem(APP_AUTH));
            if (auth !== null) { // ... se tiver o cookie com o token gerado, então usa.

                if (req.method === 'GET') {
                    newHeader = new HttpHeaders().set('Authorization', `${auth.token_type} ${auth.access_token}`);
                } else {
                    newHeader = new HttpHeaders().set('Authorization', `${auth.token_type} ${auth.access_token}`)
                        .set('Content-Type', 'application/json');
                }

            }
        }

        const newRequest = newHeader !== null ? req.clone({ headers: newHeader }) : req.clone();
        return next.handle(newRequest).pipe(
            // retry(5),
            finalize(() => this.spinner.hide()),
            catchError(e => this.errorHandler(e, newRequest, next))
        );
    }

}
