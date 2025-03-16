import { useEffect } from 'react';
import disableDevtool from 'disable-devtool';

export const useDisableInspect = () => {
  useEffect(() => {
    // Initialize disableDevtool
    disableDevtool();

    const disableInspect = (e: KeyboardEvent) => {
      // Block right-click context menu
      if (e.type === 'contextmenu') {
        e.preventDefault();
        return;
      }

      // Block developer shortcuts
      if (
        e.key === 'F12' || // F12 for DevTools
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl + Shift + I
        (e.metaKey && e.shiftKey && e.key === 'I') || // ⌘ + Shift + I (Mac)
        (e.altKey && e.metaKey && e.key.toLowerCase() === 'i') || // ⌥ + ⌘ + I (Mac)
        (e.metaKey && e.key.toLowerCase() === 'i') || // ⌘ + I (Mac)
        (e.ctrlKey && e.key.toLowerCase() === 'i') || // Ctrl + I
        (e.metaKey && e.key === 'u') || // ⌘ + U (View Source)
        (e.ctrlKey && e.key === 'u') || // Ctrl + U (View Source)
        (e.metaKey && e.altKey && e.key.toLowerCase() === 'j') || // ⌘ + ⌥ + J (Console)
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') // Ctrl + Shift + J (Console)
      ) {
        e.preventDefault();
      }
    };

    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable key combinations
    document.addEventListener('keydown', disableInspect);

    return () => {
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
      document.removeEventListener('keydown', disableInspect);
    };
  }, []);
};
