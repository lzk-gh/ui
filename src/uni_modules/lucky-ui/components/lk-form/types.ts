import type { ExtractPropTypes, PropType } from 'vue';
import type { FormRules } from './context';

export const lkFormProps = {
    model: {
        type: Object as PropType<Record<string, any>>,
        required: true,
    },
    rules: {
        type: Object as PropType<FormRules>,
        default: undefined,
    },
    labelWidth: {
        type: [String, Number],
        default: '',
    },
    labelAlign: {
        type: String as PropType<'left' | 'right' | 'top'>,
        default: 'left',
    },
    showMessage: {
        type: Boolean,
        default: true,
    }
} as const;

export type LkFormProps = ExtractPropTypes<typeof lkFormProps>;

export const lkFormItemProps = {
    prop: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: undefined, // 若为 undefined 则由 rule 决定
    },
    labelWidth: {
        type: [String, Number],
        default: '',
    },
    labelAlign: {
        type: String as PropType<'left' | 'right' | 'top'>,
        default: '', // 继承 form
    },
    showMessage: {
        type: Boolean,
        default: undefined,
    }
} as const;

export type LkFormItemProps = ExtractPropTypes<typeof lkFormItemProps>;