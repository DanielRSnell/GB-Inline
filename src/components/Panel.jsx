import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, useWordPressStore } from '../storage/store.js';
import { PANEL_ANIMATIONS } from '../utils/constants.js';
import { createKeyboardManager } from '../utils/keyboardShortcuts.js';
import { cn } from '../utils/helpers.js';

import { PanelHeader } from './PanelHeader.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { SettingsDialog } from './SettingsDialog.jsx';
import { TailwindDemo } from './TailwindDemo.jsx';

export function Panel() {
  const { 
    isPanelOpen, 
    panelPosition, 
    settings,
    closePanel 
  } = useStore();
  
  const { setServerData } = useWordPressStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [keyboardManager, setKeyboardManager] = useState(null);

  // Initialize keyboard shortcuts
  useEffect(() => {
    if (settings.enableKeyboardShortcuts) {
      const manager = createKeyboardManager(useStore);
      manager.init();
      setKeyboardManager(manager);
      
      return () => {
        manager.destroy();
      };
    }
  }, [settings.enableKeyboardShortcuts]);

  // Initialize server data from WordPress
  useEffect(() => {
    const wpData = window.shadowPluginData;
    if (wpData) {
      setServerData({
        userRole: wpData.userRole || 'guest',
        siteUrl: wpData.siteUrl || window.location.origin,
        userId: wpData.userId || 0,
        settings: wpData.settings || {},
        apiNonce: wpData.nonce || '',
        pluginVersion: wpData.version || '1.0.0',
        isAdmin: wpData.isAdmin || false,
        theme: wpData.theme || 'dark'
      });
    }
  }, [setServerData]);

  const handleCommandSelect = (command) => {
    console.log('Command selected:', command);
    
    // Handle specific command actions
    switch (command.action) {
      case 'open-settings':
        setSettingsOpen(true);
        break;
      case 'export-settings':
        // This will be handled by the settings dialog
        setSettingsOpen(true);
        break;
      case 'reload-styles':
        // Reload Tailwind styles - styles are now server-side injected
        console.log('Tailwind styles are now injected server-side. Refresh the page to reload styles.');
        break;
      default:
        // Default action - you can extend this
        console.log(`No specific action for command: ${command.id}`);
    }
  };

  const getPanelStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      zIndex: 9999999,
      width: `${settings.panelWidth}px`,
      maxWidth: '90vw',
    };

    switch (panelPosition) {
      case 'left':
        return { ...baseStyles, left: 0 };
      case 'center':
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999999,
          width: `${settings.panelWidth}px`,
          maxWidth: '90vw',
          height: '80vh',
          maxHeight: '600px',
        };
      case 'right':
      default:
        return { ...baseStyles, right: 0 };
    }
  };

  const getAnimationConfig = () => {
    if (!settings.enableAnimations) {
      return PANEL_ANIMATIONS.FADE;
    }

    switch (panelPosition) {
      case 'left':
        return {
          ...PANEL_ANIMATIONS.SLIDE,
          initial: { opacity: 0, x: -100 },
          exit: { opacity: 0, x: -100 }
        };
      case 'center':
        return PANEL_ANIMATIONS.SCALE;
      case 'right':
      default:
        return PANEL_ANIMATIONS.SLIDE;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 z-[9999998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
            />

            {/* Panel */}
            <motion.div
              className={cn(
                "bg-background border border-border shadow-lg",
                "flex flex-col overflow-hidden",
                panelPosition === 'center' ? "rounded-lg" : "",
                "max-h-screen"
              )}
              style={getPanelStyles()}
              {...getAnimationConfig()}
            >
              {/* Header */}
              <PanelHeader 
                onClose={closePanel}
                onSettingsClick={() => setSettingsOpen(true)}
              />

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Command Palette */}
                <div className="flex-1 overflow-hidden">
                  <CommandPalette onCommandSelect={handleCommandSelect} />
                </div>

                {/* Tailwind Demo */}
                <div className="flex-shrink-0 p-4 border-t border-gray-700">
                  <TailwindDemo />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {/* Floating Action Button (when panel is closed) */}
      <FloatingActionButton />
    </>
  );
}

function FloatingActionButton() {
  const { isPanelOpen, openPanel, settings } = useStore();

  if (isPanelOpen) return null;

  return (
    <motion.button
      onClick={openPanel}
      className={cn(
        "fixed bottom-5 right-5 z-[9999998]",
        "w-12 h-12 bg-muted border border-border",
        "text-muted-foreground rounded-xl shadow-lg",
        "flex items-center justify-center",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "transition-all duration-200"
      )}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      title="Open Shadow Plugin (Cmd/Ctrl + `)"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatDelay: 3 
        }}
      >
        🚀
      </motion.div>

      {/* Pulse Ring */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-border"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}