import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import * as Label from '@radix-ui/react-label';
import { useStore, useWordPressStore } from '../storage/store.js';
import { THEMES, PANEL_POSITIONS } from '../utils/constants.js';
import { cn, downloadAsJson } from '../utils/helpers.js';

export function SettingsDialog({ open, onOpenChange }) {
  const { 
    settings, 
    panelPosition, 
    updateSetting, 
    setPanelPosition,
    exportSettings,
    importSettings,
    resetSettings
  } = useStore();
  
  const { serverData } = useWordPressStore();
  const [activeTab, setActiveTab] = useState('general');

  const handleExportSettings = () => {
    const data = {
      settings,
      panelPosition,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    downloadAsJson(data, 'shadow-plugin-settings.json');
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        importSettings(JSON.stringify(imported));
        // Reset file input
        event.target.value = '';
      } catch (error) {
        console.error('Failed to import settings:', error);
        alert('Failed to import settings. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000000] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
        />
        <Dialog.Content 
          className={cn(
            "fixed left-[50%] top-[50%] z-[1000001] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%]",
            "bg-gray-900 border border-gray-700 rounded-xl shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "max-h-[85vh] overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <Dialog.Title className="text-xl font-semibold text-white">
                Plugin Settings
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-400 mt-1">
                Configure your plugin preferences and demo options
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {/* Tabs */}
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <Tabs.List className="flex border-b border-gray-700 bg-gray-800/50">
              <Tabs.Trigger 
                value="general" 
                className="px-6 py-3 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-white hover:border-gray-600 data-[state=active]:text-white data-[state=active]:border-blue-500 transition-colors"
              >
                General
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="appearance" 
                className="px-6 py-3 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-white hover:border-gray-600 data-[state=active]:text-white data-[state=active]:border-blue-500 transition-colors"
              >
                Appearance
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="data" 
                className="px-6 py-3 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-white hover:border-gray-600 data-[state=active]:text-white data-[state=active]:border-blue-500 transition-colors"
              >
                Data
              </Tabs.Trigger>
            </Tabs.List>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <Tabs.Content value="general" className="space-y-6">
                <GeneralSettings settings={settings} updateSetting={updateSetting} />
              </Tabs.Content>

              <Tabs.Content value="appearance" className="space-y-6">
                <AppearanceSettings 
                  settings={settings} 
                  panelPosition={panelPosition}
                  updateSetting={updateSetting}
                  setPanelPosition={setPanelPosition}
                />
              </Tabs.Content>

              <Tabs.Content value="data" className="space-y-6">
                <DataSettings 
                  serverData={serverData}
                  onExport={handleExportSettings}
                  onImport={handleImportSettings}
                  onReset={resetSettings}
                />
              </Tabs.Content>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800/50">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Save Changes
                </button>
              </Dialog.Close>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function GeneralSettings({ settings, updateSetting }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">General Preferences</h3>
        <div className="space-y-4">
          <SwitchSetting
            label="Enable Notifications"
            description="Show notifications for plugin events and updates"
            checked={settings.enableNotifications}
            onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
          />
          
          <SwitchSetting
            label="Enable Keyboard Shortcuts"
            description="Use keyboard shortcuts to control the plugin"
            checked={settings.enableKeyboardShortcuts}
            onCheckedChange={(checked) => updateSetting('enableKeyboardShortcuts', checked)}
          />
          
          <SwitchSetting
            label="Auto-open Panel"
            description="Automatically open the panel when the plugin loads"
            checked={settings.autoOpenPanel}
            onCheckedChange={(checked) => updateSetting('autoOpenPanel', checked)}
          />
          
          <SwitchSetting
            label="Enable Animations"
            description="Use smooth animations and transitions"
            checked={settings.enableAnimations}
            onCheckedChange={(checked) => updateSetting('enableAnimations', checked)}
          />
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings({ settings, panelPosition, updateSetting, setPanelPosition }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Appearance</h3>
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <Label.Root className="text-sm font-medium text-gray-300 mb-3 block">
              Theme
            </Label.Root>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(THEMES).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateSetting('theme', theme)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-sm font-medium transition-colors capitalize",
                    settings.theme === theme
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500"
                  )}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Panel Position */}
          <div>
            <Label.Root className="text-sm font-medium text-gray-300 mb-3 block">
              Panel Position
            </Label.Root>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(PANEL_POSITIONS).map((position) => (
                <button
                  key={position}
                  onClick={() => setPanelPosition(position)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-sm font-medium transition-colors capitalize",
                    panelPosition === position
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500"
                  )}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          {/* Panel Width */}
          <div>
            <Label.Root className="text-sm font-medium text-gray-300 mb-3 block">
              Panel Width: {settings.panelWidth}px
            </Label.Root>
            <input
              type="range"
              min="300"
              max="800"
              value={settings.panelWidth}
              onChange={(e) => updateSetting('panelWidth', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DataSettings({ serverData, onExport, onImport, onReset }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Server Data</h3>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <pre className="text-xs text-gray-300 overflow-x-auto">
            {JSON.stringify(serverData, null, 2)}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">Settings Management</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export Settings
            </button>
            <span className="text-sm text-gray-400">Download your settings as JSON</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Import Settings
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-400">Load settings from JSON file</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
            <span className="text-sm text-gray-400">Restore default settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwitchSetting({ label, description, checked, onCheckedChange }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <Label.Root className="text-sm font-medium text-gray-300 cursor-pointer">
          {label}
        </Label.Root>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "w-11 h-6 bg-gray-700 rounded-full relative transition-colors duration-200",
          "data-[state=checked]:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        )}
      >
        <Switch.Thumb 
          className={cn(
            "block w-5 h-5 bg-white rounded-full transition-transform duration-200",
            "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
            "translate-y-0.5"
          )}
        />
      </Switch.Root>
    </div>
  );
}