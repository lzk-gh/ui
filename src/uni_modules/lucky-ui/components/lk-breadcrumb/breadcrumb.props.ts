import type { ExtractPropTypes } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const breadcrumbProps = {
  ...baseProps,

  /** 分隔符 */
  separator: LkProp.string('/'),
} as const;

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>;
