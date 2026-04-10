export type StatusCode = "A" | "B" | "C" | "";

export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
}

export const statusMap: Record<StatusCode, StatusConfig> = {
  A: { label: "Not Started", bg: "bg-[#E8EDF5]", text: "text-[#5B7499]" },
  B: { label: "In Progress", bg: "bg-[#FFF3CD]", text: "text-[#A0760A]" },
  C: { label: "Complete", bg: "bg-[#D4EDDA]", text: "text-[#1E7E3B]" },
  "": { label: "Unknown", bg: "bg-[#F1F1F1]", text: "text-[#999999]" },
};
