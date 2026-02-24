import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export const uploadProps = {
  ...baseProps,
  /** 绑定值 */
  modelValue: { type: Array as PropType<string[]>, default: () => [] },
  /** 是否多选 */
  multiple: LkProp.boolean(true),
  /** 最大数量 */
  max: LkProp.number(9),
  /** 是否禁用 */
  disabled: LkProp.boolean(false),
  /** 接受的文件类型 */
  accept: LkProp.string('image/*'),
  /** 是否可选择 */
  selectable: LkProp.boolean(true),
  /** 图片尺寸类型 */
  sizeType: { type: Array as PropType<string[]>, default: () => ['compressed'] },
  /** 捕获来源 */
  capture: { type: Array as PropType<string[]>, default: () => [] },
  /** 是否可删除 */
  deletable: LkProp.boolean(true),
  /** 是否可预览 */
  preview: LkProp.boolean(true),
} as const;

export type UploadProps = ExtractPropTypes<typeof uploadProps>;

export const uploadEmits = {
  'update:modelValue': (_val: string[]) => true,
  change: (_val: string[]) => true,
  remove: (_index: number) => true,
  add: (_list: string[]) => true,
  oversize: () => true,
};
