export interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
}

export interface DashboardData {
    total_income: number;
    total_expense: number;
    balance: number;
    category_breakdown: Record<string, number>;
    ai_insight: string;
}

export interface StatementUploadResponse {
    id: number;
    status: string;
    transactions_count: number;
}
