# LinkedIn Post Formatter

A powerful, modern web application built with React and TypeScript that helps you create engaging LinkedIn posts with comprehensive rich text formatting, dual editor modes (WYSIWYG and Markdown), and intelligent LinkedIn-compatible output.

## Features

### 🎨 Rich Text Editing
- **Dual Editor Modes**: Switch seamlessly between WYSIWYG (Visual) and Markdown editors
- **Complete Formatting**: Bold, Italic, Underline, Strikethrough
- **Headings**: H1, H2, H3 for structured content
- **Lists**: Bullet points and numbered lists
- **Links**: Add hyperlinks to your content
- **Code**: Inline code and code blocks
- **Blockquotes**: Format quotes and callouts

### 😊 Emoji Support
- Quick access to 20+ popular emojis
- One-click insertion into your post
- Perfect for increasing engagement

### 👁️ Live Preview
- Real-time preview of your formatted content
- See exactly how your post will look
- Supports all formatting styles

### 📊 Smart Copy Options
- **Copy for LinkedIn**: Plain text with Unicode formatting (bold → 𝗕𝗼𝗹𝗱, italic → 𝘐𝘵𝘢𝘭𝘪𝘤)
- **Copy Rich Text**: HTML format for platforms that support it
- **Copy Markdown**: For markdown-compatible platforms
- Visual feedback for successful copies

### 📏 Character Management
- Real-time character counter
- Respects LinkedIn's 3,000 character limit
- Warning indicator when approaching limit
- Counts plain text length (excluding formatting)

### 🎨 Modern Design
- Clean, intuitive interface
- Fully responsive - works on desktop, tablet, and mobile
- 🌓 Automatic dark mode based on system preferences
- Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ShettyPratik13/linkedin_post_formatter.git
cd linkedin_post_formatter
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```
*Note: The `--legacy-peer-deps` flag is needed for React 19 compatibility with react-quill*

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Visual (WYSIWYG) Mode

1. Click the **"Visual"** button in the editor mode toggle
2. Use the formatting toolbar to style your text:
   - Click formatting buttons (B, I, U, S) for basic styles
   - Select heading levels from the dropdown
   - Click list buttons for bullets or numbers
   - Use the link button to add hyperlinks
   - Add code blocks or blockquotes
3. Type directly in the editor with live formatting
4. See your formatted post in the preview pane

### Markdown Mode

1. Click the **"Markdown"** button in the editor mode toggle
2. Use the toolbar for quick Markdown insertions
3. Or type Markdown syntax directly:
   - `**bold**` for **bold text**
   - `*italic*` for *italic text*
   - `~~strikethrough~~` for ~~strikethrough~~
   - `# Heading 1`, `## Heading 2`, `### Heading 3`
   - `- Bullet point` or `1. Numbered item`
   - `[Link Text](url)` for links
   - `` `inline code` `` for inline code
   - ` ```code block``` ` for code blocks
   - `> Blockquote` for quotes
4. Expand the syntax guide at the bottom for quick reference

### Switching Between Modes

- Click the mode toggle buttons to switch editors
- Your content automatically converts between formats
- Formatting is preserved during conversion

### Adding Emojis

1. Scroll to the emoji picker below the editor
2. Click any emoji to add it to your post at the end
3. Emojis work in both Visual and Markdown modes

### Copying Your Post

Choose the format that works best for your target platform:

- **Copy for LinkedIn**: Optimized for LinkedIn with Unicode formatting
- **Copy Rich Text**: HTML format with full styling (works in Gmail, Word, etc.)
- **Copy Markdown**: Markdown syntax (works in GitHub, Discord, Slack, etc.)

### Posting to LinkedIn

1. Write and format your post
2. Click **"Copy for LinkedIn"**
3. Go to LinkedIn and paste in the post composer
4. Your formatting will appear with Unicode alternatives (since LinkedIn doesn't support HTML)

## Keyboard Shortcuts

### Visual (WYSIWYG) Mode
- Standard text editor shortcuts work as expected
- Use toolbar buttons for formatting

### Markdown Mode
- `Tab` - Insert 2 spaces (for indentation)
- Standard copy/paste shortcuts work

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast build tool and dev server
- **React Quill** - Rich text WYSIWYG editor
- **Marked** - Markdown parser
- **Turndown** - HTML to Markdown converter
- **DOMPurify** - HTML sanitization for security
- **CSS3** - Modern styling with CSS variables and media queries

## Features in Detail

### Rich Text Formatting

The application uses a powerful WYSIWYG editor (Quill) that provides:
- Intuitive toolbar with all essential formatting options
- Clean HTML output
- Mobile-friendly touch controls

### Markdown Support

Full GitHub Flavored Markdown (GFM) support:
- Automatic line breaks
- Fenced code blocks
- Inline HTML (sanitized)
- Tables (if needed)

### LinkedIn Compatibility

LinkedIn doesn't support HTML formatting in posts, so we use Unicode text alternatives:
- **Bold text**: Converts to Unicode bold characters (𝗕𝗼𝗹𝗱)
- **Italic text**: Converts to Unicode italic characters (𝘐𝘵𝘢𝘭𝘪𝘤)
- Lists: Uses bullet point characters (•)
- Quotes: Uses Unicode quotation marks (❝ ❞)
- Links: Shows as "Text (url)"

### Security

All HTML content is sanitized using DOMPurify to prevent XSS attacks and ensure safe rendering.

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Tips for Great LinkedIn Posts

### Content Strategy
- Keep your message clear and concise
- Break text into short paragraphs (2-3 lines each)
- Use headings to structure longer posts
- Add relevant hashtags at the end (3-5 recommended)

### Formatting Tips
- Use bold for key points and emphasis
- Use lists for easy-to-scan content
- Use emojis strategically (3-5 per post)
- Add quotes to highlight testimonials or important statements
- Use code blocks for technical content

### Engagement
- Start with a hook in the first line
- End with a call-to-action
- Ask questions to encourage comments
- Use line breaks to improve readability
- Preview your post before copying to ensure formatting looks good

## Known Limitations

- LinkedIn doesn't support actual bold/italic HTML, so we convert to Unicode alternatives
- Some Unicode characters may not display correctly on all devices
- Rich text copy may not work on all browsers (falls back to plain text)
- Very long posts (>3000 characters) will be rejected by LinkedIn

## Troubleshooting

### Installation Issues
- If you get peer dependency errors, use `npm install --legacy-peer-deps`
- Make sure you're using Node.js 16 or higher

### Copy Not Working
- If clipboard access fails, the browser may be blocking it
- Try using HTTPS or localhost
- Check browser permissions for clipboard access

### Formatting Not Showing on LinkedIn
- LinkedIn only supports plain text, so we use Unicode alternatives
- Some devices may not render all Unicode characters
- This is a LinkedIn limitation, not an app issue

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add TypeScript types for all new code
- Test on both desktop and mobile
- Test in both light and dark modes
- Update README if adding new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Pratik Shetty**
- GitHub: [@ShettyPratik13](https://github.com/ShettyPratik13)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/pratikshetty13/)

## Acknowledgments

- Built with [React](https://react.dev/)
- Rich text editing powered by [Quill](https://quilljs.com/)
- Markdown parsing by [Marked](https://marked.js.org/)
- Icons and emojis from Unicode

## Roadmap

Potential future enhancements:
- [ ] More emoji categories
- [ ] Custom emoji picker
- [ ] Save drafts locally
- [ ] Export to other formats (PDF, HTML file)
- [ ] Templates for common post types
- [ ] AI-powered post suggestions
- [ ] Scheduled post reminders
- [ ] Analytics for post length and formatting

---

Made with ❤️ for the LinkedIn community. Happy posting!
