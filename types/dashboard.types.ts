// types/dashboard.types.ts

export interface StatCardData {
    label: string;
    value: number | string;
    icon: string;
    color: "blue" | "orange" | "green" | "red" | "purple";
    badge?: string;
    trend?: string;
}

export interface WorklistFilters {
    priority?: "ALL" | "URGENT" | "NORMAL" | "STAT";
    testType?: string;
    department?: string;
    dateFrom?: string;
    dateTo?: string;
    searchQuery?: string;
}

export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
}