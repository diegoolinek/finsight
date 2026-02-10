import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { UploadModal } from './components/UploadModal';
import { Header } from './components/Header';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      <Header onOpenModal={() => setIsModalOpen(true)} />

      <main className="py-8">
        <Dashboard key={refreshKey} />
      </main>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
    </div>
  )
}

export default App;