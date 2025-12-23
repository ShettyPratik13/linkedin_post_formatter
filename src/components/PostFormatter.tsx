import { useState, type ChangeEvent } from 'react';
import './PostFormatter.css';

const PostFormatter: React.FC = () => {
  const [postText, setPostText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setPostText('');
  };

  const addEmoji = (emoji: string) => {
    setPostText(prev => prev + emoji);
  };

  const popularEmojis = ['😊', '👍', '🎉', '💡', '🚀', '📈', '💼', '🔥', '✨', '🎯', '💪', '🌟', '📊', '✅', '🏆'];

  const characterCount = postText.length;
  const linkedInMaxLength = 3000;

  return (
    <div className="post-formatter-container">
      <header className="header">
        <h1>LinkedIn Post Formatter</h1>
        <p className="subtitle">Create engaging posts with rich text and emojis</p>
      </header>

      <div className="formatter-content">
        <div className="editor-section">
          <div className="section-header">
            <h2>✍️ Compose Your Post</h2>
            <span className={`character-count ${characterCount > linkedInMaxLength ? 'over-limit' : ''}`}>
              {characterCount} / {linkedInMaxLength}
            </span>
          </div>
          
          <textarea
            className="post-input"
            value={postText}
            onChange={handleTextChange}
            placeholder="Start typing your LinkedIn post here...&#10;&#10;Tips:&#10;- Use emojis to make your post more engaging&#10;- Break text into short paragraphs for better readability&#10;- Add relevant hashtags at the end"
            maxLength={linkedInMaxLength}
          />

          <div className="emoji-picker">
            <h3>Quick Emojis:</h3>
            <div className="emoji-list">
              {popularEmojis.map((emoji, index) => (
                <button
                  key={index}
                  className="emoji-button"
                  onClick={() => addEmoji(emoji)}
                  title={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-clear" onClick={handleClear} disabled={!postText}>
              Clear
            </button>
            <button className="btn btn-copy" onClick={handleCopy} disabled={!postText}>
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>

        <div className="preview-section">
          <div className="section-header">
            <h2>👁️ Preview</h2>
          </div>
          <div className="post-preview">
            {postText ? (
              <div className="preview-text">{postText}</div>
            ) : (
              <div className="preview-placeholder">
                Your post preview will appear here...
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>💡 Pro tip: LinkedIn posts with 3-5 emojis tend to get more engagement!</p>
      </footer>
    </div>
  );
};

export default PostFormatter;
