export type SalesOrder = {
  Id: number
  ExternalId: string
  SalesOrderNumber: string
  SalesOrderItem: string
  SalesOrderType: string
  SalesOrganization: string
  DistributionChannel: string
  OrganizationDivision: string
  CustomerExternalId: string
  CustomerName: string
  ItemExternalId: string
  WarehouseExternalId: string
  RequestedQty: string
  RequestedDeliveryDate: string
  SalesOrderDate: string
  ScheduledStartDate: string
  ScheduledEndDate: string
  Status: string
  SAPDeliveryStatus: string
  SAPProcessStatus: string
  TotalNetAmount: string
  TransactionCurrency: string
  SourceSystem: string
}
