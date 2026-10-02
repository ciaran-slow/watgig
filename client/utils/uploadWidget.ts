// Dark theme for the Cloudinary upload widget, matching the app's palette.
export const uploadWidgetOptions = {
  sources: ['local', 'url', 'camera'],
  multiple: false,
  styles: {
    palette: {
      window: '#141414',
      sourceBg: '#0a0a0a',
      windowBorder: '#2a2a2a',
      tabIcon: '#a855f7',
      inactiveTabIcon: '#9ca3af',
      menuIcons: '#e5e7eb',
      link: '#a855f7',
      action: '#9333ea',
      inProgress: '#9333ea',
      complete: '#22c55e',
      error: '#ef4444',
      textDark: '#d1d5db',
      textLight: '#ffffff',
    },
    fonts: {
      default: null,
      "'Inter', sans-serif": {
        url: 'https://fonts.googleapis.com/css?family=Inter',
        active: true,
      },
    },
  },
}
