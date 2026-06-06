/**
 * Pure, framework-agnostic date + geometry helpers for the timeline board.
 *
 * Keeping these out of the component keeps the logic unit-testable and the
 * component focused on presentation.
 */
import { TimelineColumn, ZoomLevel } from './timeline.model';

const MS_PER_DAY = 86_400_000;

/** Minimum rendered bar width so single-day items stay clickable/visible. */
export const MIN_BAR_WIDTH = 6;

/** Formats a date as a short month + year label, e.g. `"Aug 2024"`. */
const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
});

/** Formats a week column as its starting day + month, e.g. `"5 Aug"`. */
const WEEK_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
});

/** Formats a day column as weekday + day-of-month, e.g. `"Mon 5"`. */
const DAY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
});

/** Midnight of the given date (drops the time component). */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** First day of the date's month. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Monday of the date's week (ISO weeks start on Monday). */
export function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  // getDay(): 0 = Sunday … 6 = Saturday. Shift so Monday becomes 0.
  const offset = (day.getDay() + 6) % 7;
  return addDays(day, -offset);
}

/** Last day of the date's month. */
export function endOfMonth(date: Date): Date {
  // Day 0 of the next month === last day of this month.
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/** Number of days in a given month (handles leap years via the Date engine). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns a new date `days` after `date` (negative to go backwards). */
export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/**
 * Whole-day difference (`b - a`). Uses UTC midnights so the result is not
 * skewed by daylight-saving-time transitions inside the range.
 */
export function diffInDays(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / MS_PER_DAY);
}

/** Clamps `value` into the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** True when `today` falls within `[start, start + spanDays)`. */
function spanIsCurrent(start: Date, spanDays: number, today: Date): boolean {
  return today >= start && today < addDays(start, spanDays);
}

/**
 * Builds the ordered list of month columns spanning `[start, end]`
 * (inclusive of both endpoints' months). Each column spans its calendar
 * month's day count, so bars stay aligned to real dates.
 */
function buildMonths(start: Date, end: Date, today: Date): TimelineColumn[] {
  const columns: TimelineColumn[] = [];
  let cursor = startOfMonth(start);
  const last = startOfMonth(end);

  while (cursor <= last) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const span = daysInMonth(year, month);
    columns.push({
      key: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: MONTH_FORMATTER.format(cursor),
      startDate: cursor,
      spanDays: span,
      isCurrent: spanIsCurrent(cursor, span, today),
    });
    // Advance to the first day of the next month.
    cursor = new Date(year, month + 1, 1);
  }

  return columns;
}

/**
 * Builds one column per ISO week (Monday-aligned) covering `[start, end]`.
 * The first column snaps back to the Monday on/before `start`.
 */
function buildWeeks(start: Date, end: Date, today: Date): TimelineColumn[] {
  const columns: TimelineColumn[] = [];
  let cursor = startOfWeek(start);
  const last = startOfDay(end);

  while (cursor <= last) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    columns.push({
      key: `w-${y}-${m}-${d}`,
      label: WEEK_FORMATTER.format(cursor),
      startDate: cursor,
      spanDays: 7,
      isCurrent: spanIsCurrent(cursor, 7, today),
    });
    cursor = addDays(cursor, 7);
  }

  return columns;
}

/** Builds one column per calendar day covering `[start, end]` inclusive. */
function buildDays(start: Date, end: Date, today: Date): TimelineColumn[] {
  const columns: TimelineColumn[] = [];
  let cursor = startOfDay(start);
  const last = startOfDay(end);

  while (cursor <= last) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    columns.push({
      key: `d-${y}-${m}-${d}`,
      label: DAY_FORMATTER.format(cursor),
      startDate: cursor,
      spanDays: 1,
      isCurrent: spanIsCurrent(cursor, 1, today),
    });
    cursor = addDays(cursor, 1);
  }

  return columns;
}

/**
 * Builds the ordered header columns spanning `[start, end]` at the requested
 * {@link ZoomLevel}. Returns `[]` if `start > end`.
 */
export function buildColumns(
  start: Date,
  end: Date,
  zoom: ZoomLevel,
  today: Date,
): TimelineColumn[] {
  if (start > end) {
    return [];
  }
  switch (zoom) {
    case 'day':
      return buildDays(start, end, today);
    case 'week':
      return buildWeeks(start, end, today);
    case 'month':
      return buildMonths(start, end, today);
  }
}

/**
 * Maps a calendar date to an x-offset (in px) within the timeline track.
 *
 * Each column occupies exactly `columnWidth` px regardless of how many days
 * it spans. A date is then placed *proportionally inside its own column*, so
 * bars line up with real dates rather than column boundaries:
 *
 *   x = (columnIndex + daysIntoColumn / column.spanDays) * columnWidth
 *
 * Dates before the range clamp to `0`; dates after clamp to the track's
 * right edge. This keeps partially-visible bars from breaking the layout.
 */
export function dateToX(
  date: Date,
  columns: TimelineColumn[],
  columnWidth: number,
): number {
  if (columns.length === 0) {
    return 0;
  }

  const daysFromStart = diffInDays(columns[0].startDate, date);
  if (daysFromStart < 0) {
    return 0;
  }

  // Walk columns, accumulating their day spans until the date's column is found.
  let dayCursor = 0;
  for (let i = 0; i < columns.length; i++) {
    const span = columns[i].spanDays;
    if (daysFromStart < dayCursor + span) {
      const fractionIntoColumn = (daysFromStart - dayCursor) / span;
      return (i + fractionIntoColumn) * columnWidth;
    }
    dayCursor += span;
  }

  // Past the final column — clamp to the track's right edge.
  return columns.length * columnWidth;
}
