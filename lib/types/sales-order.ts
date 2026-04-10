export interface SalesOrder {
  id: number;
  externalId: string;
  salesOrderNumber: string;
  salesOrderType: string;
  salesOrganization: string;
  distributionChannel: string;
  organizationDivision: string;
  customerExternalId: string;
  requestedQty: number;
  requestedDeliveryDate: string;
  salesOrderDate: string;
  status: string;
  sapDeliveryStatus: string;
  sapProcessStatus: string;
  totalNetAmount: number;
  transactionCurrency: string;
  sourceSystem: string;
  createdAt: string;
  updatedAt: string;
}
