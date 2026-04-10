export interface EditableField {
  key: string;
  label: string;
  type: "text" | "date" | "select";
  options?: string[];
}

export interface ObjectConfig {
  name: string;
  slug: string;
  icon: string;
  webhookPath: string;
  writePath: string;
  editableFields: EditableField[];
}

export const objectRegistry: ObjectConfig[] = [
  {
    name: "Sales Orders",
    slug: "sales-orders",
    icon: "receipt_long",
    webhookPath: "/api/webhook/sales-orders",
    writePath: "/api/write-back/sales-orders",
    editableFields: [
      { key: "requestedDeliveryDate", label: "Requested Delivery Date", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Closed"] },
      { key: "requestedQty", label: "Requested Qty", type: "text" },
    ],
  },
];
