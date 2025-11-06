import type { ExtractPropTypes, PropType } from 'vue';

export type Aspect = number | '1:1'|'4:3'|'16:9';

export const lkImageCropperProps = {
  src: { type: String, required: true },
  aspectRatio: { type: [Number, String] as unknown as PropType<Aspect>, default: '1:1' },
  round: { type: Boolean, default: false },
  minZoom: { type: Number, default: 1 },
  maxZoom: { type: Number, default: 3 },
  movable: { type: Boolean, default: true },
  scalable: { type: Boolean, default: true },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  visible: { type: Boolean, default: true },
} as const;

export type LkImageCropperProps = ExtractPropTypes<typeof lkImageCropperProps>;

export const lkImageCropperEmits = {
  'update:visible': (_: boolean) => true,
  confirm: (_: string) => true, // base64 dataURL
  cancel: () => true,
};
