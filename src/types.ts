export type TabType = 'scan-&-pick' | 'write-name' | 'my-grains';

export type CategoryType = 'all' | 'vows' | 'personal';

export type PenStyle = 'brush' | 'marker' | 'fine';

export type InkColor = 'black' | 'amber' | 'cyan' | 'red';

export interface GrainItem {
  id: string;
  panelNum: string;
  title: string;
  badgeText: string;
  badgeType?: 'classic' | 'vow' | 'cyber' | 'love';
  category: 'vows' | 'personal';
  name: string;
  specLeft: string;
  specRight: string;
  specRightColor: string;
  image: string;
  isCustom?: boolean;
  penStyle?: PenStyle;
  inkColor?: InkColor;
  dateAdded?: string;
}
