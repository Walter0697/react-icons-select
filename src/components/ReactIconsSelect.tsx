import React, { useState, useEffect } from 'react';
import { IconComponent } from './getIconComponent';
import { IconSelectDialog } from './IconSelectDialog';
import { DEFAULT_ICON_OPTIONS } from './defaultIconOptions';

export interface ButtonStyleProps {
  box?: React.CSSProperties;
  icon?: React.CSSProperties;
  text?: React.CSSProperties;
}

export interface ReactIconsSelectProps {
  value?: string; // Icon name
  onChange?: (value: string) => void; // Function to change the icon name
  text?: string;
  onClick?: () => void;
  darkMode?: boolean; // Add dark mode prop
  buttonStyle?: ButtonStyleProps; // Custom button styling
  showLibrarySelection?: boolean; // Option to show or hide library selection
  defaultIconOptions?: string[]; // Default icons to show when no search is active
  maxResults?: number; // Maximum number of results to show when searching
}

const ICON_OPTIONS = [
  'FaBeer',
  'FaCoffee',
  'FaApple',
  'MdAlarm',
  'MdBuild',
  'AiFillAndroid',
  'AiFillApple',
  'IoIosAirplane',
  'IoIosAlarm',
  'IoIosBasket',
];

export const ReactIconsSelect: React.FC<ReactIconsSelectProps> = ({ 
  value, 
  onChange, 
  text, 
  onClick, 
  darkMode = false,
  buttonStyle = {},
  showLibrarySelection = true,
  defaultIconOptions = DEFAULT_ICON_OPTIONS,
  maxResults = 48 // Default to 48 results (4x12 grid)
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDark, setIsDark] = useState(darkMode);

  // Listen for system dark mode changes if no explicit darkMode prop is provided
  useEffect(() => {
    if (darkMode !== undefined) {
      setIsDark(darkMode);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [darkMode]);

  const handleButtonClick = () => {
    if (onClick) onClick();
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  // Constants for consistent sizing with the dialog
  const ICON_SIZE = 24;
  const BUTTON_SIZE = 80;

  // Default styles
  const defaultBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: '0.5rem',
    border: `1px solid ${isDark ? '#6366f1' : '#3b82f6'}`,
    backgroundColor: isDark ? '#1f2937' : 'white',
    color: isDark ? '#e5e7eb' : '#1f2937',
    transition: 'all 150ms',
    cursor: 'pointer'
  };

  const defaultIconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: ICON_SIZE,
    width: ICON_SIZE,
    marginBottom: '0.25rem'
  };

  const defaultTextStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    textAlign: 'center',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: isDark ? '#9ca3af' : '#6b7280'
  };

  // Merge default styles with user-provided styles
  const boxStyle = { ...defaultBoxStyle, ...buttonStyle.box };
  const iconStyle = { ...defaultIconStyle, ...buttonStyle.icon };
  const textStyle = { ...defaultTextStyle, ...buttonStyle.text };

  return (
    <>
      <button
        type="button"
        style={boxStyle}
        onClick={handleButtonClick}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f9fafb';
          e.currentTarget.style.boxShadow = isDark 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? '#1f2937' : 'white';
          e.currentTarget.style.boxShadow = 'none';
          
          // Restore any custom background color if provided
          if (buttonStyle.box?.backgroundColor) {
            e.currentTarget.style.backgroundColor = buttonStyle.box.backgroundColor as string;
          }
        }}
      >
        {value ? (
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={iconStyle}>
              <IconComponent 
                iconName={value} 
                size={ICON_SIZE} 
                color={isDark ? '#e5e7eb' : undefined} 
              />
            </div>
            <span style={textStyle}>
              {value}
            </span>
          </span>
        ) : (
          <span style={{
            fontSize: '0.7rem',
            color: isDark ? '#9ca3af' : '#6b7280',
            ...buttonStyle.text
          }}>
            {text || 'Select an Icon'}
          </span>
        )}
      </button>
      
      <IconSelectDialog
        value={value}
        onChange={onChange}
        iconOptions={ICON_OPTIONS}
        isOpen={isDialogOpen}
        onClose={handleClose}
        darkMode={isDark}
        showLibrarySelection={showLibrarySelection}
        defaultIconOptions={defaultIconOptions}
        maxResults={maxResults}
      />
    </>
  );
};

export default ReactIconsSelect; 