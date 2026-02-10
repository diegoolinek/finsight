import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import type { DashboardData } from '../../types';

interface SummaryCardsProps {
    data: DashboardData;
}

export function SummaryCards({ data }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CompactCard 
                title="Entradas" 
                value={data.total_income} 
                icon={<TrendingUp size={20} />} 
                color="text-emerald-600"
                bgIcon="bg-emerald-50"
            />
            <CompactCard 
                title="Saídas" 
                value={data.total_expense} 
                icon={<TrendingDown size={20} />} 
                color="text-rose-600"
                bgIcon="bg-rose-50"
            />
            <CompactCard 
                title="Saldo em Conta" 
                value={data.balance} 
                icon={<Wallet size={20} />} 
                color="text-blue-600"
                bgIcon="bg-blue-50"
            />
        </div>
    );
}

function CompactCard({ title, value, icon, color, bgIcon }: any) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-brand-200 transition-colors">
            <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                    R$ {Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
            </div>
            <div className={`p-3 rounded-xl ${bgIcon} ${color}`}>
                {icon}
            </div>
        </div>
    );
}
