import { Sparkles } from 'lucide-react';

interface AIInsightProps {
    insight: string;
}

export function AIInsight({ insight }: AIInsightProps) {
    return (
        <div className="bg-white border border-brand-100 p-6 rounded-xl shadow-sm h-full relative overflow-hidden group hover:shadow-md transition-shadow">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
            
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                    <Sparkles size={18} />
                </div>
                <h3 className="font-semibold text-slate-800">Consultor Inteligente</h3>
            </div>

            <div className="prose prose-sm text-slate-600 leading-relaxed">
                <p className="text-sm">
                    {insight}
                </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Análise via Gemini 2.5</span>
                <button className="text-xs text-brand-600 font-semibold hover:underline">
                    Ver detalhes
                </button>
            </div>
        </div>
    );
}
