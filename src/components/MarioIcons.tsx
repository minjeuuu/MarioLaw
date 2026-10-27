import React from 'react';
import { MarioAvatar } from '../types/laborLaw';

// Pure SVG Super Mario Game Icons (Zero Emojis!)
export const MarioCoinIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="12" rx="7" ry="10" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
    <ellipse cx="12" cy="12" rx="4" ry="7" fill="#FCD34D" stroke="#B45309" strokeWidth="1.5" />
    <rect x="11" y="8" width="2" height="8" rx="1" fill="#78350F" />
  </svg>
);

export const MarioMushroomIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 13C3 7.5 7 3 12 3C17 3 21 7.5 21 13C21 14 20 15 18 15H6C4 15 3 14 3 13Z"
      fill="#DC2626"
      stroke="#0F172A"
      strokeWidth="2.5"
    />
    <ellipse cx="12" cy="8" rx="3.5" ry="3" fill="#FFFFFF" />
    <circle cx="5.5" cy="11.5" r="2" fill="#FFFFFF" />
    <circle cx="18.5" cy="11.5" r="2" fill="#FFFFFF" />
    <path
      d="M8 14.5C8 14.5 7.5 19 8.5 20.5C9.5 22 14.5 22 15.5 20.5C16.5 19 16 14.5 16 14.5"
      fill="#FEF3C7"
      stroke="#0F172A"
      strokeWidth="2"
    />
    <line x1="10" y1="16.5" x2="10" y2="19" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="16.5" x2="14" y2="19" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Mario1UpIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 13C3 7.5 7 3 12 3C17 3 21 7.5 21 13C21 14 20 15 18 15H6C4 15 3 14 3 13Z"
      fill="#16A34A"
      stroke="#0F172A"
      strokeWidth="2.5"
    />
    <ellipse cx="12" cy="8" rx="3.5" ry="3" fill="#FFFFFF" />
    <circle cx="5.5" cy="11.5" r="2" fill="#FFFFFF" />
    <circle cx="18.5" cy="11.5" r="2" fill="#FFFFFF" />
    <path
      d="M8 14.5C8 14.5 7.5 19 8.5 20.5C9.5 22 14.5 22 15.5 20.5C16.5 19 16 14.5 16 14.5"
      fill="#FEF3C7"
      stroke="#0F172A"
      strokeWidth="2"
    />
    <line x1="10" y1="16.5" x2="10" y2="19" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="16.5" x2="14" y2="19" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MarioStarIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <polygon
      points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
      fill="#FCD34D"
      stroke="#0F172A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <rect x="9.5" y="8" width="1.8" height="4.5" rx="0.9" fill="#0F172A" />
    <rect x="12.7" y="8" width="1.8" height="4.5" rx="0.9" fill="#0F172A" />
    <rect x="9.7" y="8.5" width="0.8" height="1.8" rx="0.4" fill="#FFFFFF" />
    <rect x="12.9" y="8.5" width="0.8" height="1.8" rx="0.4" fill="#FFFFFF" />
  </svg>
);

export const MarioFireFlowerIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="9" rx="8" ry="7" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
    <ellipse cx="12" cy="9" rx="5.5" ry="4.5" fill="#F59E0B" />
    <ellipse cx="12" cy="9" rx="3" ry="2.5" fill="#FEF08A" />
    <rect x="10.5" y="8" width="1" height="2" fill="#0F172A" />
    <rect x="12.5" y="8" width="1" height="2" fill="#0F172A" />
    <path d="M12 16V22" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
    <path d="M6 18C8 16 11 18 12 19" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 18C16 16 13 18 12 19" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const MarioQuestionBlockIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
    <rect x="4" y="4" width="2" height="2" fill="#FEF3C7" />
    <rect x="18" y="4" width="2" height="2" fill="#B45309" />
    <rect x="4" y="18" width="2" height="2" fill="#FEF3C7" />
    <rect x="18" y="18" width="2" height="2" fill="#B45309" />
    <path
      d="M10 7C10 5.8 11 5 12 5C13.2 5 14 5.8 14 7C14 8.5 12 9 12 11"
      stroke="#0F172A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="15" r="1.5" fill="#0F172A" />
  </svg>
);

export const MarioPipeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="18" height="6" rx="1" fill="#16A34A" stroke="#0F172A" strokeWidth="2.5" />
    <rect x="5" y="9" width="14" height="13" fill="#15803D" stroke="#0F172A" strokeWidth="2.5" />
    <rect x="7" y="3" width="2" height="6" fill="#86EFAC" />
    <rect x="8" y="9" width="2" height="13" fill="#86EFAC" />
  </svg>
);

export const MarioFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="5" y1="2" x2="5" y2="22" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
    <circle cx="5" cy="3" r="2" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
    <polygon points="6,4 19,8 6,13" fill="#DC2626" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
    <rect x="2" y="21" width="8" height="3" rx="1" fill="#78350F" stroke="#0F172A" strokeWidth="1.5" />
  </svg>
);

export const MarioPeachCrownIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M4 18L3 7L8 12L12 5L16 12L21 7L20 18H4Z"
      fill="#F59E0B"
      stroke="#0F172A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="14" r="2" fill="#E11D48" />
    <circle cx="6.5" cy="15" r="1.2" fill="#3B82F6" />
    <circle cx="17.5" cy="15" r="1.2" fill="#3B82F6" />
  </svg>
);

export const MarioCharacterAvatar: React.FC<{
  character: MarioAvatar;
  className?: string;
}> = ({ character, className = 'w-8 h-8' }) => {
  switch (character) {
    case 'mario':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14C6 8 10 4 17 4C23 4 27 7 28 12H5" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
          <rect x="3" y="12" width="27" height="4" rx="2" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
          <circle cx="17" cy="8" r="3.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <path d="M15 10V6.5L17 8.5L19 6.5V10" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 15V22C8 25 11 27 16 27C21 27 24 25 24 22V15" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
          <path d="M11 21C13 19 19 19 21 21C22 22 19 23 16 23C13 23 10 22 11 21Z" fill="#78350F" />
          <ellipse cx="16" cy="18" rx="3.5" ry="2.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="12" cy="16" rx="1.5" ry="2" fill="#0F172A" />
          <ellipse cx="20" cy="16" rx="1.5" ry="2" fill="#0F172A" />
        </svg>
      );
    case 'luigi':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14C6 8 10 4 17 4C23 4 27 7 28 12H5" fill="#16A34A" stroke="#0F172A" strokeWidth="2" />
          <rect x="3" y="12" width="27" height="4" rx="2" fill="#16A34A" stroke="#0F172A" strokeWidth="2" />
          <circle cx="17" cy="8" r="3.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <path d="M16 6.5V10H18.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 15V23C9 26 12 28 16 28C20 28 23 26 23 23V15" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
          <path d="M12 21C14 19 18 19 20 21C21 22 18 23.5 16 23.5C14 23.5 11 22 12 21Z" fill="#451A03" />
          <ellipse cx="16" cy="18" rx="3" ry="2.2" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="13" cy="16" rx="1.2" ry="2" fill="#0F172A" />
          <ellipse cx="19" cy="16" rx="1.2" ry="2" fill="#0F172A" />
        </svg>
      );
    case 'peach':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M10 6L9 2L13 5L16 1L19 5L23 2L22 6H10Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="16" cy="4" r="1" fill="#E11D48" />
          <path d="M7 16C6 11 9 7 16 7C23 7 26 11 25 16C26 22 23 26 16 26C9 26 6 22 7 16Z" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="17" rx="6" ry="7" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="13.5" cy="16" rx="1.2" ry="1.8" fill="#3B82F6" />
          <ellipse cx="18.5" cy="16" rx="1.2" ry="1.8" fill="#3B82F6" />
          <path d="M14.5 21C15.5 22 16.5 22 17.5 21" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'daisy':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M10 6L9 2L13 5L16 1.5L19 5L23 2L22 6H10Z" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="16" cy="4" r="1.2" fill="#10B981" />
          <path d="M6 16C5 10 9 6 16 6C23 6 27 10 26 16C27 22 23 26 16 26C9 26 5 22 6 16Z" fill="#C2410C" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="17.5" rx="6.2" ry="6.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="13.5" cy="16.5" rx="1.3" ry="1.8" fill="#2563EB" />
          <ellipse cx="18.5" cy="16.5" rx="1.3" ry="1.8" fill="#2563EB" />
          <circle cx="8" cy="19" r="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <circle cx="24" cy="19" r="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <path d="M14 21C15.3 22.4 16.7 22.4 18 21" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'rosalina':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <polygon points="11,5 13,2 16,5 19,2 21,5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.2" />
          <circle cx="16" cy="3.5" r="1" fill="#F59E0B" />
          <path d="M7 16C6 10 9 6 16 6C23 6 26 10 25 16C26 23 23 27 16 27C9 27 6 23 7 16Z" fill="#FEF08A" stroke="#0F172A" strokeWidth="2" />
          <path d="M10 11C12 16 14 20 12 25" stroke="#0F172A" strokeWidth="1.5" fill="none" />
          <ellipse cx="16" cy="17" rx="6" ry="6.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="18.5" cy="16" r="1.5" fill="#06B6D4" />
          <path d="M14.5 21C15.5 22 16.5 22 17.5 21" stroke="#E11D48" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M11 26C13 24 19 24 21 26L23 30H9L11 26Z" fill="#22D3EE" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      );
    case 'pauline':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M5 10L27 10L29 13H3L5 10Z" fill="#DC2626" stroke="#0F172A" strokeWidth="1.8" />
          <path d="M9 10C9 6 12 4 16 4C20 4 23 6 23 10H9Z" fill="#DC2626" stroke="#0F172A" strokeWidth="1.8" />
          <rect x="9" y="8.5" width="14" height="2" fill="#FBBF24" />
          <path d="M7 13C6 20 8 26 16 27C24 26 26 20 25 13" fill="#451A03" stroke="#0F172A" strokeWidth="1.8" />
          <ellipse cx="16" cy="18.5" rx="6" ry="6.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="13.5" cy="17" r="1.3" fill="#0284C7" />
          <circle cx="18.5" cy="17" r="1.3" fill="#0284C7" />
          <circle cx="9.2" cy="20" r="1.8" fill="#FBBF24" stroke="#0F172A" strokeWidth="1" />
          <circle cx="22.8" cy="20" r="1.8" fill="#FBBF24" stroke="#0F172A" strokeWidth="1" />
          <path d="M14 22C15.2 23 16.8 23 18 22" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'toad':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="13" rx="13" ry="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="7" rx="4.5" ry="3.5" fill="#DC2626" />
          <ellipse cx="6" cy="13" rx="3.5" ry="4" fill="#DC2626" />
          <ellipse cx="26" cy="13" rx="3.5" ry="4" fill="#DC2626" />
          <ellipse cx="16" cy="22" rx="7" ry="6" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="13" cy="20" rx="1.2" ry="2" fill="#0F172A" />
          <ellipse cx="19" cy="20" rx="1.2" ry="2" fill="#0F172A" />
          <path d="M14 24C15 25.5 17 25.5 18 24" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'toadette':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="5" cy="18" r="3.5" fill="#EC4899" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="3" cy="23" r="3" fill="#EC4899" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="27" cy="18" r="3.5" fill="#EC4899" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="29" cy="23" r="3" fill="#EC4899" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="16" cy="12" rx="12" ry="9" fill="#EC4899" stroke="#0F172A" strokeWidth="2" />
          <circle cx="16" cy="8" r="3" fill="#FFFFFF" />
          <circle cx="8" cy="13" r="2.5" fill="#FFFFFF" />
          <circle cx="24" cy="13" r="2.5" fill="#FFFFFF" />
          <ellipse cx="16" cy="21" rx="6.5" ry="5.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="13.5" cy="19.5" rx="1" ry="1.8" fill="#0F172A" />
          <ellipse cx="18.5" cy="19.5" rx="1" ry="1.8" fill="#0F172A" />
          <circle cx="11.5" cy="22" r="1.2" fill="#F472B6" />
          <circle cx="20.5" cy="22" r="1.2" fill="#F472B6" />
          <path d="M14.5 23C15.5 24 16.5 24 17.5 23" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'capttoad':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="13" rx="13" ry="9.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="6.5" cy="13" r="3.2" fill="#DC2626" />
          <circle cx="25.5" cy="13" r="3.2" fill="#DC2626" />
          <rect x="4" y="13.5" width="24" height="3" fill="#78350F" stroke="#0F172A" strokeWidth="1.2" />
          <circle cx="16" cy="14" r="4" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="16" cy="14" r="2.2" fill="#FEF9C3" />
          <ellipse cx="16" cy="22.5" rx="6.8" ry="5.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.8" />
          <ellipse cx="13.2" cy="21" rx="1.1" ry="1.8" fill="#0F172A" />
          <ellipse cx="18.8" cy="21" rx="1.1" ry="1.8" fill="#0F172A" />
          <path d="M12 26L16 29L20 26Z" fill="#DC2626" stroke="#0F172A" strokeWidth="1.2" />
        </svg>
      );
    case 'yoshi':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="10" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
          <circle cx="11" cy="17" r="7" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="20" rx="7" ry="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="22,7 26,9 23,12" fill="#EA580C" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="24,13 28,16 24,18" fill="#EA580C" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="19" cy="11" rx="3.5" ry="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="19" cy="11" rx="1.5" ry="2.5" fill="#0F172A" />
          <circle cx="19.5" cy="10" r="0.8" fill="#FFFFFF" />
        </svg>
      );
    case 'birdo':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <polygon points="10,7 6,3 14,5" fill="#E11D48" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="14,7 20,3 17,8" fill="#E11D48" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="14" cy="6.5" r="2" fill="#F43F5E" stroke="#0F172A" strokeWidth="1.2" />
          <circle cx="15" cy="17" r="9.5" fill="#F472B6" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="22" cy="18" rx="6" ry="4.5" fill="#F472B6" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="26.5" cy="18" rx="2" ry="3" fill="#0F172A" />
          <ellipse cx="14" cy="13" rx="3" ry="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="14.5" cy="13" r="1.4" fill="#0F172A" />
        </svg>
      );
    case 'donkeykong':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="15" rx="10" ry="9" fill="#78350F" stroke="#0F172A" strokeWidth="2" />
          <polygon points="14,6 16,2 18,6" fill="#78350F" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="16" cy="19" rx="8" ry="6" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="14.5" cy="18" r="1" fill="#78350F" />
          <circle cx="17.5" cy="18" r="1" fill="#78350F" />
          <path d="M12 21C14 23 18 23 20 21" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="13" cy="13" rx="1.5" ry="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <ellipse cx="19" cy="13" rx="1.5" ry="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <circle cx="13.5" cy="13" r="0.9" fill="#0F172A" />
          <circle cx="18.5" cy="13" r="0.9" fill="#0F172A" />
          <polygon points="14,25 18,25 16,30" fill="#DC2626" stroke="#0F172A" strokeWidth="1" />
          <rect x="15" y="26" width="2" height="2" fill="#FBBF24" />
        </svg>
      );
    case 'diddykong':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="6" cy="16" r="3.2" fill="#92400E" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="26" cy="16" r="3.2" fill="#92400E" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="16" cy="17" r="9" fill="#92400E" stroke="#0F172A" strokeWidth="2" />
          <path d="M7 13C7 7 11 4 16 4C21 4 25 7 25 13H7Z" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
          <rect x="6" y="11.5" width="20" height="3" rx="1.5" fill="#DC2626" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="16" cy="8.5" r="2" fill="#FACC15" />
          <ellipse cx="16" cy="20.5" rx="6.5" ry="4.5" fill="#FDE68A" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="13.5" cy="16" rx="1.8" ry="2.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <ellipse cx="18.5" cy="16" rx="1.8" ry="2.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <circle cx="14" cy="16" r="0.9" fill="#0F172A" />
          <circle cx="18" cy="16" r="0.9" fill="#0F172A" />
          <path d="M13 21.5C15 23 17 23 19 21.5" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'wario':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14C6 8 10 4 17 4C23 4 27 7 28 12H5" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
          <rect x="3" y="12" width="27" height="4" rx="2" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
          <circle cx="17" cy="8" r="3.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <path d="M15 7L16 9.5L17 7L18 9.5L19 7" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 15V22C7 26 11 28 16 28C21 28 25 26 25 22V15" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="17" rx="4.5" ry="3.5" fill="#F472B6" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M8 20L11 22L13 20L16 23L19 20L21 22L24 20" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="14" r="1.5" fill="#0F172A" />
          <circle cx="20" cy="14" r="1.5" fill="#0F172A" />
        </svg>
      );
    case 'waluigi':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M7 13C7 7 11 3 17 3C22 3 26 6 27 11H6" fill="#7E22CE" stroke="#0F172A" strokeWidth="2" />
          <rect x="4" y="11" width="25" height="3.5" rx="1.7" fill="#7E22CE" stroke="#0F172A" strokeWidth="2" />
          <circle cx="17" cy="7.5" r="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <path d="M18 6V9H15.5" stroke="#FACC15" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M10 14.5V24C10 27 13 29 16 29C19 29 22 27 22 24V14.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="18.5" rx="2.5" ry="3.8" fill="#F472B6" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M6 21L13 21.5M19 21.5L26 21" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="13" cy="16" r="1.2" fill="#0F172A" />
          <circle cx="19" cy="16" r="1.2" fill="#0F172A" />
        </svg>
      );
    case 'bowser':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="11" fill="#15803D" stroke="#0F172A" strokeWidth="2" />
          <polygon points="8,7 4,3 9,8" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="24,7 28,3 23,8" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M12 9L16 4L20 9" fill="#DC2626" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="16" cy="19" rx="8" ry="6" fill="#FCD34D" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="12,20 14,23 15,20" fill="#FFFFFF" />
          <polygon points="17,20 18,23 20,20" fill="#FFFFFF" />
          <path d="M11 14L15 16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <path d="M21 14L17 16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <circle cx="13" cy="16" r="1.3" fill="#DC2626" />
          <circle cx="19" cy="16" r="1.3" fill="#DC2626" />
        </svg>
      );
    case 'bowserjr':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="17" r="10" fill="#15803D" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="20" rx="7" ry="5.5" fill="#FCD34D" stroke="#0F172A" strokeWidth="2" />
          <path d="M10 22C13 25 19 25 22 22L21 27H11L10 22Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M12 23L13 25L14 23L16 26L18 23L19 25L20 23" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12 9L16 3L20 9" fill="#EA580C" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M11 13L15 15" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <path d="M21 13L17 15" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <circle cx="13.5" cy="15" r="1.5" fill="#0F172A" />
          <circle cx="18.5" cy="15" r="1.5" fill="#0F172A" />
        </svg>
      );
    case 'koopatroopa':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="17" rx="9" ry="9" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="20.5" rx="8" ry="5.5" fill="#FEF08A" stroke="#0F172A" strokeWidth="1.8" />
          <ellipse cx="13.5" cy="12.5" rx="2.5" ry="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="18.5" cy="12.5" rx="2.5" ry="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="14" cy="13" r="1.2" fill="#0F172A" />
          <circle cx="18" cy="13" r="1.2" fill="#0F172A" />
          <path d="M12 22C14.5 23.5 17.5 23.5 20 22" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M9 26C11 24 21 24 23 26L25 29H7L9 26Z" fill="#16A34A" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      );
    case 'shyguy':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M5 17C5 9 10 4 16 4C22 4 27 9 27 17C27 24 23 28 16 28C9 28 5 24 5 17Z" fill="#E11D48" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="17" rx="7.5" ry="8.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="13" cy="15.5" rx="1.8" ry="2.6" fill="#0F172A" />
          <ellipse cx="19" cy="15.5" rx="1.8" ry="2.6" fill="#0F172A" />
          <circle cx="16" cy="21" r="1.8" fill="#0F172A" />
        </svg>
      );
    case 'boo':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <polygon points="11,6 10,2 14,4.5 16,1.5 18,4.5 22,2 21,6" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.3" />
          <circle cx="16" cy="4" r="1" fill="#9333EA" />
          <path d="M5 17C5 10 9.5 6 16 6C22.5 6 27 10 27 17C27 23 23 28 16 28C11 28 8 26 4 27C6 24 5 20 5 17Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          <circle cx="13" cy="14.5" r="1.6" fill="#0F172A" />
          <circle cx="19" cy="14.5" r="1.6" fill="#0F172A" />
          <path d="M11 19H21C21 23 19 25 16 25C13 25 11 23 11 19Z" fill="#991B1B" stroke="#0F172A" strokeWidth="1.4" />
          <polygon points="12.5,19 14,22 15.2,19" fill="#FFFFFF" />
          <polygon points="16.8,19 18,22 19.5,19" fill="#FFFFFF" />
          <ellipse cx="16" cy="23.5" rx="2.5" ry="2" fill="#F43F5E" />
        </svg>
      );
    case 'kamek':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <polygon points="6,14 18,2 25,14" fill="#2563EB" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
          <rect x="4" y="13" width="24" height="3" rx="1.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.6" />
          <ellipse cx="16" cy="21" rx="8" ry="6.5" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
          <circle cx="12.5" cy="19" r="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
          <circle cx="19.5" cy="19" r="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
          <line x1="15.5" y1="19" x2="16.5" y2="19" stroke="#0F172A" strokeWidth="1.8" />
          <circle cx="12.5" cy="19" r="1" fill="#0F172A" />
          <circle cx="19.5" cy="19" r="1" fill="#0F172A" />
          <polygon points="15,23 17,25.5 18.5,23" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
        </svg>
      );
    case 'drybones':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="10" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="16" cy="21" rx="7.5" ry="5" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.8" />
          <circle cx="12.5" cy="14.5" r="2.8" fill="#0F172A" />
          <circle cx="19.5" cy="14.5" r="2.8" fill="#0F172A" />
          <circle cx="12.5" cy="14.5" r="1.1" fill="#FACC15" />
          <circle cx="19.5" cy="14.5" r="1.1" fill="#FACC15" />
          <line x1="12" y1="22" x2="20" y2="22" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="14" y1="20.5" x2="14" y2="23.5" stroke="#0F172A" strokeWidth="1.3" />
          <line x1="16" y1="20.5" x2="16" y2="23.5" stroke="#0F172A" strokeWidth="1.3" />
          <line x1="18" y1="20.5" x2="18" y2="23.5" stroke="#0F172A" strokeWidth="1.3" />
        </svg>
      );
    case 'metalmario':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14C6 8 10 4 17 4C23 4 27 7 28 12H5" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
          <rect x="3" y="12" width="27" height="4" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
          <circle cx="17" cy="8" r="3.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
          <path d="M15 10V6.5L17 8.5L19 6.5V10" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 15V22C8 25 11 27 16 27C21 27 24 25 24 22V15" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
          <path d="M11 21C13 19 19 19 21 21C22 22 19 23 16 23C13 23 10 22 11 21Z" fill="#334155" />
          <ellipse cx="16" cy="18" rx="3.5" ry="2.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.5" />
          <ellipse cx="12" cy="16" rx="1.5" ry="2" fill="#0F172A" />
          <ellipse cx="20" cy="16" rx="1.5" ry="2" fill="#0F172A" />
        </svg>
      );
    case 'firemario':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14C6 8 10 4 17 4C23 4 27 7 28 12H5" fill="#FFFFFF" stroke="#991B1B" strokeWidth="2" />
          <rect x="3" y="12" width="27" height="4" rx="2" fill="#FEE2E2" stroke="#991B1B" strokeWidth="2" />
          <circle cx="17" cy="8" r="3.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <path d="M15 10V6.5L17 8.5L19 6.5V10" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 15V22C8 25 11 27 16 27C21 27 24 25 24 22V15" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
          <path d="M11 21C13 19 19 19 21 21C22 22 19 23 16 23C13 23 10 22 11 21Z" fill="#78350F" />
          <ellipse cx="16" cy="18" rx="3.5" ry="2.5" fill="#FDBA74" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="26" cy="24" r="3.5" fill="#F97316" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="26" cy="24" r="1.5" fill="#FEF08A" />
        </svg>
      );
    case 'iceluigi':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14C6 7 10 3 16 3C22 3 26 7 27 12H5" fill="#38BDF8" stroke="#0C4A6E" strokeWidth="2" />
          <rect x="4" y="12" width="25" height="4" rx="2" fill="#BAE6FD" stroke="#0C4A6E" strokeWidth="2" />
          <circle cx="16" cy="7.8" r="3.2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1" />
          <path d="M15 6V9.2H17.5" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 15V23C9 26 12 28 16 28C20 28 23 26 23 23V15" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
          <path d="M11.5 21.5C13.5 20 18.5 20 20.5 21.5" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="26" cy="23" r="3.2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
        </svg>
      );
    case 'tanookimario':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <polygon points="7,10 10,3 14,9" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <polygon points="25,10 22,3 18,9" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <polygon points="9,9 10.5,5.5 12.5,9" fill="#FDE68A" />
          <polygon points="23,9 21.5,5.5 19.5,9" fill="#FDE68A" />
          <circle cx="16" cy="17" r="10" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <ellipse cx="16" cy="19" rx="7" ry="6" fill="#FED7AA" stroke="#451A03" strokeWidth="1.8" />
          <path d="M11.5 21.5C13.5 20 18.5 20 20.5 21.5" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="16" cy="18.2" rx="2.6" ry="1.8" fill="#451A03" />
          <circle cx="13" cy="16" r="1.3" fill="#0F172A" />
          <circle cx="19" cy="16" r="1.3" fill="#0F172A" />
        </svg>
      );
    case 'catpeach':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <polygon points="6,12 9,3 14,9" fill="#F472B6" stroke="#831843" strokeWidth="2" />
          <polygon points="26,12 23,3 18,9" fill="#F472B6" stroke="#831843" strokeWidth="2" />
          <polygon points="8.5,10.5 10,6 12.5,10" fill="#FCE7F3" />
          <polygon points="23.5,10.5 22,6 19.5,10" fill="#FCE7F3" />
          <circle cx="16" cy="17" r="9.5" fill="#F472B6" stroke="#831843" strokeWidth="2" />
          <circle cx="16" cy="18.5" r="6.5" fill="#FDE6D8" stroke="#831843" strokeWidth="1.6" />
          <circle cx="13.5" cy="17.5" r="1.3" fill="#0284C7" />
          <circle cx="18.5" cy="17.5" r="1.3" fill="#0284C7" />
          <polygon points="15,19.5 17,19.5 16,21" fill="#EC4899" />
          <circle cx="16" cy="26.5" r="3" fill="#FACC15" stroke="#78350F" strokeWidth="1.5" />
        </svg>
      );
    case 'cosmicrosalina':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="13" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="2" />
          <polygon points="12,8 14,4 16,7 18,4 20,8" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M9 14C9 9 13 7 18 8C23 9 24 15 22 22C19 20 15 20 10 22Z" fill="#6366F1" stroke="#A5B4FC" strokeWidth="1.5" />
          <circle cx="16" cy="17.5" r="5.5" fill="#E0E7FF" />
          <circle cx="18" cy="17" r="1.3" fill="#38BDF8" />
          <circle cx="8" cy="10" r="1.2" fill="#FDE047" />
          <circle cx="24" cy="11" r="1" fill="#BAE6FD" />
          <circle cx="23" cy="24" r="1.3" fill="#FDE047" />
        </svg>
      );
    case 'drybowser':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 12L3 6L9 9" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.8" />
          <path d="M26 12L29 6L23 9" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.8" />
          <path d="M12 8L16 3L20 8" fill="#DC2626" stroke="#0F172A" strokeWidth="1.8" />
          <circle cx="16" cy="17" r="9.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <circle cx="12.5" cy="15.5" r="2.6" fill="#0F172A" />
          <circle cx="19.5" cy="15.5" r="2.6" fill="#0F172A" />
          <circle cx="12.5" cy="15.5" r="1.1" fill="#38BDF8" />
          <circle cx="19.5" cy="15.5" r="1.1" fill="#38BDF8" />
          <rect x="10" y="21" width="12" height="4" rx="1.5" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="11.5,21 13,24.5 14.5,21" fill="#FFFFFF" />
          <polygon points="17.5,21 19,24.5 20.5,21" fill="#FFFFFF" />
        </svg>
      );
    case 'goldenyoshi':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M9 9L7 5L11 7L10 4L13 7" fill="#E11D48" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="13" cy="13" r="6" fill="#FACC15" stroke="#78350F" strokeWidth="2" />
          <ellipse cx="21" cy="16" rx="7" ry="6" fill="#FDE047" stroke="#78350F" strokeWidth="2" />
          <ellipse cx="14" cy="21" rx="6" ry="5" fill="#FEF9C3" stroke="#78350F" strokeWidth="1.8" />
          <circle cx="14" cy="11" r="1.6" fill="#78350F" />
          <circle cx="23" cy="14" r="1" fill="#78350F" />
        </svg>
      );
    case 'lawyertoad':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="11" rx="11" ry="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="16" cy="9" r="3.2" fill="#F59E0B" />
          <circle cx="9.5" cy="11.5" r="2.2" fill="#DC2626" />
          <circle cx="22.5" cy="11.5" r="2.2" fill="#DC2626" />
          <rect x="11" y="16" width="10" height="7" rx="3" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
          <circle cx="14" cy="19" r="1.1" fill="#0F172A" />
          <circle cx="18" cy="19" r="1.1" fill="#0F172A" />
          <path d="M8 23L16 25L24 23V29H8V23Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <path d="M14 23L16 29L18 23" fill="#DC2626" stroke="#FACC15" strokeWidth="1.2" />
        </svg>
      );
    case 'shadowmario':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14C6 8 10 4 17 4C23 4 27 7 28 12H5" fill="#1D4ED8" stroke="#0EA5E9" strokeWidth="2" />
          <rect x="3" y="12" width="27" height="4" rx="2" fill="#2563EB" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="17" cy="8" r="3.2" fill="#38BDF8" />
          <path d="M8 15V22C8 25 11 27 16 27C21 27 24 25 24 22V15" fill="#1E40AF" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="12.5" cy="17" r="1.6" fill="#FEF08A" />
          <circle cx="19.5" cy="17" r="1.6" fill="#FEF08A" />
          <path d="M11 21.5C13 20 19 20 21 21.5" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'drpeach':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <polygon points="11,8 13,3 16,7 19,3 21,8" fill="#FACC15" stroke="#0F172A" strokeWidth="1.6" />
          <path d="M7 15C7 9 11 7 16 7C21 7 25 9 25 15V21H7V15Z" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />
          <circle cx="16" cy="17" r="6" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.8" />
          <circle cx="16" cy="11.5" r="2.8" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.4" />
          <circle cx="14" cy="17" r="1.1" fill="#0284C7" />
          <circle cx="18" cy="17" r="1.1" fill="#0284C7" />
          <path d="M9 23H23L25 29H7L9 23Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <path d="M14 23L16 28L18 23" fill="#EC4899" />
        </svg>
      );
    case 'goldmario':
    default:
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14C6 8 10 4 17 4C23 4 27 7 28 12H5" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
          <rect x="3" y="12" width="27" height="4" rx="2" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
          <circle cx="17" cy="8" r="3.5" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
          <path d="M15 10V6.5L17 8.5L19 6.5V10" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 15V22C8 25 11 27 16 27C21 27 24 25 24 22V15" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
          <path d="M11 21C13 19 19 19 21 21C22 22 19 23 16 23C13 23 10 22 11 21Z" fill="#92400E" />
          <ellipse cx="16" cy="18" rx="3.5" ry="2.5" fill="#FDE047" stroke="#78350F" strokeWidth="1.5" />
          <ellipse cx="12" cy="16" rx="1.5" ry="2" fill="#78350F" />
          <ellipse cx="20" cy="16" rx="1.5" ry="2" fill="#78350F" />
        </svg>
      );
  }
};

// Pure SVG Bowser Icon for Boss Battle
export const MarioBowserIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <path
      d="M6 22C6 14 12 8 22 8C30 8 35 13 36 21C37 28 32 34 22 34C12 34 6 29 6 22Z"
      fill="#15803D"
      stroke="#0F172A"
      strokeWidth="2.5"
    />
    <path
      d="M7 23C7 16 12 11 21 11C28 11 32 15 33 22"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeDasharray="4 3"
      fill="none"
    />
    <polygon points="12,7 15,3 18,8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
    <polygon points="22,6 26,2 29,7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
    <polygon points="31,11 37,8 36,14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
    <path d="M26 12L34 5L31 14" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
    <path d="M12 14L4 7L8 16" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
    <path
      d="M14 12L17 5L20 11L23 4L26 12"
      fill="#DC2626"
      stroke="#0F172A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <ellipse cx="20" cy="22" rx="9" ry="8" fill="#FCD34D" stroke="#0F172A" strokeWidth="2" />
    <path
      d="M12 24C12 28 16 31 20 31C24 31 28 28 28 24C28 21 24 20 20 20C16 20 12 21 12 24Z"
      fill="#FEF08A"
      stroke="#0F172A"
      strokeWidth="2"
    />
    <polygon points="15,24 17,28 19,24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
    <polygon points="21,24 23,28 25,24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
    <circle cx="18" cy="23" r="1.2" fill="#78350F" />
    <circle cx="22" cy="23" r="1.2" fill="#78350F" />
    <path d="M13 17L19 19" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M27 17L21 19" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="16" cy="19" r="1.8" fill="#DC2626" />
    <circle cx="24" cy="19" r="1.8" fill="#DC2626" />
  </svg>
);

// Fireball Icon
export const MarioFireballIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="7" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
    <circle cx="11" cy="11" r="4.5" fill="#F59E0B" />
    <circle cx="10" cy="10" r="2.5" fill="#FEF08A" />
    <path d="M19 12C19 16 16 19 12 19" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 12C5 8 8 5 12 5" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Castle Bridge Axe Icon
export const MarioAxeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="6" y1="20" x2="16" y2="4" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    <path
      d="M13 3C17 2 21 5 21 8C21 11 17 13 13 11L15 7Z"
      fill="#F59E0B"
      stroke="#0F172A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const MarioLakituCloudIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M6 16C4 16 2 14.5 2 12.5C2 10.5 4 9 6 9C6.5 6 9 4 12 4C15.5 4 18 6.5 18.5 9.5C20.5 10 22 11.5 22 13.5C22 15.5 20 17 18 17H6Z"
      fill="#F8FAFC"
      stroke="#0F172A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="12" r="1.5" fill="#0F172A" />
    <circle cx="15" cy="12" r="1.5" fill="#0F172A" />
    <ellipse cx="12" cy="14" rx="2" ry="1" fill="#F87171" />
  </svg>
);

export const MarioIceFlowerIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="9" rx="8" ry="7" fill="#0284C7" stroke="#0F172A" strokeWidth="2" />
    <ellipse cx="12" cy="9" rx="5.5" ry="4.5" fill="#38BDF8" />
    <ellipse cx="12" cy="9" rx="3" ry="2.5" fill="#E0F2FE" />
    <rect x="10.5" y="8" width="1" height="2" fill="#0F172A" />
    <rect x="12.5" y="8" width="1" height="2" fill="#0F172A" />
    <path d="M12 16V22" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
    <path d="M6 18C8 16 11 18 12 19" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 18C16 16 13 18 12 19" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Growing Mario Stage Progression Avatar
export const MarioStageSprite: React.FC<{
  tier: 'small' | 'super' | 'fire' | 'star';
  avatar?: MarioAvatar;
  className?: string;
}> = ({ tier, avatar, className = 'w-6 h-6' }) => {
  if (avatar && avatar !== 'mario') {
    return <MarioCharacterAvatar character={avatar} className={className} />;
  }
  if (tier === 'small') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
        <ellipse cx="12" cy="15" rx="5" ry="3.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="10" cy="14" r="1" fill="#0F172A" />
        <circle cx="14" cy="14" r="1" fill="#0F172A" />
      </svg>
    );
  }
  if (tier === 'super') {
    return (
      <svg viewBox="0 0 28 28" fill="none" className={className}>
        <path d="M6 12C6 7 10 3 14 3C18 3 22 7 22 12H6Z" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
        <ellipse cx="14" cy="16" rx="6.5" ry="5.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
        <path d="M10 19C12 18 16 18 18 19" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.2" fill="#0F172A" />
        <circle cx="16" cy="15" r="1.2" fill="#0F172A" />
        <path d="M8 21V26H20V21" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (tier === 'fire') {
    return (
      <svg viewBox="0 0 28 28" fill="none" className={className}>
        <path d="M6 12C6 7 10 3 14 3C18 3 22 7 22 12H6Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        <ellipse cx="14" cy="16" rx="6.5" ry="5.5" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
        <path d="M10 19C12 18 16 18 18 19" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.2" fill="#0F172A" />
        <circle cx="16" cy="15" r="1.2" fill="#0F172A" />
        <path d="M8 21V26H20V21" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M6 12C6 7 10 3 14 3C18 3 22 7 22 12H6Z" fill="#FCD34D" stroke="#0F172A" strokeWidth="2" />
      <ellipse cx="14" cy="16" rx="6.5" ry="5.5" fill="#FEF08A" stroke="#0F172A" strokeWidth="2" />
      <path d="M10 19C12 18 16 18 18 19" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.2" fill="#0F172A" />
      <circle cx="16" cy="15" r="1.2" fill="#0F172A" />
      <path d="M8 21V26H20V21" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};
