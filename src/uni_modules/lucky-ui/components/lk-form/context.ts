import type { InjectionKey } from 'vue';

export interface ValidateError {
    field: string;
    message: string;
    rule?: any;
}

export type RuleValidator = (value: any, rule: FormRule, model?: any) => boolean | string | Promise<boolean | string>;

export interface FormRule {
    required?: boolean;
    message?: string;
    trigger?: 'blur' | 'change' | Array<'blur' | 'change'>;
    min?: number;
    max?: number;
    pattern?: RegExp;
    validator?: RuleValidator;
    // 允许额外自定义扩展字段
    [k: string]: any;
}

export type FormRules = Record<string, FormRule | FormRule[]>;

export interface FormValidateOptions {
    silent?: boolean;
    fields?: string[];
}

export interface FormContext {
    model: Record<string, any>;
    rules: FormRules | undefined;
    labelWidth?: string | number;
    showMessage: boolean;
    addField: (field: FormItemContext) => void;
    removeField: (field: FormItemContext) => void;
    validateField: (prop: string) => Promise<void>;
    emitFieldBlur: (prop: string) => void;
    emitFieldChange: (prop: string, value: any) => void;
    validate: (opts?: FormValidateOptions) => Promise<void>;
    resetFields: (fields?: string[]) => void;
}

export interface FormItemContext {
    prop?: string;
    setValidateStatus: (status: 'idle' | 'validating' | 'success' | 'error', message?: string) => void;
    validate: (trigger?: 'blur' | 'change') => Promise<void>;
    reset: () => void;
}

export const formContextKey: InjectionKey<FormContext> = Symbol('LkFormContext');
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('LkFormItemContext');