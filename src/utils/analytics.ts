/**
 * Analytics utilities for GTM/GA4 event tracking
 * All events push to dataLayer and are gated by Consent Mode
 */

import { ConsentType } from '../components/ConsentBanner';
import type { EditorTypeValue } from '../types/editor';

const CONSENT_KEY = 'analytics_consent';

// Event parameter types (no content, only metadata)
export interface PostStartParams {
  editor_mode: EditorTypeValue;
}

export interface CopyOutputParams {
  copy_format: 'plain' | 'rich' | 'markdown';
  editor_mode: EditorTypeValue;
  chars_total: number;
  over_limit: boolean;
  duration_ms: number;
}

export interface ToggleEditorModeParams {
  from: EditorTypeValue;
  to: EditorTypeValue;
  has_content: boolean;
}

export interface ClearPostParams {
  chars_total: number;
  editor_mode: EditorTypeValue;
}

export interface FormatActionParams {
  action: string;
  editor_mode: EditorTypeValue;
}

export interface HelpOpenParams {
  section: string;
}

// Union type for all event params
type EventParams =
  | PostStartParams
  | CopyOutputParams
  | ToggleEditorModeParams
  | ClearPostParams
  | FormatActionParams
  | HelpOpenParams
  | Record<string, unknown>;

// Event names as constants
export const EVENTS = {
  POST_START: 'post_start',
  COPY_OUTPUT: 'copy_output',
  TOGGLE_EDITOR_MODE: 'toggle_editor_mode',
  CLEAR_POST: 'clear_post',
  FORMAT_ACTION: 'format_action',
  HELP_OPEN: 'help_open',
} as const;

/**
 * Check if analytics consent has been granted
 */
export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === ConsentType.GRANTED;
  } catch {
    return false;
  }
}

/**
 * Push an event to the dataLayer
 * Events are pushed regardless of consent - GTM/GA4 will respect Consent Mode
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return;
  
  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];
  
  // Push event to dataLayer
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  // Log in development for debugging
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, params);
  }
}

/**
 * Track post_start event
 */
export function trackPostStart(params: PostStartParams): void {
  trackEvent(EVENTS.POST_START, params);
}

/**
 * Track copy_output event (primary success metric)
 */
export function trackCopyOutput(params: CopyOutputParams): void {
  trackEvent(EVENTS.COPY_OUTPUT, params);
}

/**
 * Track toggle_editor_mode event
 */
export function trackToggleEditorMode(params: ToggleEditorModeParams): void {
  trackEvent(EVENTS.TOGGLE_EDITOR_MODE, params);
}

/**
 * Track clear_post event
 */
export function trackClearPost(params: ClearPostParams): void {
  trackEvent(EVENTS.CLEAR_POST, params);
}

/**
 * Track format_action event (toolbar button clicks)
 */
export function trackFormatAction(action: string, editorMode: EditorTypeValue): void {
  trackEvent(EVENTS.FORMAT_ACTION, {
    action,
    editor_mode: editorMode,
  });
}

/**
 * Track help_open event
 */
export function trackHelpOpen(section: string): void {
  trackEvent(EVENTS.HELP_OPEN, { section });
}
