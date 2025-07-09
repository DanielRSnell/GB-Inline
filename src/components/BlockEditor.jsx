import React, { useState, useEffect } from 'react';
import { PlainClasses } from './PlainClasses';
import { DynamicAttributesManager } from './DynamicAttributesManager';
import { BlockMarkup } from './BlockMarkup';
import { Utilities } from './Utilities';
import { useBlockStore } from '../storage/store';

export function BlockEditor() {
  const [activeTab, setActiveTab] = useState('classes');
  const { lastSelectedBlock } = useBlockStore();

  const tabs = [
    { id: 'classes', label: 'Plain Classes', component: PlainClasses, requiresBlock: true },
    { id: 'attributes', label: 'Attributes', component: DynamicAttributesManager, requiresBlock: true },
    { id: 'markup', label: 'Markup', component: BlockMarkup, requiresBlock: true },
    { id: 'utilities', label: 'Utilities', component: Utilities, requiresBlock: false }
  ];

  // Filter tabs based on whether a block is selected
  const availableTabs = tabs.filter(tab => !tab.requiresBlock || lastSelectedBlock);
  
  // If no block is selected and we're on a block-required tab, switch to utilities
  useEffect(() => {
    if (!lastSelectedBlock && tabs.find(tab => tab.id === activeTab)?.requiresBlock) {
      setActiveTab('utilities');
    }
  }, [lastSelectedBlock, activeTab]);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation - Always show available tabs */}
      {availableTabs.length > 0 && (
        <div id="gbi-view-tabs" className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}