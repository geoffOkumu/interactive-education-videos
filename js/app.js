/**
 * Main Application - Coordinates all components
 * Integrates canvas, controls, and chapters managers
 */

class VideoApp {
    constructor() {
        this.canvasManager = new CanvasManager('blackboard');
        this.controlsManager = new ControlsManager();
        this.chaptersManager = new ChaptersManager();
        
        this.chapters = [];
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // Load sample data
        this.loadSampleData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load progress from localStorage
        this.loadProgress();
        
        this.isInitialized = true;
    }

    setupEventListeners() {
        // Listen for control events
        document.addEventListener('play', () => this.onPlay());
        document.addEventListener('pause', () => this.onPause());
        document.addEventListener('seek', (e) => this.onSeek(e.detail));
        document.addEventListener('timeupdate', (e) => this.onTimeUpdate(e.detail));
        document.addEventListener('ended', () => this.onEnded());
        
        // Listen for chapter events
        document.addEventListener('chapterchange', (e) => this.onChapterChange(e.detail));
        
        // Keyboard shortcuts for chapter navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            if (e.key === 'n' || e.key === 'N') {
                this.chaptersManager.nextChapter();
            } else if (e.key === 'p' || e.key === 'P') {
                this.chaptersManager.previousChapter();
            }
        });
        
        // Save progress before unload
        window.addEventListener('beforeunload', () => this.saveProgress());
    }

    loadSampleData() {
        // Sample chapters with slides
        this.chapters = [
            {
                title: "Introduction to Interactive Learning",
                duration: 30,
                slides: [
                    {
                        text: "Welcome to Interactive Education Videos!\n\nThis platform transforms tutorials into engaging video content with a blackboard aesthetic.",
                        x: 100,
                        y: 150,
                        fontSize: 36
                    }
                ]
            },
            {
                title: "The Blackboard Interface",
                duration: 45,
                slides: [
                    {
                        text: "Our canvas mimics a traditional blackboard:\n\n• Dark background for reduced eye strain\n• Chalk-style fonts for authenticity\n• Smooth typing animations\n• Support for images and diagrams",
                        x: 100,
                        y: 100,
                        fontSize: 32
                    }
                ]
            },
            {
                title: "Interactive Features",
                duration: 40,
                slides: [
                    {
                        text: "Key Features:\n\n✓ Play/Pause controls\n✓ Progress tracking\n✓ Chapter navigation\n✓ Keyboard shortcuts\n✓ Volume control\n✓ Fullscreen mode",
                        x: 100,
                        y: 120,
                        fontSize: 32
                    }
                ]
            },
            {
                title: "Keyboard Shortcuts",
                duration: 35,
                slides: [
                    {
                        text: "Keyboard Shortcuts:\n\nSPACE - Play/Pause\n← → - Skip 5 seconds\n↑ ↓ - Volume up/down\nM - Mute/Unmute\nF - Fullscreen\nN - Next chapter\nP - Previous chapter\nESC - Close panels",
                        x: 100,
                        y: 100,
                        fontSize: 28
                    }
                ]
            },
            {
                title: "Getting Started",
                duration: 40,
                slides: [
                    {
                        text: "How to Use:\n\n1. Press SPACE or click the play button\n2. Use the chapter menu to navigate\n3. Hover to see controls\n4. Enjoy your learning experience!\n\nThis platform is ready for AI integration to generate dynamic content.",
                        x: 100,
                        y: 120,
                        fontSize: 30
                    }
                ]
            }
        ];
        
        // Load chapters
        this.chaptersManager.loadChapters(this.chapters);
        
        // Calculate total duration
        const totalDuration = this.chapters.reduce((sum, chapter) => sum + chapter.duration, 0);
        this.controlsManager.setDuration(totalDuration);
        
        // Render first chapter
        this.renderCurrentChapter(true);
    }

    onPlay() {
        // Continue typing if paused mid-animation
        if (!this.canvasManager.isTyping) {
            // Already rendered, just playing
        }
    }

    onPause() {
        // Stop typing animation if playing
        this.canvasManager.stopTyping();
    }

    onSeek(detail) {
        const { currentTime } = detail;
        
        // Update chapter based on time
        this.chaptersManager.updateChapterByTime(currentTime);
        
        // Render current chapter instantly (no animation on seek)
        this.renderCurrentChapter(true);
    }

    onTimeUpdate(detail) {
        const { currentTime } = detail;
        
        // Update chapter if time crosses chapter boundary
        this.chaptersManager.updateChapterByTime(currentTime);
    }

    onEnded() {
        console.log('Video ended');
        // Could auto-restart or show completion message
    }

    onChapterChange(detail) {
        const { index, chapter } = detail;
        console.log('Chapter changed to:', chapter.title);
        
        // Calculate start time for this chapter
        let startTime = 0;
        for (let i = 0; i < index; i++) {
            startTime += this.chapters[i].duration;
        }
        
        // Update controls to chapter start time
        this.controlsManager.setCurrentTime(startTime);
        
        // Render chapter
        this.renderCurrentChapter(false);
        
        // If playing, continue playing
        if (this.controlsManager.isPlaying) {
            this.controlsManager.play();
        }
    }

    renderCurrentChapter(instant = false) {
        const chapter = this.chaptersManager.getCurrentChapter();
        
        if (chapter && chapter.slides && chapter.slides.length > 0) {
            // For now, render the first slide of the chapter
            // In a full implementation, this could cycle through multiple slides
            this.canvasManager.renderSlide(chapter.slides[0], instant);
        }
    }

    saveProgress() {
        try {
            const progress = {
                currentTime: this.controlsManager.currentTime,
                chapterIndex: this.chaptersManager.currentChapterIndex,
                volume: this.controlsManager.volume
            };
            localStorage.setItem('videoProgress', JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('videoProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                
                // Restore volume
                if (progress.volume !== undefined) {
                    this.controlsManager.setVolume(progress.volume);
                }
                
                // Note: Don't auto-restore position to avoid confusion
                // User can manually navigate to last chapter if desired
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
    }

    /**
     * API for external control (for future AI integration)
     */
    
    /**
     * Add a new chapter dynamically
     * @param {Object} chapter - Chapter data
     */
    addChapter(chapter) {
        this.chapters.push(chapter);
        this.chaptersManager.loadChapters(this.chapters);
        
        // Update total duration
        const totalDuration = this.chapters.reduce((sum, ch) => sum + ch.duration, 0);
        this.controlsManager.setDuration(totalDuration);
    }

    /**
     * Update a chapter
     * @param {number} index - Chapter index
     * @param {Object} chapter - New chapter data
     */
    updateChapter(index, chapter) {
        if (index >= 0 && index < this.chapters.length) {
            this.chapters[index] = chapter;
            this.chaptersManager.loadChapters(this.chapters);
            
            // Update total duration
            const totalDuration = this.chapters.reduce((sum, ch) => sum + ch.duration, 0);
            this.controlsManager.setDuration(totalDuration);
        }
    }

    /**
     * Get current state for AI processing
     */
    getState() {
        return {
            currentTime: this.controlsManager.currentTime,
            isPlaying: this.controlsManager.isPlaying,
            currentChapter: this.chaptersManager.getCurrentChapter(),
            chapterIndex: this.chaptersManager.currentChapterIndex,
            totalChapters: this.chapters.length
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VideoApp();
    console.log('Interactive Education Video Platform initialized');
    console.log('Use keyboard shortcuts: SPACE (play/pause), N (next), P (previous), F (fullscreen)');
});
