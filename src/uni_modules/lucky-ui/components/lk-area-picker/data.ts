export interface RegionNode {
  code: string;
  name: string;
  children?: RegionNode[];
}

export const simpleChina: RegionNode[] = [
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
        ],
      },
    ],
  },
];
