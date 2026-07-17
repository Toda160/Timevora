export type BillableFilter = "all" | "billable" | "non-billable";

export interface Filters {
  clientId: string;
  billable: BillableFilter;
  search: string;
}

export const emptyFilters: Filters = {
  clientId: "",
  billable: "all",
  search: "",
};

/** Whether any filter is currently narrowing the results. */
export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.clientId !== "" ||
    filters.billable !== "all" ||
    filters.search.trim() !== ""
  );
}
