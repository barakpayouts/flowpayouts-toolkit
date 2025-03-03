
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useWidgetConfig } from '@/hooks/use-widget-config';
import ChatWindow from './ChatWindow';
import { Sparkles, Check, ChevronRight, ScanSearch, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIStyleConfiguratorProps {
  setWidgetKey: (cb: (prev: number) => number) => void;
}

const AIStyleConfigurator: React.FC<AIStyleConfiguratorProps> = ({ setWidgetKey }) => {
  const { config, updateConfig } = useWidgetConfig();
  const [previewStyle, setPreviewStyle] = useState(config);
  const [showPreview, setShowPreview] = useState(false);
  
  const handleStyleChange = (styleChanges: any) => {
    setPreviewStyle({
      ...config,
      ...styleChanges,
    });
    setShowPreview(true);
  };
  
  const applyChanges = () => {
    updateConfig(previewStyle);
    setWidgetKey(prevKey => prevKey + 1);
    setShowPreview(false);
  };
  
  return (
    <div className="bg-black/30 rounded-xl border border-white/10 p-0 overflow-hidden">
      <div className="flex flex-col md:flex-row h-[600px]">
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
          <ChatWindow onApplyStyle={handleStyleChange} />
        </div>
        
        <div className="w-full md:w-1/2 h-1/2 md:h-full border-t md:border-t-0 md:border-l border-white/10 bg-gradient-to-br from-payouts-dark to-payouts-dark/80 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Palette size={20} className="text-payouts-accent" />
            <h3 className="font-medium text-lg">Style Preview</h3>
          </div>
          
          {!showPreview ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <ScanSearch size={28} className="text-white/40" />
              </div>
              <h3 className="text-lg font-medium mb-2">No style changes yet</h3>
              <p className="text-white/60 mb-6 max-w-xs">
                Chat with the Style AI to create a custom look for your widget based on your brand
              </p>
              <div className="flex flex-col items-start gap-3 bg-white/5 p-4 rounded-lg text-sm text-white/70 w-full max-w-xs">
                <p className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-payouts-accent" />
                  "Make it match our website colors"
                </p>
                <p className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-payouts-accent" />
                  "Our brand uses green and blue"
                </p>
                <p className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-payouts-accent" />
                  "Upload our logo to extract colors"
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-3 text-white/70">Color Palette</h4>
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-md mb-1"
                        style={{ backgroundColor: previewStyle.primaryColor }}
                      ></div>
                      <span className="text-xs text-white/60">Primary</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-md mb-1"
                        style={{ backgroundColor: previewStyle.accentColor }}
                      ></div>
                      <span className="text-xs text-white/60">Accent</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-md mb-1"
                        style={{ backgroundColor: previewStyle.backgroundColor }}
                      ></div>
                      <span className="text-xs text-white/60">Background</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-md border border-white/10 mb-1"
                        style={{ backgroundColor: previewStyle.borderColor }}
                      ></div>
                      <span className="text-xs text-white/60">Border</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-3 text-white/70">Style Preview</h4>
                  <div className="space-y-3">
                    <div 
                      className="h-16 rounded-lg border p-3 flex items-center justify-between"
                      style={{ 
                        backgroundColor: previewStyle.backgroundColor,
                        borderColor: previewStyle.borderColor,
                        borderRadius: `${previewStyle.borderRadius}px`,
                      }}
                    >
                      <div className="w-32 h-6 bg-white/10 rounded"></div>
                      <div 
                        className="w-24 h-8 rounded flex items-center justify-center text-xs font-medium"
                        style={{ 
                          backgroundColor: previewStyle.accentColor,
                          color: previewStyle.primaryColor,
                          borderRadius: `${previewStyle.borderRadius}px`,
                        }}
                      >
                        Button
                      </div>
                    </div>
                    
                    <div 
                      className="h-16 rounded-lg border flex items-center gap-3 p-3"
                      style={{ 
                        backgroundColor: previewStyle.backgroundColor,
                        borderColor: previewStyle.borderColor,
                        borderRadius: `${previewStyle.borderRadius}px`,
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: previewStyle.accentColor }}
                      >
                        <Sparkles size={16} style={{ color: previewStyle.primaryColor }} />
                      </div>
                      <div className="flex-1">
                        <div className="w-full h-3 bg-white/10 rounded mb-2"></div>
                        <div className="w-2/3 h-3 bg-white/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-auto"
              >
                <Button 
                  onClick={applyChanges}
                  className="w-full flex items-center justify-center gap-2 py-6 text-payouts-dark font-semibold"
                  style={{ 
                    backgroundColor: previewStyle.accentColor,
                    color: previewStyle.primaryColor,
                  }}
                >
                  <Check size={18} />
                  Apply This Style
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIStyleConfigurator;
