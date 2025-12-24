import React from 'react';
import { Clock } from 'lucide-react';

function Analytics() {
  return (
    <div className="flex-1 flex items-center justify-center px-8 py-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F3EFFC] border border-[#E8E0F5] flex items-center justify-center">
          <Clock className="w-10 h-10 text-[#6117F4]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">
          Analytics em Breve
        </h2>
        <p className="text-[#6B7280] max-w-md mx-auto leading-relaxed">
          Estamos preparando métricas incríveis para você acompanhar o desempenho de suas criações.
        </p>
      </div>
    </div>
  );
}

export default Analytics;
