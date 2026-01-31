import type { ExtractPropTypes, PropType } from 'vue';
import { baseProps, LkProp } from '../common/props';

/** 选择器选项 */
export interface PickerOption {
  label: string;
  value: string | number;
  children?: PickerOption[];
}

/** 选项列数据 */
export type PickerColumns = PickerOption[] | PickerOption[][];

/** 地区数据节点 */
export interface RegionNode {
  code: string;
  name: string;
  children?: RegionNode[];
}

/** Picker 模式 */
export type PickerMode = 'single' | 'multi' | 'cascade' | 'region';

export const pickerProps = {
  ...baseProps,

  /** 绑定值 */
  modelValue: {
    type: [Array, String, Number] as unknown as PropType<string | number | (string | number)[]>,
    default: undefined,
  },

  /** 选择器模式: single-单列, multi-多列, cascade-级联, region-地区 */
  mode: LkProp.enum(['single', 'multi', 'cascade', 'region'] as const, 'single', 'mode'),

  /** 选项列数据 (single/multi/cascade 模式) */
  columns: {
    type: Array as unknown as PropType<PickerColumns>,
    default: () => [],
  },

  /** 地区数据 (region 模式) */
  regionData: {
    type: Array as unknown as PropType<RegionNode[]>,
    default: undefined,
  },

  /** 地区层级 (region 模式): 2-省市, 3-省市区 */
  regionLevel: LkProp.number(3),

  /** 是否内联显示 (不使用 popup) */
  inline: LkProp.boolean(false),

  /** 标题 */
  title: LkProp.string(''),

  /** 确认按钮文字 */
  confirmText: LkProp.string('确定'),

  /** 取消按钮文字 */
  cancelText: LkProp.string('取消'),

  /** 是否显示 (popup 模式) */
  visible: LkProp.boolean(false),

  /** 是否圆角 */
  round: LkProp.boolean(true),

  /** 可见选项数量 */
  visibleCount: LkProp.number(5),

  /** 选项高度 (rpx) */
  itemHeight: LkProp.number(88),
} as const;

export type PickerProps = ExtractPropTypes<typeof pickerProps>;

export const pickerEmits = {
  'update:modelValue': (_: string | number | (string | number)[]) => true,
  'update:visible': (_: boolean) => true,
  change: (_: string | number | (string | number)[]) => true,
  confirm: (_: string | number | (string | number)[]) => true,
  cancel: () => true,
};

/** 内置简易省市区数据 */
export const defaultRegionData: RegionNode[] = [
  {
    code: '110000',
    name: '北京',
    children: [
      {
        code: '110100',
        name: '北京市',
        children: [
          { code: '110101', name: '东城区' },
          { code: '110102', name: '西城区' },
          { code: '110105', name: '朝阳区' },
          { code: '110106', name: '丰台区' },
          { code: '110108', name: '海淀区' },
        ],
      },
    ],
  },
  {
    code: '310000',
    name: '上海',
    children: [
      {
        code: '310100',
        name: '上海市',
        children: [
          { code: '310101', name: '黄浦区' },
          { code: '310104', name: '徐汇区' },
          { code: '310105', name: '长宁区' },
          { code: '310106', name: '静安区' },
          { code: '310107', name: '普陀区' },
        ],
      },
    ],
  },
  {
    code: '440000',
    name: '广东',
    children: [
      {
        code: '440100',
        name: '广州市',
        children: [
          { code: '440103', name: '荔湾区' },
          { code: '440104', name: '越秀区' },
          { code: '440105', name: '海珠区' },
          { code: '440106', name: '天河区' },
        ],
      },
      {
        code: '440300',
        name: '深圳市',
        children: [
          { code: '440303', name: '罗湖区' },
          { code: '440304', name: '福田区' },
          { code: '440305', name: '南山区' },
          { code: '440306', name: '宝安区' },
        ],
      },
    ],
  },
  {
    code: '330000',
    name: '浙江',
    children: [
      {
        code: '330100',
        name: '杭州市',
        children: [
          { code: '330102', name: '上城区' },
          { code: '330103', name: '下城区' },
          { code: '330104', name: '江干区' },
          { code: '330105', name: '拱墅区' },
        ],
      },
      {
        code: '330200',
        name: '宁波市',
        children: [
          { code: '330203', name: '海曙区' },
          { code: '330205', name: '江北区' },
          { code: '330206', name: '北仑区' },
        ],
      },
    ],
  },
];
