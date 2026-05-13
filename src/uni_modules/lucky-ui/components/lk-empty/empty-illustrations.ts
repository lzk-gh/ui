import type { EmptyName } from './empty.props';
import { DEFAULT_BRAND_COLOR } from '../../theme';
import { Locale } from '../../locale';

export interface EmptyPreset {
  title: string;
  description: string;
}

export interface EmptyIllustrationMeta {
  label: string;
  source: string;
}

const ink = '#231f20';
const muted = '#d1d3d4';
const paper = '#ffffff';
const accent = '#ffb74d';
const danger = '#ff6b6b';
const success = '#8bd17c';

export const emptyPresetText: Record<EmptyName, EmptyPreset> = {
  empty: { title: 'No Data', description: 'No content to display' },
  search: { title: 'No Results', description: 'Try different keywords' },
  network: { title: 'Network Error', description: 'Please check your connection' },
  error: { title: 'Loading Failed', description: 'Something went wrong' },
  permission: { title: 'No Permission', description: 'Permission required to view' },
  inbox: { title: 'No Messages', description: 'New messages will appear here' },
  cart: { title: 'Cart Empty', description: 'Add items you like' },
  favorite: { title: 'No Favorites', description: 'Your favorites will be here' },
};

export const emptyIllustrationMeta: Record<EmptyName, EmptyIllustrationMeta> = {
  empty: {
    label: 'Empty',
    source:
      'https://www.manypixels.co/gallery?style=isometric&search=empty%20state',
  },
  search: {
    label: 'Search',
    source: 'https://www.manypixels.co/gallery?search=search',
  },
  network: {
    label: 'Network',
    source: 'https://www.manypixels.co/gallery?search=network',
  },
  error: {
    label: 'Error',
    source: 'https://www.manypixels.co/gallery?search=error',
  },
  permission: {
    label: 'Permission',
    source: 'https://www.manypixels.co/gallery?search=security',
  },
  inbox: {
    label: 'Inbox',
    source: 'https://www.manypixels.co/gallery?search=message',
  },
  cart: {
    label: 'Cart',
    source: 'https://www.manypixels.co/gallery?search=cart',
  },
  favorite: {
    label: 'Favorite',
    source: 'https://www.manypixels.co/gallery?search=favorite',
  },
};

interface EmptyPalette {
  primary: string;
  primarySoft: string;
}

function normalizeHexColor(color: string): string {
  const trimmed = color.trim();
  const rgb = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/i.exec(trimmed);
  if (rgb) {
    const toHex = (value: string) =>
      Math.max(0, Math.min(255, Number(value))).toString(16).padStart(2, '0');
    return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`;
  }
  const short = /^#([a-f\d])([a-f\d])([a-f\d])$/i.exec(trimmed);
  if (short) {
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  }
  return /^#[a-f\d]{6}$/i.test(trimmed) ? trimmed : DEFAULT_BRAND_COLOR;
}

function hexToRgb(color: string) {
  const hex = normalizeHexColor(color);
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function mixWithWhite(color: string, ratio: number): string {
  const { r, g, b } = hexToRgb(color);
  return `rgb(${Math.round(r + (255 - r) * ratio)}, ${Math.round(g + (255 - g) * ratio)}, ${Math.round(b + (255 - b) * ratio)})`;
}

function createPalette(color?: string): EmptyPalette {
  const primary = normalizeHexColor(color || DEFAULT_BRAND_COLOR);
  return {
    primary,
    primarySoft: mixWithWhite(primary, 0.82),
  };
}

const svgShell = (content: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 360">${content}</svg>`;

const floor = `<path d="M96 312h308" stroke="${muted}" stroke-width="4" stroke-linecap="round" opacity=".75"/>`;

const monitor = (icon: string, palette: EmptyPalette, tone = palette.primary) =>
  `<rect x="142" y="72" width="216" height="158" rx="20" fill="${paper}" stroke="${ink}" stroke-width="8"/><rect x="162" y="94" width="176" height="88" rx="12" fill="${palette.primarySoft}"/><path d="M226 230h48l10 48h-68z" fill="${muted}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/><path d="M190 282h120" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>${icon}<circle cx="340" cy="66" r="20" fill="${tone}" opacity=".9"/>`;

const fileStack = (palette: EmptyPalette) =>
  `<rect x="150" y="92" width="200" height="170" rx="18" fill="${paper}" stroke="${ink}" stroke-width="8"/><path d="M190 142h120M190 178h96M190 214h78" stroke="${muted}" stroke-width="10" stroke-linecap="round"/><path d="M350 134l32 24-32 24z" fill="${palette.primary}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>`;

function createIllustrations(palette: EmptyPalette): Record<EmptyName, string> {
  return {
    empty: svgShell(
      `${floor}<ellipse cx="250" cy="304" rx="92" ry="18" fill="${muted}" opacity=".35"/><rect x="150" y="120" width="200" height="132" rx="22" fill="${paper}" stroke="${ink}" stroke-width="8"/><path d="M182 120l22-38h92l22 38" fill="${palette.primarySoft}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/><path d="M190 178h120M204 214h92" stroke="${muted}" stroke-width="10" stroke-linecap="round"/><circle cx="358" cy="110" r="28" fill="${palette.primary}" opacity=".9"/><path d="M344 110h28" stroke="${paper}" stroke-width="8" stroke-linecap="round"/>`
    ),
    search: svgShell(
      `${floor}${monitor(`<circle cx="238" cy="138" r="34" fill="${paper}" stroke="${ink}" stroke-width="8"/><path d="M264 164l34 34" stroke="${ink}" stroke-width="10" stroke-linecap="round"/><path d="M196 198h108" stroke="${muted}" stroke-width="10" stroke-linecap="round"/>`, palette)}`
    ),
    network: svgShell(
      `${floor}${monitor(`<path d="M196 164c34-30 74-30 108 0" fill="none" stroke="${ink}" stroke-width="10" stroke-linecap="round"/><path d="M218 190c22-18 42-18 64 0" fill="none" stroke="${ink}" stroke-width="10" stroke-linecap="round"/><circle cx="250" cy="218" r="10" fill="${danger}"/>`, palette, danger)}`
    ),
    error: svgShell(
      `${floor}${monitor(`<path d="M216 120l68 68M284 120l-68 68" stroke="${danger}" stroke-width="14" stroke-linecap="round"/><path d="M204 210h92" stroke="${muted}" stroke-width="10" stroke-linecap="round"/>`, palette, danger)}`
    ),
    permission: svgShell(
      `${floor}<path d="M250 72l106 42v66c0 66-42 106-106 130-64-24-106-64-106-130v-66z" fill="${paper}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/><path d="M250 102l74 30v48c0 46-28 74-74 94-46-20-74-48-74-94v-48z" fill="${palette.primarySoft}"/><rect x="208" y="172" width="84" height="70" rx="12" fill="${palette.primary}" stroke="${ink}" stroke-width="8"/><path d="M224 172v-20a26 26 0 0 1 52 0v20" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><circle cx="250" cy="206" r="8" fill="${ink}"/>`
    ),
    inbox: svgShell(
      `${floor}<rect x="128" y="116" width="244" height="150" rx="20" fill="${paper}" stroke="${ink}" stroke-width="8"/><path d="M134 130l116 82 116-82" fill="none" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/><circle cx="344" cy="104" r="30" fill="${palette.primary}"/><path d="M330 104h28" stroke="${paper}" stroke-width="8" stroke-linecap="round"/><path d="M186 278h128" stroke="${muted}" stroke-width="10" stroke-linecap="round"/>`
    ),
    cart: svgShell(
      `${floor}<path d="M132 96h42l28 128h132l34-92H194" fill="${paper}" stroke="${ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="226" cy="266" r="18" fill="${palette.primary}" stroke="${ink}" stroke-width="8"/><circle cx="322" cy="266" r="18" fill="${palette.primary}" stroke="${ink}" stroke-width="8"/><path d="M232 156h88M244 188h58" stroke="${muted}" stroke-width="10" stroke-linecap="round"/><circle cx="370" cy="92" r="24" fill="${accent}"/>`
    ),
    favorite: svgShell(
      `${floor}${fileStack(palette)}<path d="M250 186c-36-28-70-52-70-88 0-24 18-40 40-40 14 0 24 6 30 16 6-10 16-16 30-16 22 0 40 16 40 40 0 36-34 60-70 88z" fill="${success}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>`
    ),
  };
};

export function getEmptyPreset(name: EmptyName): EmptyPreset {
  const title = Locale.t(`lk.empty.${name}.title`);
  const description = Locale.t(`lk.empty.${name}.description`);

  return {
    title: title !== `lk.empty.${name}.title` ? title : (emptyPresetText[name]?.title || emptyPresetText.empty.title),
    description: description !== `lk.empty.${name}.description` ? description : (emptyPresetText[name]?.description || emptyPresetText.empty.description),
  };
}

export function getEmptyIllustrationSrc(name: EmptyName, color?: string): string {
  const illustrations = createIllustrations(createPalette(color));
  const svg = illustrations[name] || illustrations.empty;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
