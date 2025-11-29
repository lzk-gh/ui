import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

export type Aspect = number | '1:1' | '4:3' | '16:9';

export const imageCropperProps = {
  ...baseProps,
  /** 图片源 */
  src: { type: String, required: true },
  /** 宽高比 */
  aspectRatio: {
    type: [Number, String] as unknown as PropType<Aspect>,
    default: '1:1',
  },
  /** 是否圆形 */
  round: LkProp.boolean(false),
  /** 最小缩放比例 */
  minZoom: LkProp.number(1),
  /** 最大缩放比例 */
  maxZoom: LkProp.number(3),
  /** 是否可移动 */
  movable: LkProp.boolean(true),
  /** 是否可缩放 */
  scalable: LkProp.boolean(true),
  /** 确认按钮文本 */
  confirmText: LkProp.string('确定'),
  /** 取消按钮文本 */
  cancelText: LkProp.string('取消'),
  /** 是否显示 */
  visible: LkProp.boolean(true),
} as const;

export type LkImageCropperProps = ExtractPropTypes<typeof imageCropperProps>;

export const imageCropperEmits = {
  'update:visible': (_: boolean) => true,
  confirm: (_: string) => true, // base64 dataURL
  cancel: () => true,
};
