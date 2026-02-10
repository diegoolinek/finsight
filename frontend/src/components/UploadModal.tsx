import { useState } from 'react';
import { Upload, X, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { financeService } from '../services/api';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    async function handleUpload() {
        if (!file) return;
        setLoading(true);
        setStatus('idle');

        try {
            await financeService.uploadStatement(file, month, year);
            setStatus('success');
            setTimeout(() => {
                onSuccess();
                onClose();
                setStatus('idle');
                setFile(null);
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-semibold text-slate-800">Importar Extrato</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">Upload Concluído</h3>
                            <p className="text-slate-500 text-sm mt-1">Seus dados estão sendo processados pela IA.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Inputs de Data */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Mês</label>
                                    <select 
                                        value={month} 
                                        onChange={e => setMonth(parseInt(e.target.value))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Ano</label>
                                    <input 
                                        type="number" 
                                        value={year} 
                                        onChange={e => setYear(parseInt(e.target.value))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Dropzone */}
                            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                file ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                            }`}>
                                <input 
                                    type="file" 
                                    accept=".pdf,image/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="pointer-events-none">
                                    {file ? (
                                        <div className="flex flex-col items-center">
                                            <FileText className="text-brand-600 w-8 h-8 mb-2" />
                                            <p className="text-brand-700 font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="text-slate-400 w-8 h-8 mb-2" />
                                            <p className="text-slate-600 font-medium text-sm">Clique para selecionar</p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, JPG ou PNG</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Erro */}
                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                    <AlertCircle size={16} />
                                    <span>Falha no envio. Verifique o arquivo.</span>
                                </div>
                            )}

                            {/* Botão */}
                            <button 
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                                    !file || loading 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                    : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-md active:translate-y-0.5'
                                }`}
                            >
                                {loading ? 'Enviando...' : 'Processar Documento'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
