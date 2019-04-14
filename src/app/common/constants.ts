/** @description Identificação do cookie que armazenará os dados de autenticação */
export const APP_AUTH: string = 'clAuthentication';

/** @description Cookie que controla a sessão */
export const APP_SESSION: string = 'clSession';

/** @description Define a quantidade mínima de caracteres para executar uma pesquisa. */
export const APP_TOTAL_LENGTH_TO_SEARCH: number = 3;

/** @description Define o tempo em minutos que o sistema permanecerá logado sem atividade. */
export const APP_SESSION_EXPIRES: number = 120;

/** @description Endpoint para autenticação owin. */
export const APP_TOKEN: string = '/checkaccess';

/** @description Constante utilizada para identificar o cookie com as informações estruturais da aplicação. */
export const APP_STRUCTURE: string = 'appStructure';

export const READ: number = 1;
export const CREATE: number = 2;
export const UPDATE: number = 3;
export const DELETE: number = 4;
