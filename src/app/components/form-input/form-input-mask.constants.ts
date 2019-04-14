export const MASK_Celular: any[] = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
export const MASK_TelefoneFixo: any[] = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

export const MASK_Celular_Regex: RegExp = /^\(\d{2}\) \d{5}\-\d{4}$/;
export const MASK_TelefoneFixo_Regex: RegExp = /^\(\d{2}\) \d{4}\-\d{4}$/;

export const MASK_CPF: any[] = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
export const MASK_CPF_Regex: RegExp = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

export const MASK_CNPJ: any[] = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
export const MASK_CNPJ_Regex: RegExp = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;

export const MASK_CEP: any[] = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
export const MASK_CEP_Regex: RegExp = /^\d{5}\-\d{3}$/;

export const MASK_Time: any[] = [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];
export const MASK_Time_Regex: RegExp = /^\d{2}\:\d{2}:\d{2}$/;

export const MASK_Time_Short: any[] = [/\d/, /\d/, ':', /\d/, /\d/];
export const MASK_Time_Short_Regex: RegExp = /^\d{2}\:\d{2}$/;
