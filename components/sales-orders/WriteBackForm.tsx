"use client"

import { useState, useMemo } from "react"
import { MaterialIcon } from "@/components/shared/MaterialIcon"
import type { SalesOrder } from "@/lib/types/sales-order"

const SAP_NULL_DATE = '1899-11-30'

function cleanDateValue(iso: string): string {
  if (!iso || iso.startsWith(SAP_NULL_DATE)) return ''
  return iso.split('T')[0]
}

interface WriteBackFormProps {
  order: SalesOrder
}

export function WriteBackForm({ order }: WriteBackFormProps) {
  const originalValues = useMemo(() => ({
    RequestedQty: order.RequestedQty || '',
    RequestedDeliveryDate: cleanDateValue(order.RequestedDeliveryDate),
    ScheduledStartDate: cleanDateValue(order.ScheduledStartDate),
    ScheduledEndDate: cleanDateValue(order.ScheduledEndDate),
  }), [order])

  const [values, setValues] = useState(originalValues)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  // Compute changed fields
  const changedFields = useMemo(() => {
    const changes: Record<string, string> = {}
    for (const [key, val] of Object.entries(values)) {
      const orig = originalValues[key as keyof typeof originalValues]
      if (val !== orig && val !== '') {
        if (key === 'RequestedQty') {
          changes[key] = val
        } else {
          changes[key] = new Date(val).toISOString()
        }
      }
    }
    return changes
  }, [values, originalValues])

  const hasChanges = Object.keys(changedFields).length > 0

  // Validation
  const validationError = useMemo(() => {
    const qty = values.RequestedQty
    if (qty && (isNaN(parseFloat(qty)) || parseFloat(qty) < 0)) {
      return "Requested Qty must be a non-negative number"
    }
    if (values.ScheduledStartDate && values.ScheduledEndDate) {
      if (new Date(values.ScheduledEndDate) < new Date(values.ScheduledStartDate)) {
        return "Scheduled End Date must be on or after Start Date"
      }
    }
    return null
  }, [values])

  const handleSubmit = async () => {
    if (!hasChanges || validationError) return
    setStatus("loading")
    setMessage("")
    try {
      const res = await fetch(`/api/write-back/sales-orders/${order.ExternalId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedFields),
      })
      const data = await res.json()
      if (data.success) {
        setStatus("success")
        setMessage(`Successfully pushed to SAP — ${new Date(data.updatedAt).toLocaleString()}`)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to push to SAP")
      }
    } catch {
      setStatus("error")
      setMessage("Network error — could not reach API")
    }
  }

  const fields = [
    { key: "RequestedQty" as const, label: "Requested Qty", type: "number", min: "0", step: "1" },
    { key: "RequestedDeliveryDate" as const, label: "Requested Delivery Date", type: "date" },
    { key: "ScheduledStartDate" as const, label: "Scheduled Start Date", type: "date" },
    { key: "ScheduledEndDate" as const, label: "Scheduled End Date", type: "date" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <MaterialIcon icon="info" className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-900">Write Back to SAP</p>
            <p className="text-[11px] text-blue-700 mt-1">
              Changes made here will be pushed to SAP S/4HANA via the integration workflow. Only modified fields will be sent.
            </p>
          </div>
        </div>
      </div>

      {fields.map((field) => {
        const isChanged = values[field.key] !== originalValues[field.key] && values[field.key] !== ''
        return (
          <div key={field.key}>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
              {field.label}
              {isChanged && (
                <span className="ml-2 text-[9px] text-amber-600 font-bold normal-case">Modified</span>
              )}
            </label>
            <input
              type={field.type}
              value={values[field.key]}
              min={field.min}
              step={field.step}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                isChanged ? "border-amber-300 bg-amber-50/50" : "border-slate-200"
              }`}
            />
          </div>
        )
      })}

      {validationError && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-2">
          <MaterialIcon icon="warning" className="text-red-500" />
          <p className="text-xs text-red-700">{validationError}</p>
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center gap-2">
          <MaterialIcon icon="check_circle" className="text-green-600" />
          <p className="text-xs text-green-700">{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-2">
          <MaterialIcon icon="error" className="text-red-600" />
          <p className="text-xs text-red-700">{message}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!hasChanges || !!validationError || status === "loading"}
        className="w-full px-4 py-2.5 bg-gradient-to-b from-primary-container to-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Pushing...
          </span>
        ) : (
          "Push Updates to SAP"
        )}
      </button>
    </div>
  )
}
