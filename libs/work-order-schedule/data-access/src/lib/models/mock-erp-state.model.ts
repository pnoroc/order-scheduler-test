import { WorkCenterDocument } from './work-center.model';
import { WorkOrderDocument } from './work-order.model';

/**
 * The single, immutable source of truth held by the mock ERP service.
 *
 * Everything the service exposes is *derived* from this shape, so swapping the
 * in-memory `BehaviorSubject` for a real backend later means replacing how this
 * state is produced — not how it is consumed.
 */
export interface MockErpState {
  centers: WorkCenterDocument[];
  orders: WorkOrderDocument[];
}

/**
 * A partial, deeply-mergeable patch for a work order.
 *
 * `Partial<WorkOrderDocument>` alone cannot describe "change only some fields
 * inside `data`" (it would force the whole `data` object). This type allows a
 * partial `data` patch while keeping every field strongly typed.
 */
export type WorkOrderChanges = Partial<Omit<WorkOrderDocument, 'data'>> & {
  data?: Partial<WorkOrderDocument['data']>;
};
