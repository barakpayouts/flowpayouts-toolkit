
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Upload, Image, Bot, User, Palette, X, RefreshCw } from 'lucide-react';
import { useWidgetConfig } from '@/hooks/use-widget-config';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

interface ChatWindowProps {
  onApplyStyle: (styleChanges: any) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onApplyStyle }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I can help you customize your widget design. Tell me about your brand colors and style preferences, or share your logo or website link.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { config } = useWidgetConfig();

  // Example styles that the AI would generate based on the conversation and uploaded images
  const predefinedStyles = [
    {
      name: "Modern Blue",
      primaryColor: "#243949",
      accentColor: "#0EA5E9",
      backgroundColor: "#304352",
      textColor: "#ffffff",
      borderColor: "#435363",
      borderRadius: 10,
    },
    {
      name: "Tech Purple",
      primaryColor: "#1A1F2C",
      accentColor: "#9b87f5",
      backgroundColor: "#221F26",
      textColor: "#ffffff",
      borderColor: "#3A3544",
      borderRadius: 12,
    },
    {
      name: "Corporate Green",
      primaryColor: "#054232",
      accentColor: "#8FE388",
      backgroundColor: "#0B5D44",
      textColor: "#ffffff",
      borderColor: "#1C7A60",
      borderRadius: 6,
    },
    {
      name: "Vibrant Orange",
      primaryColor: "#5C2101",
      accentColor: "#F97316",
      backgroundColor: "#7A3415",
      textColor: "#ffffff",
      borderColor: "#944830",
      borderRadius: 8,
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedImage) return;

    // Add user message
    const userMessage = input.trim() || (uploadedImage ? "I've uploaded a logo for my brand." : "");
    
    setMessages(prev => [
      ...prev, 
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '', isLoading: true }
    ]);
    
    setInput('');
    setIsProcessing(true);

    // In a real implementation, this would call an AI API
    // For this demo, we'll simulate a response after a delay
    setTimeout(() => {
      simulateAIResponse(userMessage);
      setIsProcessing(false);
      setUploadedImage(null);
    }, 1500);
  };

  const simulateAIResponse = (userMessage: string) => {
    const lowerCaseMsg = userMessage.toLowerCase();
    let aiResponse = '';
    let styleToApply = null;

    // Simulate AI understanding different user inputs
    if (lowerCaseMsg.includes('blue') || lowerCaseMsg.includes('ocean')) {
      aiResponse = "I think a modern blue theme would work well for your brand. It conveys trust and professionalism. I've created a style based on blue tones.";
      styleToApply = predefinedStyles[0];
    } 
    else if (lowerCaseMsg.includes('purple') || lowerCaseMsg.includes('tech')) {
      aiResponse = "A tech-focused purple theme would be perfect for your brand. It looks modern and innovative. I've applied this style to your widget.";
      styleToApply = predefinedStyles[1];
    }
    else if (lowerCaseMsg.includes('green') || lowerCaseMsg.includes('eco') || lowerCaseMsg.includes('nature')) {
      aiResponse = "I've created a natural green theme that aligns with your eco-friendly brand values. This conveys growth and sustainability.";
      styleToApply = predefinedStyles[2];
    }
    else if (lowerCaseMsg.includes('orange') || lowerCaseMsg.includes('warm') || lowerCaseMsg.includes('energetic')) {
      aiResponse = "I've designed a vibrant orange theme that's energetic and bold - perfect for your dynamic brand!";
      styleToApply = predefinedStyles[3];
    }
    else if (uploadedImage || lowerCaseMsg.includes('logo') || lowerCaseMsg.includes('image') || lowerCaseMsg.includes('upload')) {
      aiResponse = "I've analyzed your brand assets and created a custom theme that matches your visual identity. The colors and style elements have been extracted from your logo.";
      // Use a random style for the demo
      styleToApply = predefinedStyles[Math.floor(Math.random() * predefinedStyles.length)];
    }
    else {
      aiResponse = "Based on your preferences, I've created a custom style that should work well for your brand. You can always ask me to adjust specific elements like colors, borders, or spacing.";
      // Use a random style for the demo
      styleToApply = predefinedStyles[Math.floor(Math.random() * predefinedStyles.length)];
    }

    // Update the loading message with the actual response
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = { role: 'assistant', content: aiResponse };
      return newMessages;
    });

    // Apply the style changes
    if (styleToApply) {
      onApplyStyle(styleToApply);
      
      toast.success(`Applied ${styleToApply.name} theme`, {
        description: "The widget styling has been updated."
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Read the file and convert it to a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
        toast.success('Logo uploaded successfully', {
          description: 'The AI will analyze your logo to create a matching style'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-payouts-dark border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-payouts-accent" />
          <h3 className="font-medium">Style Assistant</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
          onClick={() => {
            setMessages([{ 
              role: 'assistant', 
              content: 'Hello! I can help you customize your widget design. Tell me about your brand colors and style preferences, or share your logo or website link.' 
            }]);
            setUploadedImage(null);
          }}
        >
          <RefreshCw size={14} />
        </Button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-black/20">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={cn(
                "flex w-full",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div 
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === 'user' 
                    ? "bg-payouts-accent/20 text-white" 
                    : "bg-white/10 text-white",
                  message.isLoading && "animate-pulse"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'assistant' ? (
                    <Bot size={16} className="text-payouts-accent" />
                  ) : (
                    <User size={16} className="text-payouts-accent" />
                  )}
                  <span className="text-xs font-medium text-white/70">
                    {message.role === 'user' ? 'You' : 'Style AI'}
                  </span>
                </div>
                
                {message.content || (message.isLoading ? 'Designing your style...' : '')}
                
                {index === messages.length - 1 && message.role === 'user' && uploadedImage && (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded logo" 
                        className="max-h-40 rounded-md border border-white/20" 
                      />
                      <button 
                        className="absolute top-1 right-1 bg-black/40 rounded-full p-1 text-white/80 hover:text-white"
                        onClick={() => setUploadedImage(null)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {uploadedImage && (
        <div className="px-4 pt-2">
          <div className="bg-white/10 rounded-md p-2 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-white/70 truncate">
              <Image size={14} className="text-payouts-accent" />
              <span className="truncate">Logo uploaded and ready to analyze</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-white/70 hover:text-white"
              onClick={() => setUploadedImage(null)}
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      )}
      
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex gap-2 items-center">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 h-9 w-9 bg-white/5 border-white/10 hover:bg-white/10"
            onClick={triggerFileInput}
            title="Upload logo"
          >
            <Upload size={16} className="text-white/70" />
          </Button>
          
          <div className="flex-1 bg-white/5 rounded-md flex items-center border border-white/10">
            <textarea
              className="flex-1 py-2 px-3 bg-transparent text-sm text-white placeholder:text-white/50 resize-none outline-none"
              placeholder="Ask about styling, or share your website..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{minHeight: '36px', maxHeight: '120px'}}
            />
          </div>
          
          <Button
            type="button"
            variant="accent"
            size="icon"
            className="shrink-0 h-9 w-9"
            onClick={handleSendMessage}
            disabled={isProcessing || (!input.trim() && !uploadedImage)}
            style={{
              backgroundColor: config.accentColor,
              color: '#143745',
            }}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
