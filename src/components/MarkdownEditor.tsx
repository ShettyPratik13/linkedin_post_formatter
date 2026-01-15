import { useRef, useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MdFormatListBulleted, MdFormatListNumbered, MdLink, MdFormatQuote, MdCode, MdMood } from 'react-icons/md';
import { trackFormatAction, trackHelpOpen } from '../utils/analytics';
import { EditorType } from '../types/editor';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

interface EmojiData {
  native: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing your LinkedIn post in Markdown...',
  maxLength = 3000,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      insertAtCursor('  ');
    }
  };

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start + text.length;
        textareaRef.current.selectionEnd = start + text.length;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const wrapSelection = (before: string, after: string = before) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = before + selectedText + after;
    const newValue = value.substring(0, start) + newText + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        if (selectedText) {
          textareaRef.current.selectionStart = start;
          textareaRef.current.selectionEnd = start + newText.length;
        } else {
          textareaRef.current.selectionStart = start + before.length;
          textareaRef.current.selectionEnd = start + before.length;
        }
        textareaRef.current.focus();
      }
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    
    onChange(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start + prefix.length;
        textareaRef.current.selectionEnd = start + prefix.length;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const insertEmoji = (emoji: EmojiData) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newValue = value.substring(0, start) + emoji.native + value.substring(end);
    
    onChange(newValue);
    trackFormatAction('emoji_insert', EditorType.MARKDOWN);
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + emoji.native.length;
        textareaRef.current.selectionStart = newPosition;
        textareaRef.current.selectionEnd = newPosition;
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Tracked toolbar actions
  const handleWrapSelectionTracked = (before: string, after: string, trackAs: string) => {
    trackFormatAction(trackAs, EditorType.MARKDOWN);
    wrapSelection(before, after);
  };

  const handleLinePrefixTracked = (prefix: string, trackAs: string) => {
    trackFormatAction(trackAs, EditorType.MARKDOWN);
    insertLinePrefix(prefix);
  };

  const handleInsertTracked = (text: string, trackAs: string) => {
    trackFormatAction(trackAs, EditorType.MARKDOWN);
    insertAtCursor(text);
  };

  const handleEmojiOpen = () => {
    if (!showEmojiPicker) {
      trackFormatAction('emoji_open', EditorType.MARKDOWN);
    }
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleHelpToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    if ((e.target as HTMLDetailsElement).open) {
      trackHelpOpen('markdown_syntax_guide');
    }
  };

  return (
    <div className="markdown-editor-container">
      {/* Markdown Toolbar */}
      <div className="markdown-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleWrapSelectionTracked('**', '**', 'bold')}
            title="Bold (Ctrl/Cmd+B)"
            aria-label="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleWrapSelectionTracked('*', '*', 'italic')}
            title="Italic (Ctrl/Cmd+I)"
            aria-label="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleWrapSelectionTracked('~~', '~~', 'strikethrough')}
            title="Strikethrough"
            aria-label="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleLinePrefixTracked('# ', 'h1')}
            title="Heading 1"
            aria-label="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleLinePrefixTracked('## ', 'h2')}
            title="Heading 2"
            aria-label="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleLinePrefixTracked('### ', 'h3')}
            title="Heading 3"
            aria-label="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleLinePrefixTracked('- ', 'bullet_list')}
            title="Bullet List"
            aria-label="Bullet List"
          >
            <MdFormatListBulleted size={18} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleLinePrefixTracked('1. ', 'numbered_list')}
            title="Numbered List"
            aria-label="Numbered List"
          >
            <MdFormatListNumbered size={18} />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleWrapSelectionTracked('[Link Text](', ')', 'link')}
            title="Link"
            aria-label="Link"
          >
            <MdLink size={18} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleWrapSelectionTracked('`', '`', 'inline_code')}
            title="Inline Code"
            aria-label="Inline Code"
          >
            <MdCode size={16} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleInsertTracked('\n```\n\n```\n', 'code_block')}
            title="Code Block"
            aria-label="Code Block"
          >
            <MdCode size={18} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleLinePrefixTracked('> ', 'blockquote')}
            title="Blockquote"
            aria-label="Blockquote"
          >
            <MdFormatQuote size={18} />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn toolbar-btn-emoji"
            onClick={(e) => {
              e.preventDefault();
              handleEmojiOpen();
            }}
            title="Insert Emoji"
            aria-label="Insert Emoji"
          >
            <MdMood size={18} />
          </button>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-container" ref={emojiPickerRef}>
          <Picker 
            data={data} 
            onEmojiSelect={insertEmoji}
            theme="auto"
            previewPosition="none"
            skinTonePosition="search"
          />
        </div>
      )}

      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        className="markdown-textarea"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        spellCheck
      />

      {/* Markdown Syntax Help */}
      <div className="markdown-help">
        <details onToggle={handleHelpToggle}>
          <summary>Markdown Syntax Guide</summary>
          <div className="help-content">
            <div className="help-section">
              <strong>Text Formatting:</strong>
              <ul>
                <li><code>**bold**</code> → <strong>bold</strong></li>
                <li><code>*italic*</code> → <em>italic</em></li>
                <li><code>~~strikethrough~~</code> → <s>strikethrough</s></li>
              </ul>
            </div>
            <div className="help-section">
              <strong>Headings:</strong>
              <ul>
                <li><code># Heading 1</code></li>
                <li><code>## Heading 2</code></li>
                <li><code>### Heading 3</code></li>
              </ul>
            </div>
            <div className="help-section">
              <strong>Lists:</strong>
              <ul>
                <li><code>- Bullet point</code></li>
                <li><code>1. Numbered item</code></li>
              </ul>
            </div>
            <div className="help-section">
              <strong>Links & Code:</strong>
              <ul>
                <li><code>[Link Text](url)</code></li>
                <li><code>`inline code`</code></li>
                <li><code>```code block```</code></li>
                <li><code>&gt; Blockquote</code></li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default MarkdownEditor;

