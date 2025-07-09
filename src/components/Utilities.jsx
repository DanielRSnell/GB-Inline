import React, { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Collapsible from '@radix-ui/react-collapsible';

export function Utilities() {
  const [searchString, setSearchString] = useState('');
  const [replaceString, setReplaceString] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedUtilities, setExpandedUtilities] = useState({
    replaceAll: false
  });

  // Toggle utility panel
  const toggleUtility = (utilityName) => {
    setExpandedUtilities(prev => ({
      ...prev,
      [utilityName]: !prev[utilityName]
    }));
  };

  // Get all blocks recursively from the page
  const getAllBlocks = () => {
    if (!window.wp?.data) return [];
    
    const { select } = window.wp.data;
    const blocks = select('core/block-editor').getBlocks();
    
    const getAllBlocksRecursive = (blockList) => {
      let allBlocks = [];
      
      blockList.forEach(block => {
        allBlocks.push(block);
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          allBlocks = allBlocks.concat(getAllBlocksRecursive(block.innerBlocks));
        }
      });
      
      return allBlocks;
    };
    
    return getAllBlocksRecursive(blocks);
  };

  // Process string replacement in class names
  const processReplacement = (classNames, search, replace) => {
    if (!classNames || !search) return classNames;
    
    // Split classes into array, process each one, then join back
    const classArray = classNames.split(' ').filter(Boolean);
    const updatedClasses = classArray.map(className => {
      return className.replace(new RegExp(search, 'g'), replace);
    });
    
    return updatedClasses.join(' ');
  };

  // Handle replace all functionality
  const handleReplaceAll = async () => {
    if (!searchString.trim()) {
      alert('Please enter a search string');
      return;
    }

    setIsProcessing(true);
    setResults(null);
    
    try {
      const allBlocks = getAllBlocks();
      let processedBlocks = 0;
      let totalReplacements = 0;
      
      console.log('🔄 Processing', allBlocks.length, 'blocks for replacement:', searchString, '->', replaceString);
      
      if (window.wp?.data) {
        const { dispatch } = window.wp.data;
        const { updateBlockAttributes } = dispatch('core/block-editor');
        
        allBlocks.forEach(block => {
          const currentClassName = block.attributes?.className || '';
          
          if (currentClassName.includes(searchString)) {
            const newClassName = processReplacement(currentClassName, searchString, replaceString);
            
            if (newClassName !== currentClassName) {
              // Count replacements
              const replacementCount = (currentClassName.match(new RegExp(searchString, 'g')) || []).length;
              totalReplacements += replacementCount;
              
              // Update the block
              updateBlockAttributes(block.clientId, {
                className: newClassName
              });
              
              processedBlocks++;
              
              console.log('✅ Updated block:', block.name, 'ClientId:', block.clientId);
              console.log('   Old classes:', currentClassName);
              console.log('   New classes:', newClassName);
            }
          }
        });
        
        setResults({
          totalBlocks: allBlocks.length,
          processedBlocks,
          totalReplacements,
          searchString,
          replaceString
        });
        
        console.log('🎉 Replacement complete!', {
          totalBlocks: allBlocks.length,
          processedBlocks,
          totalReplacements
        });
      }
    } catch (error) {
      console.error('❌ Error during replacement:', error);
      alert('Error during replacement: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear results
  const clearResults = () => {
    setResults(null);
    setSearchString('');
    setReplaceString('');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Utilities</h3>
          <p className="text-sm text-gray-600">
            Tools for managing CSS classes across all blocks on the page
          </p>
        </div>

        {/* Replace All Utility Panel */}
        <Collapsible.Root 
          open={expandedUtilities.replaceAll}
          onOpenChange={() => toggleUtility('replaceAll')}
        >
          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <Collapsible.Trigger asChild>
              <button className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">Replace All</h4>
                    <p className="text-sm text-gray-600">Replace strings in CSS classes across all blocks</p>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedUtilities.replaceAll ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </Collapsible.Trigger>

            <Collapsible.Content>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search for:
                    </label>
                    <input
                      type="text"
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                      placeholder="e.g., -gray-"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isProcessing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Replace with:
                    </label>
                    <input
                      type="text"
                      value={replaceString}
                      onChange={(e) => setReplaceString(e.target.value)}
                      placeholder="e.g., -neutral-"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={handleReplaceAll}
                          disabled={isProcessing || !searchString.trim()}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Replace All
                            </>
                          )}
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                        Replace the search string in all blocks on the page
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>

                  {results && (
                    <button
                      onClick={clearResults}
                      className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Results Display */}
                {results && (
                  <div className="bg-gray-50 rounded-md border border-gray-200 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h5 className="font-medium text-gray-900">Replacement Complete</h5>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Blocks:</span>
                        <span className="ml-2 font-medium">{results.totalBlocks}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Modified Blocks:</span>
                        <span className="ml-2 font-medium text-blue-600">{results.processedBlocks}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Replacements:</span>
                        <span className="ml-2 font-medium text-green-600">{results.totalReplacements}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Search Term:</span>
                        <code className="ml-2 px-1 bg-gray-100 rounded text-xs">{results.searchString}</code>
                      </div>
                    </div>
                    
                    {results.replaceString && (
                      <div className="text-sm">
                        <span className="text-gray-600">Replaced With:</span>
                        <code className="ml-2 px-1 bg-gray-100 rounded text-xs">{results.replaceString}</code>
                      </div>
                    )}
                  </div>
                )}

                {/* Example Usage */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <h5 className="font-medium text-blue-900 mb-2">Example Usage:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Replace <code className="bg-blue-100 px-1 rounded">-gray-</code> with <code className="bg-blue-100 px-1 rounded">-neutral-</code></li>
                    <li>• Replace <code className="bg-blue-100 px-1 rounded">bg-red</code> with <code className="bg-blue-100 px-1 rounded">bg-blue</code></li>
                    <li>• Replace <code className="bg-blue-100 px-1 rounded">text-lg</code> with <code className="bg-blue-100 px-1 rounded">text-xl</code></li>
                  </ul>
                </div>
              </div>
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
      </div>
    </div>
  );
}