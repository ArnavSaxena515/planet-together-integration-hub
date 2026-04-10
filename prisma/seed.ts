import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed 10 Sales Orders
  const orders = [
    { externalId: "1", salesOrderNumber: "1", salesOrderType: "OR", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-001", requestedQty: 100, requestedDeliveryDate: new Date("2023-11-20"), salesOrderDate: new Date("2023-11-01"), status: "C", sapDeliveryStatus: "C", sapProcessStatus: "C", totalNetAmount: 2400, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "2", salesOrderNumber: "2", salesOrderType: "OR", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-002", requestedQty: 50, requestedDeliveryDate: new Date("2023-11-21"), salesOrderDate: new Date("2023-11-02"), status: "B", sapDeliveryStatus: "B", sapProcessStatus: "B", totalNetAmount: 1250, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "3", salesOrderNumber: "3", salesOrderType: "OR", salesOrganization: "1720", distributionChannel: "20", organizationDivision: "00", customerExternalId: "CUS-045", requestedQty: 200, requestedDeliveryDate: new Date("2023-11-25"), salesOrderDate: new Date("2023-11-15"), status: "B", sapDeliveryStatus: "B", sapProcessStatus: "B", totalNetAmount: 12000, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "4", salesOrderNumber: "4", salesOrderType: "OR", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-088", requestedQty: 75, requestedDeliveryDate: new Date("2023-11-26"), salesOrderDate: new Date("2023-11-10"), status: "A", sapDeliveryStatus: "A", sapProcessStatus: "A", totalNetAmount: 4500, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "5", salesOrderNumber: "5", salesOrderType: "QT", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-012", requestedQty: 30, requestedDeliveryDate: new Date("2023-11-28"), salesOrderDate: new Date("2023-11-05"), status: "C", sapDeliveryStatus: "C", sapProcessStatus: "C", totalNetAmount: 850, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "6", salesOrderNumber: "6", salesOrderType: "OR", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-099", requestedQty: 120, requestedDeliveryDate: new Date("2023-11-30"), salesOrderDate: new Date("2023-11-08"), status: "B", sapDeliveryStatus: "B", sapProcessStatus: "B", totalNetAmount: 3100, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "7", salesOrderNumber: "7", salesOrderType: "OR", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-005", requestedQty: 45, requestedDeliveryDate: new Date("2023-12-02"), salesOrderDate: new Date("2023-11-12"), status: "C", sapDeliveryStatus: "C", sapProcessStatus: "C", totalNetAmount: 1100, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "8", salesOrderNumber: "8", salesOrderType: "OR", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-121", requestedQty: 90, requestedDeliveryDate: new Date("2023-12-05"), salesOrderDate: new Date("2023-11-18"), status: "C", sapDeliveryStatus: "C", sapProcessStatus: "C", totalNetAmount: 4800, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "9", salesOrderNumber: "9", salesOrderType: "OR", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-001", requestedQty: 20, requestedDeliveryDate: new Date("2023-12-08"), salesOrderDate: new Date("2023-11-20"), status: "A", sapDeliveryStatus: "A", sapProcessStatus: "A", totalNetAmount: 550, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
    { externalId: "11", salesOrderNumber: "10", salesOrderType: "OR", salesOrganization: "1710", distributionChannel: "10", organizationDivision: "00", customerExternalId: "CUS-001", requestedQty: 60, requestedDeliveryDate: new Date("2023-12-10"), salesOrderDate: new Date("2023-11-22"), status: "B", sapDeliveryStatus: "B", sapProcessStatus: "B", totalNetAmount: 1000, transactionCurrency: "GBP", sourceSystem: "SAP S/4HANA" },
  ];

  for (const order of orders) {
    await prisma.salesOrder.upsert({
      where: { externalId: order.externalId },
      update: order,
      create: order,
    });
  }

  // Seed 6 Sync Log entries
  const logs = [
    { timestamp: new Date("2026-01-03T14:32:00"), direction: "Outbound", objectType: "Sales Orders", recordCount: 1, status: "Success", payload: '{"externalId":"3","fields":["requestedDeliveryDate"]}' },
    { timestamp: new Date("2026-01-03T12:00:00"), direction: "Inbound", objectType: "Sales Orders", recordCount: 150, status: "Success", payload: '{"bulk_sales_orders":[...]}' },
    { timestamp: new Date("2026-01-03T10:45:00"), direction: "Inbound", objectType: "Items", recordCount: 1200, status: "Success" },
    { timestamp: new Date("2026-01-03T09:15:00"), direction: "Outbound", objectType: "Sales Orders", recordCount: 1, status: "Failed", errorMsg: "SAP API timeout after 30s" },
    { timestamp: new Date("2026-01-03T08:00:00"), direction: "Inbound", objectType: "Inventory", recordCount: 450, status: "Success" },
    { timestamp: new Date("2026-01-02T23:59:00"), direction: "Inbound", objectType: "Sales Orders", recordCount: 22, status: "Success" },
  ];

  for (const log of logs) {
    await prisma.syncLog.create({ data: log });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
