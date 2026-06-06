import { OrderDocument } from './order-document.model';

export interface WorkCenterDocument extends OrderDocument {
  data: {
    name: string;
  };
}
