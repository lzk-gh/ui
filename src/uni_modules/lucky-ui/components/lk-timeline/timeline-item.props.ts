import type { ExtractPropTypes } from 'vue';
import { LkProp } from '../common/props';

export const timelineItemProps = {
  time: LkProp.string(''),
  endTime: LkProp.string(''),
  title: LkProp.string(''),
  subtitle: LkProp.string(''),
  desc: LkProp.string(''),
  tag: LkProp.string(''),
  accent: LkProp.string('var(--lk-color-primary)'),
  cardBg: LkProp.string('var(--lk-color-bg-surface)'),
  cardBorder: LkProp.string('var(--lk-color-border-weak)'),
  location: LkProp.string(''),
  person: LkProp.string(''),
  avatar: LkProp.string(''),
} as const;

export type TimelineItemProps = ExtractPropTypes<typeof timelineItemProps>;
