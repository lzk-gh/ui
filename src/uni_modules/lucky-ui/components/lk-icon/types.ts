// /components/lk-icon/types.ts
import type { ExtractPropTypes } from 'vue';

export const lkIconProps = {
    name: { type: String, required: true },
    color: { type: String, default: '' },
    size: { type: [String, Number], default: '' },
    customStyle: { type: [String, Object], default: '' },
} as const;

export const lkIconEmits = {
    click: (event: Event) => !!event,
};

export type LkIconProps = ExtractPropTypes<typeof lkIconProps>;