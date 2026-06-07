import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import {
  PositionedRow,
  TimelineColumn,
  TimelineRow,
  ZoomLevel,
} from './timeline.model';
import {
  addDays,
  buildColumns,
  clamp,
  dateToX,
  MIN_BAR_WIDTH,
  startOfDay,
} from './timeline.util';
import { BadgeComponent } from '../badge/badge.component';

/**
 * A reusable, horizontally-scrollable timeline board.
 *
 * Month columns are generated dynamically from `[startDate, endDate]`, and
 * each row's items are positioned by date. Layout uses CSS Grid for the
 * sticky title column + scrollable track, with `position: sticky` providing
 * the fixed left column and fixed top header. Presentation lives in the
 * template/styles; all date + geometry maths live in `timeline.util.ts`.
 *
 * @example
 * <ostt-timeline-board
 *   [startDate]="start"
 *   [endDate]="end"
 *   [rows]="rows"
 *   titleColumn="Team"
 * />
 */
@Component({
  selector: 'ostt-timeline-board',
  templateUrl: './timeline-board.component.html',
  styleUrl: './timeline-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent],
})
export class TimelineBoardComponent {
  startDate = input.required<Date>();
  endDate = input.required<Date>();
  rows = input.required<TimelineRow[]>();
  zoomLevel = input<ZoomLevel>('month');
  monthWidth = input<number>(160);
  labelWidth = input<number>(220);
  rowHeight = input<number>(56);
  titleColumn = input<string>('Title');
  showToday = input<boolean>(true);
  defaultColor = input<string>('#3b82f6');

  /** Today, normalised to midnight — captured once per instance. */
  private readonly today = startOfDay(new Date());

  /** Dynamically generated columns for the current range + zoom level. */
  readonly columns = computed<TimelineColumn[]>(() =>
    buildColumns(
      this.startDate(),
      this.endDate(),
      this.zoomLevel(),
      this.today,
    ),
  );

  /** Total pixel width of the scrollable track (columns × column width). */
  readonly trackWidth = computed<number>(
    () => this.columns().length * this.monthWidth(),
  );

  placeholderItem = signal<{ rowId: string; positionX: number } | undefined>(
    undefined,
  );

  /** Rows with every item resolved to absolute `left`/`width` pixels. */
  readonly positionedRows = computed<PositionedRow[]>(() => {
    const columns = this.columns();
    const columnWidth = this.monthWidth();
    const trackWidth = columns.length * columnWidth;
    const fallback = this.defaultColor();

    return this.rows().map((row) => {
      let bars = row.items.map((item) => {
        const left = clamp(
          dateToX(item.startDate, columns, columnWidth),
          0,
          trackWidth,
        );
        // `endDate` is inclusive, so extend by one day to cover its full cell.
        const right = clamp(
          dateToX(addDays(item.endDate, 1), columns, columnWidth),
          0,
          trackWidth,
        );

        return {
          ...item,
          color: item.color ?? fallback,
          left,
          width: Math.max(MIN_BAR_WIDTH, right - left),
        };
      });

      if (this.placeholderItem()?.rowId === row.id) {
        console.log('placeholderItem', this.placeholderItem());
        bars = [
          ...bars,
          {
            color: 'red',
            left: this.placeholderItem()?.positionX as number,
            width: 113,
            startDate: new Date(),
            endDate: new Date(),
            id: '',
            label: '',
          },
        ];
      }

      return {
        id: row.id,
        title: row.title,
        bars,
      };
    });
  });

  /**
   * X-offset of the "today" line within the track, or `null` when today is
   * outside the range or the indicator is disabled.
   */
  readonly todayX = computed<number | null>(() => {
    if (!this.showToday()) {
      return null;
    }
    const columns = this.columns();
    if (columns.length === 0) {
      return null;
    }
    const first = columns[0];
    const last = columns[columns.length - 1];
    const inRange =
      this.today >= first.startDate &&
      this.today < addDays(last.startDate, last.spanDays);
    return inRange ? dateToX(this.today, columns, this.monthWidth()) : null;
  });

  addItemPlaceholderToRow(x: number, item: PositionedRow) {
    this.placeholderItem.set({ rowId: item.id, positionX: x });
  }
}
