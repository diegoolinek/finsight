import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6366f1'];

interface ExpenseChartProps {
    categoryBreakdown: Record<string, number>;
}

export function ExpenseChart({ categoryBreakdown }: ExpenseChartProps) {
    const chartData = Object.entries(categoryBreakdown).map(([name, value]) => ({
        name,
        value: Math.abs(value)
    }));

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
                Distribuição por Categoria
            </h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} stroke="#fff" />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                borderColor: '#e2e8f0', 
                                color: '#1e293b',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
