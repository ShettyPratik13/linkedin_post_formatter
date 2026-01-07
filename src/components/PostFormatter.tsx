import { useState, useMemo } from 'react';
import RichTextEditor from './RichTextEditor';
import MarkdownEditor from './MarkdownEditor';
import {
  htmlToMarkdown,
  markdownToHtml,
  stripFormatting,
  formatForLinkedIn,
  getPlainTextLength,
} from '../utils/textFormatters';
import './PostFormatter.css';

type EditorMode = 'wysiwyg' | 'markdown';
type CopyFormat = 'plain' | 'rich' | 'markdown';

const PostFormatter: React.FC = () => {
  const [editorMode, setEditorMode] = useState<EditorMode>('wysiwyg');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [copied, setCopied] = useState<CopyFormat | null>(null);

  const linkedInMaxLength = 3000;

  // Get current content based on mode
  const currentContent = editorMode === 'wysiwyg' ? htmlContent : markdownContent;

  // Calculate character count (plain text)
  const characterCount = useMemo(() => {
    return getPlainTextLength(currentContent, editorMode === 'wysiwyg' ? 'html' : 'markdown');
  }, [currentContent, editorMode]);

  // Handle editor mode toggle
  const handleModeToggle = (newMode: EditorMode) => {
    if (newMode === editorMode) return;

    // Convert content between formats
    if (newMode === 'markdown' && htmlContent) {
      setMarkdownContent(htmlToMarkdown(htmlContent));
    } else if (newMode === 'wysiwyg' && markdownContent) {
      setHtmlContent(markdownToHtml(markdownContent));
    }

    setEditorMode(newMode);
  };

  // Handle content change in WYSIWYG mode
  const handleHtmlChange = (value: string) => {
    setHtmlContent(value);
  };

  // Handle content change in Markdown mode
  const handleMarkdownChange = (value: string) => {
    setMarkdownContent(value);
  };

  // Handle copy with different formats
  const handleCopy = async (format: CopyFormat) => {
    try {
      let textToCopy = '';

      if (format === 'plain') {
        // LinkedIn-compatible plain text with Unicode formatting
        textToCopy = formatForLinkedIn(
          currentContent,
          editorMode === 'wysiwyg' ? 'html' : 'markdown'
        );
      } else if (format === 'rich') {
        // Copy as HTML (for rich text compatible platforms)
        const html = editorMode === 'wysiwyg' ? htmlContent : markdownToHtml(markdownContent);
        // Create a ClipboardItem with HTML
        const blob = new Blob([html], { type: 'text/html' });
        const plainBlob = new Blob([stripFormatting(html)], { type: 'text/plain' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blob,
            'text/plain': plainBlob,
          }),
        ]);
        setCopied(format);
        setTimeout(() => setCopied(null), 2000);
        return;
      } else if (format === 'markdown') {
        // Copy as Markdown
        textToCopy = editorMode === 'markdown' ? markdownContent : htmlToMarkdown(htmlContent);
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback: copy plain text
      try {
        const plainText = stripFormatting(
          editorMode === 'wysiwyg' ? htmlContent : markdownToHtml(markdownContent)
        );
        await navigator.clipboard.writeText(plainText);
        setCopied(format);
        setTimeout(() => setCopied(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed: ', fallbackErr);
      }
    }
  };

  // Handle clear
  const handleClear = () => {
    setHtmlContent('');
    setMarkdownContent('');
  };

  // Generate preview HTML
  const previewHtml = useMemo(() => {
    if (!currentContent) return '';
    return editorMode === 'wysiwyg' ? htmlContent : markdownToHtml(markdownContent);
  }, [currentContent, editorMode, htmlContent, markdownContent]);

  const hasContent = Boolean(currentContent.trim());

  return (
    <div className="post-formatter-container">
      <header className="header">
        <h1>LinkedIn Post Formatter</h1>
        <p className="subtitle">Create engaging posts with rich text formatting</p>
      </header>

      <div className="formatter-content">
        <div className="editor-section">
          <div className="section-header">
            <h2>✍️ Compose Your Post</h2>
            <div className="header-controls">
              {/* Editor Mode Toggle */}
              <div className="mode-toggle">
                <button
                  className={`mode-btn ${editorMode === 'wysiwyg' ? 'active' : ''}`}
                  onClick={() => handleModeToggle('wysiwyg')}
                  aria-label="WYSIWYG Editor"
                  title="Visual Editor"
                >
                  Visual
                </button>
                <button
                  className={`mode-btn ${editorMode === 'markdown' ? 'active' : ''}`}
                  onClick={() => handleModeToggle('markdown')}
                  aria-label="Markdown Editor"
                  title="Markdown Editor"
                >
                  Markdown
                </button>
              </div>
              
              <span className={`character-count ${characterCount > linkedInMaxLength ? 'over-limit' : ''}`}>
                {characterCount} / {linkedInMaxLength}
              </span>
            </div>
          </div>

          {/* Conditional Editor Rendering */}
          <div className="editor-wrapper">
            {editorMode === 'wysiwyg' ? (
              <RichTextEditor
                value={htmlContent}
                onChange={handleHtmlChange}
                maxLength={linkedInMaxLength}
              />
            ) : (
              <MarkdownEditor
                value={markdownContent}
                onChange={handleMarkdownChange}
                maxLength={linkedInMaxLength}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="btn btn-clear"
              onClick={handleClear}
              disabled={!hasContent}
            >
              Clear
            </button>
            
            <div className="copy-buttons">
              <button
                className="btn btn-copy btn-primary"
                onClick={() => handleCopy('plain')}
                disabled={!hasContent}
                title="Copy for LinkedIn (with Unicode formatting)"
              >
                {copied === 'plain' ? '✓ Copied!' : 'Copy for LinkedIn'}
              </button>
              
              <button
                className="btn btn-copy"
                onClick={() => handleCopy('rich')}
                disabled={!hasContent}
                title="Copy as Rich Text (HTML)"
              >
                {copied === 'rich' ? '✓ Copied!' : 'Copy Rich Text'}
              </button>
              
              <button
                className="btn btn-copy"
                onClick={() => handleCopy('markdown')}
                disabled={!hasContent}
                title="Copy as Markdown"
              >
                {copied === 'markdown' ? '✓ Copied!' : 'Copy Markdown'}
              </button>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <div className="section-header">
            <h2>👁️ Preview</h2>
          </div>
          <div className="post-preview">
            {hasContent ? (
              <div 
                className="preview-text formatted-content"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="preview-placeholder">
                Your post preview will appear here...
                <br />
                <br />
                <small>Start typing in the editor to see your formatted content</small>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>💡 Pro tip: Use the 😊 emoji button in the toolbar to add emojis. Rich text formatting makes your LinkedIn posts more engaging!</p>
      </footer>
    </div>
  );
};

export default PostFormatter;
