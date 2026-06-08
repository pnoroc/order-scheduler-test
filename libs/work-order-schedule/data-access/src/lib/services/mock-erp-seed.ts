import { MockErpState } from '../models/mock-erp-state.model';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';

/**
 * Seed data for the in-memory mock ERP.
 *
 * Kept separate from the service so the service contains only behaviour, and so
 * a real backend can drop in by swapping how the initial {@link MockErpState}
 * is produced.
 */
const centers: WorkCenterDocument[] = [
  { docId: '1', docType: 'WorkCenter', data: { name: 'Genesis Hardware' } },
  { docId: '2', docType: 'WorkCenter', data: { name: 'Rodriques Electrics' } },
  { docId: '3', docType: 'WorkCenter', data: { name: 'Konsulting Inc' } },
  { docId: '4', docType: 'WorkCenter', data: { name: 'McMarrow Distribution' } },
  { docId: '5', docType: 'WorkCenter', data: { name: 'Spartan Manufacturing' } },
];

const orders: WorkOrderDocument[] = [
  {
    docId: '1',
    docType: 'WorkOrder',
    data: {
      name: 'Frame assembly',
      workCenterId: '1',
      status: 'open',
      startDate: '2026-01-05',
      endDate: '2026-02-10',
    },
  },
  {
    docId: '2',
    docType: 'WorkOrder',
    data: {
      name: 'Wiring harness build',
      workCenterId: '2',
      status: 'in-progress',
      startDate: '2026-01-20',
      endDate: '2026-03-15',
    },
  },
  {
    docId: '3',
    docType: 'WorkOrder',
    data: {
      name: 'QA sample inspection',
      workCenterId: '3',
      status: 'complete',
      startDate: '2026-02-01',
      endDate: '2026-02-05',
    },
  },
  {
    docId: '4',
    docType: 'WorkOrder',
    data: {
      name: 'Tooling retrofit',
      workCenterId: '4',
      status: 'blocked',
      startDate: '2026-02-12',
      endDate: '2026-04-01',
    },
  },
  {
    docId: '5',
    docType: 'WorkOrder',
    data: {
      name: 'Pallet restock',
      workCenterId: '5',
      status: 'open',
      startDate: '2026-03-01',
      endDate: '2026-03-20',
    },
  },
  {
    docId: '6',
    docType: 'WorkOrder',
    data: {
      name: 'Line recommission',
      workCenterId: '1',
      status: 'in-progress',
      startDate: '2026-03-10',
      endDate: '2026-06-15',
    },
  },
  {
    docId: '7',
    docType: 'WorkOrder',
    data: {
      name: 'Circuit board batch',
      workCenterId: '2',
      status: 'complete',
      startDate: '2026-03-25',
      endDate: '2026-04-02',
    },
  },
  {
    docId: '8',
    docType: 'WorkOrder',
    data: {
      name: 'Compliance audit',
      workCenterId: '3',
      status: 'blocked',
      startDate: '2026-04-01',
      endDate: '2026-04-30',
    },
  },
  {
    docId: '9',
    docType: 'WorkOrder',
    data: {
      name: 'Warehouse expansion',
      workCenterId: '4',
      status: 'open',
      startDate: '2026-04-15',
      endDate: '2026-07-01',
    },
  },
  {
    docId: '10',
    docType: 'WorkOrder',
    data: {
      name: 'Motor calibration',
      workCenterId: '5',
      status: 'in-progress',
      startDate: '2026-05-01',
      endDate: '2026-06-10',
    },
  },
  {
    docId: '11',
    docType: 'WorkOrder',
    data: {
      name: 'Firmware flash',
      workCenterId: '1',
      status: 'complete',
      startDate: '2026-05-05',
      endDate: '2026-05-09',
    },
  },
  {
    docId: '12',
    docType: 'WorkOrder',
    data: {
      name: 'Part shortage hold',
      workCenterId: '2',
      status: 'blocked',
      startDate: '2026-05-20',
      endDate: '2026-06-20',
    },
  },
  {
    docId: '13',
    docType: 'WorkOrder',
    data: {
      name: 'Daily safety check',
      workCenterId: '3',
      status: 'open',
      startDate: '2026-06-01',
      endDate: '2026-06-07',
    },
  },
  {
    docId: '14',
    docType: 'WorkOrder',
    data: {
      name: 'Conveyor overhaul',
      workCenterId: '4',
      status: 'in-progress',
      startDate: '2026-06-03',
      endDate: '2026-08-15',
    },
  },
  {
    docId: '15',
    docType: 'WorkOrder',
    data: {
      name: 'Shift handover',
      workCenterId: '5',
      status: 'complete',
      startDate: '2026-06-05',
      endDate: '2026-06-06',
    },
  },
  {
    docId: '16',
    docType: 'WorkOrder',
    data: {
      name: 'Coolant leak repair',
      workCenterId: '1',
      status: 'blocked',
      startDate: '2026-06-10',
      endDate: '2026-07-10',
    },
  },
  {
    docId: '17',
    docType: 'WorkOrder',
    data: {
      name: 'Q3 production run',
      workCenterId: '2',
      status: 'open',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
    },
  },
  {
    docId: '18',
    docType: 'WorkOrder',
    data: {
      name: 'Packaging changeover',
      workCenterId: '3',
      status: 'in-progress',
      startDate: '2026-07-15',
      endDate: '2026-08-01',
    },
  },
  {
    docId: '19',
    docType: 'WorkOrder',
    data: {
      name: 'Final shipment prep',
      workCenterId: '4',
      status: 'complete',
      startDate: '2026-08-01',
      endDate: '2026-08-20',
    },
  },
  {
    docId: '20',
    docType: 'WorkOrder',
    data: {
      name: 'Annual maintenance',
      workCenterId: '5',
      status: 'blocked',
      startDate: '2026-08-10',
      endDate: '2026-10-01',
    },
  },
];

/** Build the initial, fully-populated mock ERP state. */
export const createInitialMockErpState = (): MockErpState => ({
  centers,
  orders,
});
