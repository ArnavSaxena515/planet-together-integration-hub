import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orders = body.bulk_sales_orders || (body.single_sales_order ? [body.single_sales_order] : []);

    let upserted = 0;
    for (const order of orders) {
      await prisma.salesOrder.upsert({
        where: { externalId: String(order.ExternalId || order.externalId) },
        update: {
          salesOrderNumber: String(order.SalesOrderNumber || order.salesOrderNumber || order.ExternalId || order.externalId),
          salesOrderType: order.SalesOrderType || order.salesOrderType || "OR",
          salesOrganization: order.SalesOrganization || order.salesOrganization || "",
          distributionChannel: order.DistributionChannel || order.distributionChannel || "",
          organizationDivision: order.OrganizationDivision || order.organizationDivision || "",
          customerExternalId: order.CustomerExternalId || order.customerExternalId || "",
          requestedQty: Number(order.RequestedQty || order.requestedQty || 0),
          requestedDeliveryDate: new Date(order.RequestedDeliveryDate || order.requestedDeliveryDate),
          salesOrderDate: new Date(order.SalesOrderDate || order.salesOrderDate),
          status: order.Status || order.status || "",
          sapDeliveryStatus: order.SapDeliveryStatus || order.sapDeliveryStatus || "",
          sapProcessStatus: order.SapProcessStatus || order.sapProcessStatus || "",
          totalNetAmount: Number(order.TotalNetAmount || order.totalNetAmount || 0),
          transactionCurrency: order.TransactionCurrency || order.transactionCurrency || "",
          sourceSystem: order.SourceSystem || order.sourceSystem || "SAP S/4HANA",
        },
        create: {
          externalId: String(order.ExternalId || order.externalId),
          salesOrderNumber: String(order.SalesOrderNumber || order.salesOrderNumber || order.ExternalId || order.externalId),
          salesOrderType: order.SalesOrderType || order.salesOrderType || "OR",
          salesOrganization: order.SalesOrganization || order.salesOrganization || "",
          distributionChannel: order.DistributionChannel || order.distributionChannel || "",
          organizationDivision: order.OrganizationDivision || order.organizationDivision || "",
          customerExternalId: order.CustomerExternalId || order.customerExternalId || "",
          requestedQty: Number(order.RequestedQty || order.requestedQty || 0),
          requestedDeliveryDate: new Date(order.RequestedDeliveryDate || order.requestedDeliveryDate),
          salesOrderDate: new Date(order.SalesOrderDate || order.salesOrderDate),
          status: order.Status || order.status || "",
          sapDeliveryStatus: order.SapDeliveryStatus || order.sapDeliveryStatus || "",
          sapProcessStatus: order.SapProcessStatus || order.sapProcessStatus || "",
          totalNetAmount: Number(order.TotalNetAmount || order.totalNetAmount || 0),
          transactionCurrency: order.TransactionCurrency || order.transactionCurrency || "",
          sourceSystem: order.SourceSystem || order.sourceSystem || "SAP S/4HANA",
        },
      });
      upserted++;
    }

    await prisma.syncLog.create({
      data: {
        direction: "Inbound",
        objectType: "Sales Orders",
        recordCount: upserted,
        status: "Success",
        payload: JSON.stringify(orders).slice(0, 500),
      },
    });

    return NextResponse.json({ success: true, upserted });
  } catch (error: any) {
    await prisma.syncLog.create({
      data: {
        direction: "Inbound",
        objectType: "Sales Orders",
        recordCount: 0,
        status: "Failed",
        errorMsg: error.message,
      },
    });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
