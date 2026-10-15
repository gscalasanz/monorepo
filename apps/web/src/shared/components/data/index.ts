/** `@/shared/components/data` — tabla, badges, montos, filtros y listas de datos. */
export { ActionsMenu, type ActionLink, type ActionsMenuProps } from './actions-menu';
export { DATA_COPY } from './copy';
export * from './data-grid';
export { DirectionTile, type DirectionTileProps } from './direction-tile';
export * from './filter-bar';
export { InitialsAvatar, type InitialsAvatarProps } from './initials-avatar';
export { KeyValueList, type KeyValueItem, type KeyValueListProps } from './key-value-list';
export { ListPanel, ListToolbar, type ListPanelProps } from './list-panel';
export { Money, type MoneyProps, type MoneySize } from './money';
export {
  MINUS_SIGN,
  PLUS_SIGN,
  formatSignedMoney,
  toMoneyParts,
  type MoneyDirection,
  type MoneyParts,
  type MoneySign,
} from './money-parts';
export { RamaChip, type RamaChipProps } from './rama-chip';
export { RowActionsMenu, type RowAction, type RowActionsMenuProps } from './row-actions-menu';
export {
  ButtonTabs,
  SegmentedTabs,
  type SegmentedTabItem,
  type SegmentedTabsProps,
} from './segmented-tabs';
export { StatusBadge, type StatusBadgeProps } from './status-badge';
export { BADGE_TONE, resolveBadgeTone, type BadgeTone } from './status-badge-config';
export { TotalsBar, type TotalsBarProps } from './totals-bar';
export { MOBILE_LIST_QUERY, useMediaQuery } from './use-media-query';
