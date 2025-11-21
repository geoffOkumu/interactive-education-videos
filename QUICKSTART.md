# Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Option 1: Open Directly
Simply open `index.html` in your web browser by double-clicking it.

### Option 2: Use a Local Server (Recommended)

**Python (most systems have this):**
```bash
python3 -m http.server 8000
# Then open: http://localhost:8000
```

**Node.js:**
```bash
npx http-server
# Then open: http://localhost:8080
```

**VS Code:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## 🎮 How to Use

### Basic Controls
- **Press SPACE** to start playing
- **Click and drag** the progress bar to skip
- **Hover** at the bottom to show controls

### Navigation
- **Click the menu icon** (top-right) to see all chapters
- **Click any chapter** to jump to it
- Press **N** for next chapter, **P** for previous

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| SPACE | Play/Pause |
| ← → | Skip 5 seconds |
| ↑ ↓ | Volume up/down |
| M | Mute/Unmute |
| F | Fullscreen |
| N | Next chapter |
| P | Previous chapter |
| ESC | Close panels |

## 🎨 Customizing Content

### Add Your Own Chapters

Edit `js/app.js` and find the `loadSampleData()` method (around line 66):

```javascript
this.chapters = [
    {
        title: "Your Chapter Title",
        duration: 30,  // seconds
        slides: [
            {
                text: "Your content here...\n\nSupports multiple lines!",
                x: 100,
                y: 150,
                fontSize: 36
            }
        ]
    },
    // Add more chapters...
];
```

### Change Typing Speed

In `js/canvas.js`, line 15:
```javascript
this.typingSpeed = 50; // Lower = faster (milliseconds per character)
```

### Customize Colors

Edit `css/styles.css`:
- **Background**: Line 19 - `background: linear-gradient(...)`
- **Text color**: Line 139 - `this.ctx.fillStyle = '#f5f5f5'`
- **Accent color**: Search for `#4CAF50` to change the green theme

## 📱 Responsive Design

The platform automatically adapts to:
- **Desktop**: Full experience with all controls
- **Tablet**: Optimized layout with touch support
- **Mobile**: Simplified controls, larger touch targets

## 🤖 For Developers

### Project Structure
```
js/
├── app.js       → Main coordinator
├── canvas.js    → Rendering engine
├── controls.js  → Playback controls
└── chapters.js  → Navigation
```

### Adding AI Features

The app is exposed globally:
```javascript
// Access from browser console or your AI code
window.app.addChapter(newChapter);
window.app.getState(); // Get current playback state
window.app.canvasManager.setTypingSpeed(30);
```

### Event System

Listen to events:
```javascript
document.addEventListener('chapterchange', (e) => {
    console.log('Changed to:', e.detail.chapter.title);
});
```

## 🐛 Troubleshooting

**Text not showing?**
- Check browser console (F12) for errors
- Ensure Google Fonts can load (check your internet/firewall)

**Controls not working?**
- Refresh the page (F5)
- Clear browser cache (Ctrl+Shift+Delete)

**Performance issues?**
- Reduce typing speed in `js/canvas.js`
- Close other browser tabs

## 📚 Learn More

See the full [README.md](README.md) for:
- Complete feature list
- AI integration examples
- Browser compatibility
- Contributing guidelines

---

**Need help?** Open an issue on GitHub!
