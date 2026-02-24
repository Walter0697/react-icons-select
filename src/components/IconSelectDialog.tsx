import React, { useRef, useState, useEffect } from 'react';
import { IconComponent } from './getIconComponent';
import { getAllIconNames, searchIcons, iconPacks } from './getAllIcons';
import { DEFAULT_ICON_OPTIONS } from './defaultIconOptions';

export interface IconSelectDialogProps {
  value?: string;
  onChange?: (value: string) => void;
  iconOptions?: string[];
  isOpen: boolean;
  onClose: () => void;
  maxResults?: number; // Maximum number of results to show when searching
  defaultIconOptions?: string[]; // Default icons to show when no search is active
  darkMode?: boolean; // Add dark mode prop
  showLibrarySelection?: boolean; // Option to show or hide library selection
}

export const IconSelectDialog: React.FC<IconSelectDialogProps> = ({
  value,
  onChange,
  iconOptions,
  isOpen,
  onClose,
  maxResults = 48, // Default to 48 results (4x12 grid)
  defaultIconOptions = DEFAULT_ICON_OPTIONS,
  darkMode = false,
  showLibrarySelection = true // Default to showing library selection
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<string | undefined>(undefined);
  
  // Constants for consistent sizing
  const ICON_SIZE = 24; // Size in pixels for the icon
  const BUTTON_SIZE = 80; // Size in pixels for the button
  
  // Get icons to display based on current state
  const getIconsToDisplay = () => {
    if (searchTerm.trim() === '' && !selectedPack) {
      return iconOptions ?? defaultIconOptions;
    }
    
    // If search term is provided, filter icons by search
    if (searchTerm.trim() !== '') {
      return searchIcons(searchTerm, maxResults, selectedPack);
    }
    
    // If a specific pack is selected, show top N icons from that pack
    if (selectedPack) {
      return searchIcons('', maxResults, selectedPack);
    }
    
    // Otherwise, show default icon options (when "All" is selected)
    return defaultIconOptions;
  };
  
  // Initialize and filter icons
  useEffect(() => {
    const updateIcons = async () => {
      setIsLoading(true);
      const results = getIconsToDisplay();
      setFilteredIcons(results);
      setIsLoading(false);
    };
    
    updateIcons();
  }, [searchTerm, selectedPack, iconOptions, defaultIconOptions, maxResults]);
  
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  // Reset search when dialog opens or closes
  useEffect(() => {
    setSearchTerm('');
    setSelectedPack(undefined);
    if (isOpen) {
      setIsLoading(true);
      setFilteredIcons(defaultIconOptions);
      setIsLoading(false);
    }
  }, [isOpen, defaultIconOptions]);

  const handleIconPick = (iconName: string) => {
    if (onChange) onChange(iconName);
    onClose();
  };
  
  // Handle library selection
  const handleLibrarySelect = (packName: string | undefined) => {
    setSelectedPack(packName);
    setSearchTerm(''); // Clear search when changing libraries
    
    // Force update icons based on the newly selected pack
    const updatedIcons = packName 
      ? searchIcons('', maxResults, packName)
      : defaultIconOptions;
    
    setFilteredIcons(updatedIcons);
  };

  return (
    <dialog 
      ref={dialogRef} 
      style={{
        padding: '1.5rem',
        position: 'fixed',
        margin: 'auto',
        backgroundColor: darkMode ? '#1f2937' : 'white',
        color: darkMode ? '#e5e7eb' : '#1f2937',
        borderRadius: '16px',
        border: `2px solid ${darkMode ? '#6366f1' : '#4f46e5'}`,
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '90vw',
        maxHeight: '85vh',
        overflow: 'auto'
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <style>
        {`
          dialog::backdrop {
            background-color: ${darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
          }
        `}
      </style>
      <div style={{ minWidth: '320px', maxWidth: '600px' }}>
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center',
            color: darkMode ? '#e5e7eb' : '#1f2937'
          }}>
            Select an Icon
          </h2>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 150ms',
              background: 'none',
              border: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#374151';
              e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Search input */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
              fontSize: '1rem',
              outline: 'none',
              backgroundColor: darkMode ? '#374151' : 'white',
              color: darkMode ? '#e5e7eb' : '#1f2937',
              transition: 'border-color 150ms ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = darkMode ? '#6366f1' : '#4f46e5';
              e.target.style.boxShadow = darkMode 
                ? '0 0 0 3px rgba(99, 102, 241, 0.3)' 
                : '0 0 0 3px rgba(79, 70, 229, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? '#4b5563' : '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          <div style={{ fontSize: '0.75rem', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '0.5rem' }}>
            {filteredIcons.length > 0 
              ? `Showing ${filteredIcons.length} icons ${searchTerm ? `matching "${searchTerm}"` : ''}${selectedPack ? ` from ${selectedPack}` : ''}`
              : 'No icons found'}
          </div>
        </div>
        
        {/* Icons grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem', 
          marginTop: '1rem',
          height: '320px',
          overflowY: 'auto',
          borderTop: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
          borderBottom: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
          padding: '1rem 0',
          justifyItems: 'center'
        }}>
          {isLoading ? (
            <div style={{ 
              gridColumn: 'span 4', 
              textAlign: 'center', 
              padding: '2rem',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              Loading icons...
            </div>
          ) : filteredIcons.length > 0 ? (
            Array.from(new Set(filteredIcons)).map((icon) => (
              <button
                key={icon}
                type="button"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  width: BUTTON_SIZE,
                  height: BUTTON_SIZE,
                  borderRadius: '0.5rem',
                  border: value === icon 
                    ? `1px solid ${darkMode ? '#6366f1' : '#3b82f6'}`
                    : `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  backgroundColor: value === icon 
                    ? darkMode ? '#3730a3' : '#eff6ff' 
                    : darkMode ? '#1f2937' : 'white',
                  color: darkMode ? '#e5e7eb' : '#1f2937',
                  transition: 'all 150ms',
                  cursor: 'pointer'
                }}
                onClick={() => handleIconPick(icon)}
                onMouseOver={(e) => {
                  if (value !== icon) {
                    e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f9fafb';
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (value !== icon) {
                    e.currentTarget.style.backgroundColor = darkMode ? '#1f2937' : 'white';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: ICON_SIZE,
                  width: ICON_SIZE,
                  marginBottom: '0.25rem'
                }}>
                  <IconComponent iconName={icon} size={ICON_SIZE} color={darkMode ? '#e5e7eb' : undefined} />
                </div>
                <span style={{ 
                  fontSize: '0.65rem',
                  textAlign: 'center',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}>
                  {icon}
                </span>
              </button>
            ))
          ) : (
            <div style={{ 
              gridColumn: 'span 4', 
              textAlign: 'center', 
              padding: '2rem',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              No icons found matching "{searchTerm}"
            </div>
          )}
        </div>
        
        {/* Library filter - conditionally rendered based on showLibrarySelection */}
        {showLibrarySelection && (
          <div style={{ 
            marginTop: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            <button
              type="button"
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: selectedPack === undefined ? 'bold' : 'normal',
                backgroundColor: selectedPack === undefined 
                  ? darkMode ? '#4f46e5' : '#eff6ff' 
                  : darkMode ? '#374151' : 'white',
                color: selectedPack === undefined 
                  ? darkMode ? 'white' : '#3b82f6' 
                  : darkMode ? '#e5e7eb' : '#1f2937',
                border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                cursor: 'pointer',
                transition: 'all 150ms'
              }}
              onClick={() => handleLibrarySelect(undefined)}
            >
              All
            </button>
            
            {Object.keys(iconPacks).map((pack) => (
              <button
                key={pack}
                type="button"
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontWeight: selectedPack === pack ? 'bold' : 'normal',
                  backgroundColor: selectedPack === pack 
                    ? darkMode ? '#4f46e5' : '#eff6ff' 
                    : darkMode ? '#374151' : 'white',
                  color: selectedPack === pack 
                    ? darkMode ? 'white' : '#3b82f6' 
                    : darkMode ? '#e5e7eb' : '#1f2937',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms'
                }}
                onClick={() => handleLibrarySelect(pack)}
              >
                {pack}
              </button>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default IconSelectDialog; 