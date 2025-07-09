import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/helpers.js';
// import { reloadTailwindStyles } from '../TailwindLoader.jsx'; // No longer needed - server-side injection
import { useStore } from '../storage/store.js';

export function TailwindDemo() {
  const [isReloading, setIsReloading] = useState(false);
  const { settings } = useStore();

  const handleReloadStyles = async () => {
    setIsReloading(true);
    try {
      // Styles are now injected server-side, so just simulate reload
      console.log('Tailwind styles are now injected server-side. Refresh the page to reload styles.');
      setTimeout(() => setIsReloading(false), 1000);
    } catch (error) {
      console.error('Failed to reload styles:', error);
      setIsReloading(false);
    }
  };

  return (
    <motion.div
      className="p-6 bg-card rounded-lg border border-border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Tailwind CSS Demo
          </h3>
        </div>
        
        <motion.button
          onClick={handleReloadStyles}
          disabled={isReloading}
          className={cn(
            "p-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reload Tailwind Styles"
        >
          <motion.svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={isReloading ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: isReloading ? Infinity : 0, ease: "linear" }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </motion.svg>
        </motion.button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        These styles are loaded dynamically from the WordPress API into the Shadow DOM. 
        Changes to your Tailwind CSS will be reflected here after rebuilding.
      </p>

      {/* Demo Elements Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Color Palette */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">Color Palette</h4>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-destructive rounded-md shadow-sm" title="Destructive"></div>
            <div className="w-8 h-8 bg-green-500 rounded-md shadow-sm" title="Green 500"></div>
            <div className="w-8 h-8 bg-primary rounded-md shadow-sm" title="Primary"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-md shadow-sm" title="Yellow 500"></div>
            <div className="w-8 h-8 bg-purple-500 rounded-md shadow-sm" title="Purple 500"></div>
            <div className="w-8 h-8 bg-pink-500 rounded-md shadow-sm" title="Pink 500"></div>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">Design System</h4>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full" style={{width: '1rem'}} title="Muted"></div>
            <div className="h-2 bg-secondary rounded-full" style={{width: '2rem'}} title="Secondary"></div>
            <div className="h-2 bg-accent rounded-full" style={{width: '3rem'}} title="Accent"></div>
            <div className="h-2 bg-primary rounded-full" style={{width: '4rem'}} title="Primary"></div>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-card-foreground">Interactive Elements</h4>
        
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors shadow-sm">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-md transition-colors">
            Secondary Button
          </button>
          <button className="px-4 py-2 border border-input text-foreground hover:bg-accent text-sm font-medium rounded-md transition-colors">
            Outline Button
          </button>
        </div>

        {/* Form Elements */}
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="text" 
            placeholder="Text input" 
            className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
          />
          <select className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground">
            <option>Select option</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>

        {/* Badge Examples */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Success
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Warning
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Error
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Info
          </span>
        </div>
      </div>

      {/* Feature List */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Features Demonstrated</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>Dynamic CSS loading from WordPress API</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>Shadow DOM style isolation</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>Tailwind utility classes</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>Responsive design components</span>
          </li>
        </ul>
      </div>

      {/* Status */}
      <div className="mt-4 flex items-center justify-between text-xs text-blue-600">
        <span>Tailwind CSS v4.1.11</span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Styles Active</span>
        </span>
      </div>
    </motion.div>
  );
}