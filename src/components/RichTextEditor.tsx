import { useRef, useEffect, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MdFormatListBulleted, MdFormatListNumbered, MdLink, MdFormatQuote, MdCode, MdClose, MdMood } from 'react-icons/md';
import { trackFormatAction } from '../utils/analytics';
import { EditorType } from '../types/editor';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

interface EmojiData {
  native: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing your LinkedIn post here...',
  maxLength = 3000,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Update editor content when value changes externally
  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

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

  const applyListFormat = (listType: 'ul' | 'ol') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      applyFormat(listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    if (selection.isCollapsed) {
      applyFormat(listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
      return;
    }

    const blockTags = new Set([
      'p',
      'div',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'pre',
      'ul',
      'ol',
      'li',
    ]);

    // Helper function to find the nearest block element ancestor
    const findBlockAncestor = (node: Node): Element | null => {
      let current = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
      while (current && current !== editorRef.current) {
        if (blockTags.has(current.tagName.toLowerCase())) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    };

    // Find the block elements at the start and end of the selection
    const startBlock = findBlockAncestor(range.startContainer);
    const endBlock = findBlockAncestor(range.endContainer);

    if (!startBlock || !endBlock) {
      // Fallback to original behavior if no block found
      applyFormat(listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
      return;
    }

    // Expand range to encompass entire block elements
    const expandedRange = document.createRange();
    expandedRange.setStartBefore(startBlock);
    expandedRange.setEndAfter(endBlock);

    const extracted = expandedRange.extractContents();
    const list = document.createElement(listType);
    const temp = document.createElement('div');
    temp.appendChild(extracted);

    let currentNodes: Node[] = [];

    const appendCurrentNodes = () => {
      if (!currentNodes.length) return;
      const listItem = document.createElement('li');
      currentNodes.forEach((node) => listItem.appendChild(node));
      list.appendChild(listItem);
      currentNodes = [];
    };

    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'br') {
          appendCurrentNodes();
          return;
        }

        if (blockTags.has(tagName)) {
          appendCurrentNodes();

          if (tagName === 'li') {
            const listItem = document.createElement('li');
            while (element.firstChild) {
              listItem.appendChild(element.firstChild);
            }
            list.appendChild(listItem);
            return;
          }

          if (tagName === 'ul' || tagName === 'ol') {
            const listItems = Array.from(element.children).filter(
              (child) => child.tagName.toLowerCase() === 'li'
            );
            if (listItems.length) {
              listItems.forEach((listItemNode) => {
                const listItem = document.createElement('li');
                while (listItemNode.firstChild) {
                  listItem.appendChild(listItemNode.firstChild);
                }
                list.appendChild(listItem);
              });
              return;
            }
          }

          const listItem = document.createElement('li');
          listItem.appendChild(element);
          list.appendChild(listItem);
          return;
        }
      }

      currentNodes.push(node);
    });

    appendCurrentNodes();

    if (!list.childNodes.length) {
      const listItem = document.createElement('li');
      listItem.appendChild(document.createElement('br'));
      list.appendChild(listItem);
    }

    expandedRange.insertNode(list);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(list);
    newRange.collapse(false);
    selection.addRange(newRange);

    editorRef.current?.focus();
    editorRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
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

  const insertEmoji = (emoji: EmojiData) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, emoji.native);
      trackFormatAction('emoji_insert', EditorType.WYSIWYG);
      setShowEmojiPicker(false);
    }
  };

  // Tracked toolbar actions
  const handleHeading = (level: string) => {
    trackFormatAction(level, EditorType.WYSIWYG);
    formatBlock(level);
  };

  const handleFormatAction = (command: string, trackAs: string) => {
    trackFormatAction(trackAs, EditorType.WYSIWYG);
    applyFormat(command);
  };

  const handleListAction = (listType: 'ul' | 'ol', trackAs: string) => {
    trackFormatAction(trackAs, EditorType.WYSIWYG);
    applyListFormat(listType);
  };

  const handleLinkAction = () => {
    trackFormatAction('link', EditorType.WYSIWYG);
    insertLink();
  };

  const handleBlockAction = (tag: string, trackAs: string) => {
    trackFormatAction(trackAs, EditorType.WYSIWYG);
    formatBlock(tag);
  };

  const handleClearFormatting = () => {
    trackFormatAction('clear_format', EditorType.WYSIWYG);
    applyFormat('removeFormat');
    formatBlock('p');
  };

  const handleEmojiOpen = () => {
    if (!showEmojiPicker) {
      trackFormatAction('emoji_open', EditorType.WYSIWYG);
    }
    setShowEmojiPicker(!showEmojiPicker);
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
              handleHeading('h1');
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
              handleHeading('h2');
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
              handleHeading('h3');
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
              handleFormatAction('bold', 'bold');
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
              handleFormatAction('italic', 'italic');
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
              handleFormatAction('underline', 'underline');
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
              handleFormatAction('strikeThrough', 'strikethrough');
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
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleListAction('ul', 'bullet_list');
            }}
            title="Bullet List"
          >
            <MdFormatListBulleted size={18} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleListAction('ol', 'numbered_list');
            }}
            title="Numbered List"
          >
            <MdFormatListNumbered size={18} />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleLinkAction();
            }}
            title="Insert Link"
          >
            <MdLink size={18} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleBlockAction('blockquote', 'blockquote');
            }}
            title="Blockquote"
          >
            <MdFormatQuote size={18} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleBlockAction('pre', 'code_block');
            }}
            title="Code Block"
          >
            <MdCode size={18} />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleClearFormatting();
            }}
            title="Clear Formatting"
          >
            <MdClose size={18} />
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
