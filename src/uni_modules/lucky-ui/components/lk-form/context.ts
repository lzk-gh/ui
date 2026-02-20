import type { InjectionKey } from 'vue';

export interface ValidateError {
  field: string;
  message: string;
  rule?: unknown;
}

export type RuleValidator = (
  value: unknown,
  rule: FormRule,
  model?: Record<string, unknown>
) => boolean | string | Promise<boolean | string>;

export interface FormRule {
  required?: boolean;
  message?: string;
  trigger?: 'blur' | 'change' | Array<'blur' | 'change'>;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: RuleValidator;
  // 允许额外自定义扩展字段
  [k: string]: unknown;
}

export type FormRules = Record<string, FormRule | FormRule[]>;

export interface FormValidateOptions {
  silent?: boolean;
  fields?: string[];
}

export interface FormContext {
  model: Record<string, unknown>;
  rules: FormRules | undefined;
  labelWidth?: string | number;
  showMessage: boolean;
  addField: (field: FormItemContext) => void;
  removeField: (field: FormItemContext) => void;
  validateField: (prop: string) => Promise<void>;
  emitFieldBlur: (prop: string) => void;
  emitFieldChange: (prop: string, value: unknown) => void;
  validate: (opts?: FormValidateOptions) => Promise<void>;
  resetFields: (fields?: string[]) => void;
}

export interface FormItemContext {
  prop?: string;
  setValidateStatus: (
    status: 'idle' | 'validating' | 'success' | 'error',
    message?: string
  ) => void;
  validate: (trigger?: 'blur' | 'change') => Promise<void>;
  reset: () => void;
}

export const formContextKey: InjectionKey<FormContext> = Symbol('LkFormContext');
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('LkFormItemContext');
