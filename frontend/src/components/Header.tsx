import { Plus } from 'lucide-react';

interface HeaderProps {
  onOpenModal: () => void;
}

export function Header({ onOpenModal }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Fin<span className="text-brand-600 font-bold">sight</span>
          </h1>
        </div>

        <button 
          onClick={onOpenModal}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus size={18} />
          Novo Extrato
        </button>
      </div>
    </header>
  );
}
