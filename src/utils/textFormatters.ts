import { marked } from 'marked';
import TurndownService from 'turndown';
import DOMPurify from 'dompurify';

// Initialize Turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Configure marked for better security and consistency
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
});

/**
 * Convert HTML to Markdown
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html || html.trim() === '') return '';
  
  try {
    // Sanitize HTML first
    const sanitized = DOMPurify.sanitize(html);
    return turndownService.turndown(sanitized);
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error);
    return html;
  }
};

/**
 * Convert Markdown to HTML
 */
export const markdownToHtml = (markdown: string): string => {
  if (!markdown || markdown.trim() === '') return '';
  
  try {
    const html = marked.parse(markdown) as string;
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Error converting Markdown to HTML:', error);
    return markdown;
  }
};

/**
 * Strip all formatting and return plain text
 */
export const stripFormatting = (html: string): string => {
  if (!html || html.trim() === '') return '';
  
  try {
    // Create a temporary div to extract text content
    const temp = document.createElement('div');
    temp.innerHTML = DOMPurify.sanitize(html);
    return temp.textContent || temp.innerText || '';
  } catch (error) {
    console.error('Error stripping formatting:', error);
    return html;
  }
};

/**
 * Sanitize HTML for security
 */
export const sanitizeHtml = (html: string): string => {
  if (!html || html.trim() === '') return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'del',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'code', 'pre', 'blockquote',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

/**
 * Unicode text style mappings for LinkedIn compatibility
 */
const unicodeMaps = {
  bold: {
    A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', 
    K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', 
    U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
    a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', 
    k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', 
    u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  },
  italic: {
    A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑', 
    K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛', 
    U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',
    a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫', 
    k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', 
    u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻'
  }
};

/**
 * Convert text to Unicode bold
 */
const toUnicodeBold = (text: string): string => {
  return text.split('').map(char => unicodeMaps.bold[char as keyof typeof unicodeMaps.bold] || char).join('');
};

/**
 * Convert text to Unicode italic
 */
const toUnicodeItalic = (text: string): string => {
  return text.split('').map(char => unicodeMaps.italic[char as keyof typeof unicodeMaps.italic] || char).join('');
};

/**
 * Convert text to Unicode underline using combining low line character (U+0332)
 */
const toUnicodeUnderline = (text: string): string => {
  return text.split('').map(char => char + '\u0332').join('');
};

/**
 * Format content for LinkedIn with Unicode alternatives
 */
export const formatForLinkedIn = (content: string, format: 'html' | 'markdown'): string => {
  if (!content || content.trim() === '') return '';
  
  let html = format === 'markdown' ? markdownToHtml(content) : content;
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = DOMPurify.sanitize(html);
  
  // Process text nodes and convert formatting to Unicode
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      let text = Array.from(element.childNodes).map(processNode).join('');
      
      // Convert formatting to Unicode alternatives
      switch (tagName) {
        case 'strong':
        case 'b':
          return toUnicodeBold(text);
        case 'em':
        case 'i':
          return toUnicodeItalic(text);
        case 'u':
          return toUnicodeUnderline(text);
        case 's':
        case 'del':
        case 'strike':
          return `~${text}~`; // Strikethrough as tilde wrapping
        case 'h1':
          return `\n\n${toUnicodeBold(text.toUpperCase())}\n\n`;
        case 'h2':
          return `\n\n${toUnicodeBold(text)}\n\n`;
        case 'h3':
          return `\n\n${toUnicodeBold(text)}\n`;
        case 'p':
          return `${text}\n\n`;
        case 'br':
          return '\n';
        case 'li':
          return `• ${text}\n`;
        case 'ul':
        case 'ol':
          return `\n${text}\n`;
        case 'blockquote':
          return `\n❝ ${text} ❞\n\n`;
        case 'code':
          return `\`${text}\``;
        case 'pre':
          return `\n\`\`\`\n${text}\n\`\`\`\n\n`;
        case 'a':
          const href = element.getAttribute('href');
          return href ? `${text} (${href})` : text;
        default:
          return text;
      }
    }
    
    return '';
  };
  
  let result = Array.from(temp.childNodes).map(processNode).join('');
  
  // Clean up excessive newlines
  result = result.replace(/\n{3,}/g, '\n\n').trim();
  
  return result;
};

/**
 * Get plain text length for character counting
 */
export const getPlainTextLength = (content: string, format: 'html' | 'markdown'): number => {
  const plainText = format === 'html' ? stripFormatting(content) : stripFormatting(markdownToHtml(content));
  return plainText.length;
};

/**
 * Check if content exceeds LinkedIn's character limit
 */
export const isWithinLinkedInLimit = (content: string, format: 'html' | 'markdown'): boolean => {
  const LINKEDIN_MAX_LENGTH = 3000;
  return getPlainTextLength(content, format) <= LINKEDIN_MAX_LENGTH;
};

