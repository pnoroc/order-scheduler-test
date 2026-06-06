import { OrderDocument } from './order-document.model';

export interface WorkOrderDocument extends OrderDocument {
  data: {
    name: string;
    workCenterId: string; // References WorkCenterDocument.docId
    status: WorkOrderStatus;
    startDate: string; // ISO format (e.g., "2025-01-15")
    endDate: string;
  };
}

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';
