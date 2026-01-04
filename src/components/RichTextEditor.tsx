import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
  const quillRef = useRef<ReactQuill>(null);

  // Custom toolbar configuration
  const modules = {
    toolbar: {
      container: [
        // Headers
        [{ header: [1, 2, 3, false] }],
        
        // Text formatting
        ['bold', 'italic', 'underline', 'strike'],
        
        // Lists
        [{ list: 'ordered' }, { list: 'bullet' }],
        
        // Blockquote and code block
        ['blockquote', 'code-block'],
        
        // Links
        ['link'],
        
        // Clear formatting
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
  ];

  // Handle text change with length validation
  const handleChange = (content: string, _delta: any, _source: string, editor: any) => {
    const text = editor.getText();
    const textLength = text.trim().length;

    // Allow change if within limit or if user is deleting
    if (textLength <= maxLength || content.length < value.length) {
      onChange(content);
    }
  };

  // Focus the editor on mount
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.focus();
    }
  }, []);

  return (
    <div className="rich-text-editor-container">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="rich-text-editor"
      />
    </div>
  );
};

export default RichTextEditor;

