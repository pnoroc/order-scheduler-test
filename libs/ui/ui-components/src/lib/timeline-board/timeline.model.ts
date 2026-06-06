/**
 * Public + internal types for the {@link TimelineBoardComponent}.
 *
 * The `Timeline*` types form the component's public API (consumer-facing),
 * while the `Positioned*` / `TimelineColumn` types are view-models produced
 * internally once dates have been resolved to pixel coordinates.
 */

/** A schedulable bar rendered on a single row. Part of the public API. */
export interface TimelineItem {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  isPlaceholder?: boolean;
}

/** A single horizontal lane (e.g. a team or work center). Public API. */
export interface TimelineRow {
  id: string;
  title: string;
  items: TimelineItem[];
}

/** How granular the timeline columns are. Part of the public API. */
export type ZoomLevel = 'day' | 'week' | 'month';

/**
 * Internal view-model for one generated header column.
 *
 * Columns are always rendered at a fixed width; only their granularity and
 * label change with the {@link ZoomLevel}. A column spans `spanDays` calendar
 * days starting at `startDate` (1 for a day, 7 for a week, 28–31 for a month),
 * which is what lets dates be positioned proportionally within any column.
 */
export interface TimelineColumn {
  /** Stable key for `@for` tracking, e.g. `"2024-08"` or `"2024-08-12"`. */
  key: string;
  /** Display label, e.g. `"Aug 2024"`, `"5 Aug"`, or `"Mon 5"`. */
  label: string;
  /** First calendar day this column covers, at midnight. */
  startDate: Date;
  /** Number of calendar days this column spans. */
  spanDays: number;
  /** True when today falls inside this column. */
  isCurrent: boolean;
}

/** A {@link TimelineItem} resolved to absolute pixel coordinates. */
export interface PositionedItem extends TimelineItem {
  /** Resolved colour (never undefined once positioned). */
  color: string;
  /** Offset from the start of the timeline track, in px. */
  left: number;
  /** Bar width, in px. */
  width: number;
}

/** A {@link TimelineRow} whose items have been positioned for rendering. */
export interface PositionedRow {
  id: string;
  title: string;
  bars: PositionedItem[];
}
