/**
 * Semantic design tokens for StillEligible.
 * 
 * Deep Navy (#09122C) and Warm Gold (#F5B800) for a calm but definitive aesthetic.
 * 
 * Calm means restful color, not absence of color. We want a bold, memorable look.
 */

const colors = {
  light: {
    text: '#09122C',
    background: '#F8FAFC', // Slate 50
    foreground: '#09122C',
    
    card: '#FFFFFF',
    cardForeground: '#09122C',
    
    primary: '#09122C', // Deep navy
    primaryForeground: '#FFFFFF',
    
    secondary: '#E2E8F0', // Slate 200
    secondaryForeground: '#0F172A',
    
    accent: '#F5B800', // Gold for open doors
    accentForeground: '#09122C',
    
    success: '#10B981', // Mint/Emerald for passes
    successForeground: '#FFFFFF',
    
    muted: '#F1F5F9', // Slate 100
    mutedForeground: '#64748B', // Slate 500
    
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    
    border: '#E2E8F0',
    input: '#E2E8F0',
  },
  dark: {
    text: '#F8FAFC',
    background: '#040814', // Very deep navy
    foreground: '#F8FAFC',
    
    card: '#09122C', // Dark Navy
    cardForeground: '#F8FAFC',
    
    primary: '#F5B800', // Gold becomes primary action in dark mode
    primaryForeground: '#040814',
    
    secondary: '#1E293B',
    secondaryForeground: '#F8FAFC',
    
    accent: '#F5B800',
    accentForeground: '#040814',
    
    success: '#10B981', 
    successForeground: '#FFFFFF',
    
    muted: '#1E293B',
    mutedForeground: '#94A3B8',
    
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    
    border: '#1E293B',
    input: '#1E293B',
  },
  radius: 12,
};

export default colors;
