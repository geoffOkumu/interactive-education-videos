# Interactive Education Videos

A web-based platform that transforms tutorials and course materials into engaging video content with a blackboard aesthetic.

## Features

### 🎨 Blackboard Canvas
- Full-screen canvas with authentic blackboard appearance
- Dark background with subtle chalk texture
- Chalk-style fonts (Permanent Marker, Indie Flower)
- Automated typing effect for text content
- Image display with "taped to board" visual effect

### 👨‍🏫 Teacher Avatar
- Circular avatar positioned in bottom-left corner
- Styled to stand out from the blackboard background
- Smooth hover animations

### 🎮 Video Controls
- **Play/Pause**: Toggle playback
- **Progress Bar**: Visual timeline with seek functionality
- **Time Display**: Current time / Total duration
- **Volume Control**: Adjust audio level
- **Fullscreen**: Expand to full screen
- **Auto-hide**: Controls automatically hide during playback

### 📚 Chapter Navigation
- Side panel with all available chapters
- Click to jump to specific chapters
- Current chapter highlighting
- Smooth transitions between chapters

### ⌨️ Keyboard Shortcuts
- **SPACE**: Play/Pause
- **← →**: Skip backward/forward 5 seconds
- **↑ ↓**: Volume up/down
- **M**: Mute/Unmute
- **F**: Toggle fullscreen
- **N**: Next chapter
- **P**: Previous chapter
- **ESC**: Close chapter panel

### 💾 Progress Saving
- Automatically saves playback position
- Remembers volume preferences
- Restores state on page reload

## File Structure

```
interactive-education-videos/
├── index.html              # Main HTML structure
├── css/
│   └── styles.css         # All styling and animations
├── js/
│   ├── app.js            # Main application coordinator
│   ├── canvas.js         # Canvas drawing and animations
│   ├── controls.js       # Video control functionality
│   └── chapters.js       # Chapter navigation logic
├── assets/
│   ├── fonts/            # Chalk-style fonts
│   └── images/           # Teacher avatar and demo images
│       └── teacher-avatar.svg
└── README.md             # This file
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/geoffOkumu/interactive-education-videos.git
cd interactive-education-videos
```

2. Open `index.html` in your browser or serve it using a local web server:

Using Python:
```bash
python -m http.server 8000
```

Using Node.js (http-server):
```bash
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Usage

### Basic Operation
1. Open the application in your browser
2. Press **SPACE** or click the play button to start
3. Use the chapter menu (top-right button) to navigate between chapters
4. Hover over the video to reveal controls
5. Use keyboard shortcuts for quick navigation

### Customization

#### Adding Custom Chapters
Modify the `loadSampleData()` method in `js/app.js`:

```javascript
this.chapters = [
    {
        title: "Your Chapter Title",
        duration: 30, // seconds
        slides: [
            {
                text: "Your content here...",
                x: 100,
                y: 150,
                fontSize: 36
            }
        ]
    }
];
```

#### Adding Images to Slides
```javascript
slides: [
    {
        text: "Chapter with image",
        x: 100,
        y: 100,
        fontSize: 32,
        images: [
            {
                src: "path/to/image.jpg",
                x: 500,
                y: 300,
                width: 400,
                height: 300
            }
        ]
    }
]
```

#### Adjusting Typing Speed
In `js/canvas.js`, modify the `typingSpeed` property:
```javascript
this.typingSpeed = 50; // milliseconds per character
```

## Design Philosophy

### Visual Style
- **Background**: Dark slate color (#1a1a1a) with gradient
- **Text**: Chalk-white (#f5f5f5) with subtle shadows
- **Fonts**: Google Fonts - "Permanent Marker" and "Indie Flower"
- **Texture**: Subtle radial gradients for chalk dust effect
- **Images**: White borders with corner tape strips
- **Avatar**: Circular frame with gradient background

### User Experience
- Clean, distraction-free interface
- Intuitive controls that hide during playback
- Responsive design for various screen sizes
- Smooth animations and transitions
- Accessibility-focused keyboard navigation

## Future Enhancements

### Planned Features
- 🤖 AI integration for text-to-speech narration
- 📊 Dynamic content loading from external sources
- 🎨 Multiple theme options (traditional blackboard, whiteboard, etc.)
- 📱 Enhanced mobile support with touch gestures
- 🔊 Audio narration synchronization
- 📝 Interactive quizzes and assessments
- 💬 Student annotations and notes
- 📤 Export functionality for slides/chapters

### AI Integration Points
The codebase is structured to support AI integration:

- **Content Generation**: API methods in `VideoApp` class for adding/updating chapters
- **Narration**: Event system ready for audio synchronization
- **Dynamic Slides**: Canvas manager supports runtime slide creation
- **State Management**: `getState()` method provides current context for AI processing

Example AI integration:
```javascript
// Generate content via AI
const aiGeneratedChapter = await generateChapterWithAI(topic);
window.app.addChapter(aiGeneratedChapter);
```

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open source and available under the MIT License.

## Acknowledgments
- Google Fonts for chalk-style typography
- HTML5 Canvas API for rendering capabilities
- Modern CSS for animations and responsive design

## Contact
For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for educators and learners everywhere**
