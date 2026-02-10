import { useEffect, useState } from 'react';
import { financeService } from '../services/api';
import type { DashboardData } from '../types';
import { Calendar, ChevronDown } from 'lucide-react';
import { SummaryCards } from './dashboard/SummaryCards';
import { ExpenseChart } from './dashboard/ExpenseChart';
import { AIInsight } from './dashboard/AIInsight';

type ViewMode = 'monthly' | 'semestral' | 'annual';

export function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('monthly');
    const [currentDate] = useState(new Date());

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const dashboardData = await financeService.getDashboard();
            setData(dashboardData);
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-slate-400 animate-pulse">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Sincronizando dados...</span>
            </div>
        </div>
    );
    
    if (!data) return <div className="text-center p-10 text-slate-500">Nenhum dado encontrado.</div>;

    const monthLabel = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

    return (
        <div className="px-6 max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-2 text-slate-800">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <Calendar size={18} className="text-brand-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Período Atual</span>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-brand-600 transition-colors">
                            <h2 className="text-lg font-bold leading-none">{capitalizedMonth}</h2>
                            <ChevronDown size={16} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                    <TabButton active={viewMode === 'monthly'} onClick={() => setViewMode('monthly')} label="Mensal" />
                    <TabButton active={viewMode === 'semestral'} onClick={() => setViewMode('semestral')} label="Semestral" />
                    <TabButton active={viewMode === 'annual'} onClick={() => setViewMode('annual')} label="Anual" />
                </div>
            </div>

            <SummaryCards data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ExpenseChart categoryBreakdown={data.category_breakdown} />
                </div>

                <div className="lg:col-span-1">
                    <AIInsight insight={data.ai_insight} />
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                active 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
        >
            {label}
        </button>
    );
}
