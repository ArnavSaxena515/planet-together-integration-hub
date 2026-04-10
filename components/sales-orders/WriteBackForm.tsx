"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import type { EditableField } from "@/lib/objects/registry";

interface WriteBackFormProps {
  objectType: string;
  externalId: string;
  editableFields: EditableField[];
  initialValues: Record<string, string>;
}

export function WriteBackForm({
  objectType,
  externalId,
  editableFields,
  initialValues,
}: WriteBackFormProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/write-back/${objectType}/${externalId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(`Successfully pushed to SAP at ${new Date().toLocaleString()}`);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to push to SAP");
      }
    } catch {
      setStatus("error");
      setMessage("Network error — could not reach SAP endpoint");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <MaterialIcon icon="info" className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-900">Write Back to SAP</p>
            <p className="text-[11px] text-blue-700 mt-1">
              Changes made here will be pushed to SAP S/4HANA. Only modified fields will be sent.
            </p>
          </div>
        </div>
      </div>

      {editableFields.map((field) => (
        <div key={field.key}>
          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              value={values[field.key] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={values[field.key] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          )}
        </div>
      ))}

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
        disabled={status === "loading"}
        className="w-full px-4 py-2.5 bg-gradient-to-b from-primary-container to-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:brightness-110 disabled:opacity-70"
      >
        {status === "loading" ? "Pushing..." : "Push to SAP"}
      </button>
    </div>
  );
}
