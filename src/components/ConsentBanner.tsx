import { useState, useEffect } from 'react';
import './ConsentBanner.css';

const CONSENT_KEY = 'analytics_consent';

export const ConsentType = {
  GRANTED: 'granted',
  DENIED: 'denied',
} as const;

export type ConsentTypeValue = typeof ConsentType[keyof typeof ConsentType];

type ConsentStatus = ConsentTypeValue | null;

function getStoredConsent(): ConsentStatus {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === ConsentType.GRANTED || stored === ConsentType.DENIED) {
      return stored as ConsentTypeValue;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

function setStoredConsent(status: ConsentTypeValue) {
  try {
    localStorage.setItem(CONSENT_KEY, status);
  } catch {
    // localStorage not available
  }
}

function updateGtagConsent(consentType: ConsentTypeValue) {
  const gtagValue = consentType === ConsentType.GRANTED ? ConsentType.GRANTED : ConsentType.DENIED;
  
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: gtagValue,
      ad_user_data: gtagValue,
      ad_personalization: gtagValue,
      analytics_storage: gtagValue,
    });
  }
}

export function initializeConsent() {
  const stored = getStoredConsent();
  if (stored === ConsentType.GRANTED) {
    updateGtagConsent(ConsentType.GRANTED);
  }
  // If denied or null, consent stays at default (denied)
}

const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't made a choice yet
    const stored = getStoredConsent();
    if (stored === null) {
      setVisible(true);
    } else if (stored === ConsentType.GRANTED) {
      // Re-apply consent in case page was refreshed
      updateGtagConsent(ConsentType.GRANTED);
    }
  }, []);

  const handleAccept = () => {
    setStoredConsent(ConsentType.GRANTED);
    updateGtagConsent(ConsentType.GRANTED);
    setVisible(false);
  };

  const handleDecline = () => {
    setStoredConsent(ConsentType.DENIED);
    updateGtagConsent(ConsentType.DENIED);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="consent-banner" role="dialog" aria-labelledby="consent-title">
      <div className="consent-content">
        <p id="consent-title" className="consent-text">
          We use cookies and analytics to understand how you use this tool and improve your experience.
          No personal data or post content is ever collected.
        </p>
        <div className="consent-buttons">
          <button
            className="consent-btn consent-btn-decline"
            onClick={handleDecline}
            type="button"
          >
            Decline
          </button>
          <button
            className="consent-btn consent-btn-accept"
            onClick={handleAccept}
            type="button"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
