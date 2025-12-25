import React from 'react';
import { Clock } from 'lucide-react';

function Analytics() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-4 md:py-6">
      <div className="text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-[#F3EFFC] border border-[#E8E0F5] flex items-center justify-center">
          <Clock className="w-8 h-8 md:w-10 md:h-10 text-[#6117F4]" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#1a1a2e] mb-2 md:mb-3">
          Analytics em Breve
        </h2>
        <p className="text-sm md:text-base text-[#6B7280] max-w-md mx-auto leading-relaxed px-4">
          Estamos preparando métricas incríveis para você acompanhar o desempenho de suas criações.
        </p>
      </div>
    </div>
  );
}

export default Analytics;
