import { useRef, useEffect, useState } from 'react';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing your LinkedIn post here...',
  maxLength = 3000,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Update editor content when value changes externally
  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const text = editorRef.current.innerText || '';
      
      if (text.length <= maxLength) {
        onChange(content);
      } else {
        // Prevent exceeding max length
        editorRef.current.innerHTML = value;
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const formatBlock = (tag: string) => {
    document.execCommand('formatBlock', false, tag);
    editorRef.current?.focus();
  };

  return (
    <div className="rich-text-editor-container">
      {/* Toolbar */}
      <div className="rich-text-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              formatBlock('h1');
            }}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              formatBlock('h2');
            }}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              formatBlock('h3');
            }}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat('bold');
            }}
            title="Bold (Ctrl/Cmd+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat('italic');
            }}
            title="Italic (Ctrl/Cmd+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat('underline');
            }}
            title="Underline (Ctrl/Cmd+U)"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat('strikeThrough');
            }}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn toolbar-btn-list"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat('insertUnorderedList');
            }}
            title="Bullet List"
          >
            <span className="icon-bullet-list">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <button
            type="button"
            className="toolbar-btn toolbar-btn-list"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat('insertOrderedList');
            }}
            title="Numbered List"
          >
            <span className="icon-numbered-list">
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </span>
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              insertLink();
            }}
            title="Insert Link"
          >
            🔗
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              formatBlock('blockquote');
            }}
            title="Blockquote"
          >
            ❝
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              formatBlock('pre');
            }}
            title="Code Block"
          >
            {'</>'}
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat('removeFormat');
              formatBlock('p');
            }}
            title="Clear Formatting"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className={`rich-text-editor ${isFocused ? 'focused' : ''}`}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;

