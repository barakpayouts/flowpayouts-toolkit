
import { create } from 'zustand';

export type RecipientType = 'vendor' | 'insured' | 'individual' | 'business' | 'contractor';
export type VerificationStep = 'profile' | 'bank' | 'tax' | 'kyc';
export type PayoutMethod = 'bank' | 'crypto' | 'digital' | 'card' | 'prepaid' | 'gift';
export type ButtonStyle = 'rounded' | 'square' | 'pill';
export type BankVerificationMethod = 'plaid' | 'statement' | 'microdeposit';
export type TaxFormType = 'w9' | 'w8';
export type KYCDocumentType = 'passport' | 'id' | 'driver_license';

// Add this interface for the payout method components
export interface PayoutMethodProps {
  onSelect: () => void;
  isSelected?: boolean;
}

interface WidgetConfig {
  // Recipient type
  recipientType: RecipientType;
  
  // Verification steps
  steps: VerificationStep[];
  
  // Payout methods
  payoutMethods: PayoutMethod[];
  
  // UI customization
  showProgressBar: boolean;
  showStepNumbers: boolean;
  
  // Theme customization
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  buttonStyle: ButtonStyle;
}

interface WidgetConfigState {
  config: WidgetConfig;
  setRecipientType: (type: RecipientType) => void;
  toggleStep: (step: VerificationStep) => void;
  togglePayoutMethod: (method: PayoutMethod) => void;
  updateConfig: (updates: Partial<WidgetConfig>) => void;
  setPayoutsOnlyMode: (enabled: boolean) => void;
  resetConfig: () => void;
}

// Default theme values based on Payouts.com brand guidelines
const DEFAULT_PRIMARY_COLOR = '#0f2a35';
const DEFAULT_ACCENT_COLOR = '#d0e92a';
const DEFAULT_BACKGROUND_COLOR = '#143745';
const DEFAULT_TEXT_COLOR = '#ffffff';
const DEFAULT_BORDER_COLOR = '#21404d';

// Default config
const defaultConfig: WidgetConfig = {
  recipientType: 'vendor',
  steps: ['profile', 'kyc', 'bank', 'tax'], // Changed order to put 'kyc' before bank
  payoutMethods: ['bank', 'crypto', 'digital', 'card', 'prepaid', 'gift'],
  showProgressBar: true,
  showStepNumbers: true,
  primaryColor: DEFAULT_PRIMARY_COLOR,
  accentColor: DEFAULT_ACCENT_COLOR,
  backgroundColor: DEFAULT_BACKGROUND_COLOR,
  textColor: DEFAULT_TEXT_COLOR,
  borderColor: DEFAULT_BORDER_COLOR,
  borderRadius: 8,
  buttonStyle: 'rounded',
};

export const useWidgetConfig = create<WidgetConfigState>((set) => ({
  config: defaultConfig,
  
  setRecipientType: (type: RecipientType) => 
    set((state) => ({ 
      config: { ...state.config, recipientType: type } 
    })),
  
  toggleStep: (step: VerificationStep) => 
    set((state) => {
      const steps = state.config.steps.includes(step)
        ? state.config.steps.filter(s => s !== step)
        : [...state.config.steps, step];
      return { config: { ...state.config, steps } };
    }),
  
  togglePayoutMethod: (method: PayoutMethod) => 
    set((state) => {
      const payoutMethods = state.config.payoutMethods.includes(method)
        ? state.config.payoutMethods.filter(m => m !== method)
        : [...state.config.payoutMethods, method];
      return { config: { ...state.config, payoutMethods } };
    }),
  
  updateConfig: (updates: Partial<WidgetConfig>) => {
    console.log("useWidgetConfig: Updating config with", updates);
    
    // Ensure we're applying valid config updates
    return set((state) => {
      const newConfig = { 
        ...state.config, 
        ...updates 
      };
      
      console.log("New widget config:", newConfig);
      return { config: newConfig };
    });
  },
  
  setPayoutsOnlyMode: (enabled: boolean) => 
    set((state) => ({
      config: { 
        ...state.config, 
        steps: enabled ? [] : defaultConfig.steps 
      }
    })),
  
  resetConfig: () => set({ config: defaultConfig }),
}));
