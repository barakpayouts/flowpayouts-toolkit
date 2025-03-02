
import React, { useState } from 'react';
import { Check, Wallet } from 'lucide-react';
import { useWidgetConfig } from '@/hooks/use-widget-config';

interface DigitalWalletProps {
  onSelect: () => void;
}

const DigitalWallet: React.FC<DigitalWalletProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const { config } = useWidgetConfig();
  
  const handleSelect = () => {
    setSelected(true);
    onSelect();
  };
  
  return (
    <div 
      className={`payout-method-card group ${selected ? 'selected' : ''}`}
      onClick={handleSelect}
      style={{
        borderRadius: `${config.borderRadius}px`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: selected 
          ? `0 8px 20px -4px ${config.accentColor}30` 
          : '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-center">
        <div 
          className="method-icon relative overflow-hidden"
          style={{
            backgroundColor: `${selected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
            transition: 'all 0.3s ease',
          }}
        >
          <Wallet 
            size={18} 
            className="text-current relative z-10 transition-transform group-hover:scale-110" 
            style={{ color: config.accentColor }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${config.accentColor}40, transparent)`,
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium transition-all duration-200 group-hover:translate-x-0.5">Digital Wallet</h3>
          <p className="text-sm opacity-70 transition-all duration-200 group-hover:translate-x-0.5">Instant transfer</p>
        </div>
        {selected ? (
          <div 
            className="selected-indicator animate-fade-in"
            style={{ 
              backgroundColor: config.accentColor,
              color: config.primaryColor,
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Check size={16} className="animate-scale-in" />
          </div>
        ) : (
          <div 
            className="w-6 h-6 rounded-full border-2 border-white/20 opacity-60 group-hover:opacity-100 transition-all duration-300"
            style={{
              borderColor: `${config.accentColor}50`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DigitalWallet;
