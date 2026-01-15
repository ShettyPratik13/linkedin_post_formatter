/**
 * Shared editor types and constants
 */

export const EditorType = {
  WYSIWYG: 'wysiwyg',
  MARKDOWN: 'markdown',
} as const;

export type EditorTypeValue = typeof EditorType[keyof typeof EditorType];
