import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';
import type { Columns } from '../lk-picker-view/picker-view.props';

export const pickerProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [Array, String, Number, Object, Boolean] as unknown as PropType<any>,
    default: null,
  },

  /** 选项列数据 */
  columns: {
    type: [Array] as unknown as PropType<Columns>,
    default: () => [],
  },

  /** 标题 */
  title: LkProp.string(''),

  /** 确认按钮文字 */
  confirmText: LkProp.string('确定'),

  /** 取消按钮文字 */
  cancelText: LkProp.string('取消'),

  /** 是否显示 */
  visible: LkProp.boolean(false),

  /** 是否圆角 */
  round: LkProp.boolean(true),
} as const;

export type PickerProps = ExtractPropTypes<typeof pickerProps>;

export const pickerEmits = {
  'update:modelValue': (_: any) => true,
  'update:visible': (_: boolean) => true,
  change: (_: any) => true,
  confirm: (_: any) => true,
  cancel: () => true,
};
