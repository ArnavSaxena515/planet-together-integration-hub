"use client"

import { useEffect, useState } from "react"
import { MaterialIcon } from "@/components/shared/MaterialIcon"
import { useAppStore } from "@/lib/store"
import { formatSAPDate, formatAmount, formatQty } from "@/lib/utils/format"
import { WriteBackForm } from "./WriteBackForm"
import type { SalesOrder } from "@/lib/types/sales-order"

interface SalesOrderSlideOverProps {
  orders: SalesOrder[]
}

export function SalesOrderSlideOver({ orders }: SalesOrderSlideOverProps) {
  const { slideOverOpen, activeOrderId, closeSlideOver } = useAppStore()
  const [activeTab, setActiveTab] = useState<"details" | "writeback">("details")
  const order = orders.find((o) => o.ExternalId === activeOrderId)

  useEffect(() => {
    setActiveTab("details")
  }, [activeOrderId])

  if (!order) return null

  return (
    <div
      className={`fixed top-0 right-0 h-screen w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-slate-100 ${
        slideOverOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-14 px-6 flex items-center justify-between bg-surface-container-low border-b border-slate-200/30">
          <div className="flex items-center gap-3">
            <MaterialIcon icon="receipt_long" className="text-primary" />
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-tight">
              Sales Order #{order.SalesOrderNumber}
            </h3>
          </div>
          <button onClick={closeSlideOver} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
            <MaterialIcon icon="close" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider ${
              activeTab === "details" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600 transition-colors"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("writeback")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider ${
              activeTab === "writeback" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600 transition-colors"
            }`}
          >
            Write Back to SAP
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {activeTab === "details" ? (
            <>
              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-surface-container-high px-2 py-1 inline-block rounded">Order Info</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Order Number</p>
                    <p className="text-xs font-semibold text-on-surface">{order.SalesOrderNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Order Type</p>
                    <p className="text-xs font-semibold text-on-surface">{order.SalesOrderType === "OR" ? "Standard Order (OR)" : order.SalesOrderType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Customer Name</p>
                    <p className="text-xs font-semibold text-on-surface">{order.CustomerName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Customer ID</p>
                    <p className="text-xs font-semibold text-on-surface">{order.CustomerExternalId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Requested Qty</p>
                    <p className="text-xs font-semibold text-on-surface">{formatQty(order.RequestedQty)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Item ID</p>
                    <p className="text-xs font-semibold text-on-surface">{order.ItemExternalId || '—'}</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-surface-container-high px-2 py-1 inline-block rounded">Organization</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Sales Org</p>
                    <p className="text-xs font-semibold text-on-surface">{order.SalesOrganization}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Dist. Channel</p>
                    <p className="text-xs font-semibold text-on-surface">{order.DistributionChannel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Division</p>
                    <p className="text-xs font-semibold text-on-surface">{order.OrganizationDivision}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Warehouse</p>
                    <p className="text-xs font-semibold text-on-surface">{order.WarehouseExternalId || '—'}</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-surface-container-high px-2 py-1 inline-block rounded">Financials</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Net Amount</p>
                    <p className="text-sm font-bold text-primary">{formatAmount(order.TotalNetAmount, order.TransactionCurrency)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Currency</p>
                    <p className="text-xs font-semibold text-on-surface">{order.TransactionCurrency}</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-surface-container-high px-2 py-1 inline-block rounded">Dates</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Order Date</p>
                    <p className="text-xs font-semibold text-on-surface">{formatSAPDate(order.SalesOrderDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Requested Delivery</p>
                    <p className="text-xs font-semibold text-on-surface">{formatSAPDate(order.RequestedDeliveryDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Scheduled Start</p>
                    <p className="text-xs font-semibold text-on-surface">{formatSAPDate(order.ScheduledStartDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Scheduled End</p>
                    <p className="text-xs font-semibold text-on-surface">{formatSAPDate(order.ScheduledEndDate)}</p>
                  </div>
                </div>
              </section>

              <section className="bg-surface p-4 rounded-lg">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">SAP Status</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Source System</span>
                    <span className="text-xs font-mono font-bold text-primary">{order.SourceSystem}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Delivery Status</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-sm">
                      {order.SAPDeliveryStatus === "C" ? "DELIVERED" : order.SAPDeliveryStatus === "A" ? "NOT STARTED" : "PENDING"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Process Status</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-sm">
                      {order.SAPProcessStatus === "C" ? "COMPLETE" : order.SAPProcessStatus === "A" ? "NOT STARTED" : "PENDING"}
                    </span>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <WriteBackForm order={order} />
          )}
        </div>

        {activeTab === "details" && (
          <div className="p-6 bg-surface-container-low border-t border-slate-200/50 flex gap-3">
            <button className="flex-1 px-4 py-2.5 bg-gradient-to-b from-primary-container to-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:brightness-110">
              Process Selection
            </button>
            <button onClick={closeSlideOver} className="px-4 py-2.5 bg-white text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-slate-50 border border-slate-200/50">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
