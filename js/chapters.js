/**
 * Chapters Manager - Handles chapter/slide navigation
 * Manages chapter list display, navigation, and current chapter tracking
 */

class ChaptersManager {
    constructor() {
        this.chapters = [];
        this.currentChapterIndex = 0;
        this.isOpen = false;
        this.chapterStartTimes = [];
        
        this.elements = {
            selector: document.getElementById('chapterSelector'),
            list: document.getElementById('chapterList'),
            toggleBtn: document.getElementById('chapterToggleBtn'),
            closeBtn: document.getElementById('closeChaptersBtn')
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle button
        this.elements.toggleBtn.addEventListener('click', () => this.toggle());
        
        // Close button
        this.elements.closeBtn.addEventListener('click', () => this.close());
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.elements.selector.contains(e.target) && 
                !this.elements.toggleBtn.contains(e.target)) {
                this.close();
            }
        });
    }

    /**
     * Load chapters data
     * @param {Array} chapters - Array of chapter objects
     */
    loadChapters(chapters) {
        this.chapters = chapters;
        this.calculateChapterStartTimes();
        this.renderChapterList();
    }

    /**
     * Calculate and cache chapter start times
     */
    calculateChapterStartTimes() {
        this.chapterStartTimes = [];
        let cumulativeTime = 0;
        
        for (let i = 0; i < this.chapters.length; i++) {
            this.chapterStartTimes.push(cumulativeTime);
            cumulativeTime += this.chapters[i].duration;
        }
    }

    renderChapterList() {
        this.elements.list.innerHTML = '';
        
        this.chapters.forEach((chapter, index) => {
            const chapterItem = this.createChapterItem(chapter, index);
            this.elements.list.appendChild(chapterItem);
        });
        
        this.updateActiveChapter();
    }

    createChapterItem(chapter, index) {
        const item = document.createElement('div');
        item.className = 'chapter-item';
        item.dataset.index = index;
        
        const number = document.createElement('div');
        number.className = 'chapter-number';
        number.textContent = `Chapter ${index + 1}`;
        
        const title = document.createElement('div');
        title.className = 'chapter-title';
        title.textContent = chapter.title;
        
        const duration = document.createElement('div');
        duration.className = 'chapter-duration';
        duration.textContent = `Duration: ${this.formatDuration(chapter.duration)}`;
        
        item.appendChild(number);
        item.appendChild(title);
        item.appendChild(duration);
        
        item.addEventListener('click', () => this.selectChapter(index));
        
        return item;
    }

    selectChapter(index) {
        if (index >= 0 && index < this.chapters.length) {
            this.currentChapterIndex = index;
            this.updateActiveChapter();
            
            // Dispatch chapter change event
            this.dispatchEvent('chapterchange', {
                index: index,
                chapter: this.chapters[index]
            });
            
            // Close selector after selection
            this.close();
        }
    }

    updateActiveChapter() {
        const items = this.elements.list.querySelectorAll('.chapter-item');
        items.forEach((item, index) => {
            if (index === this.currentChapterIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Navigate to next chapter
     */
    nextChapter() {
        if (this.currentChapterIndex < this.chapters.length - 1) {
            this.selectChapter(this.currentChapterIndex + 1);
            return true;
        }
        return false;
    }

    /**
     * Navigate to previous chapter
     */
    previousChapter() {
        if (this.currentChapterIndex > 0) {
            this.selectChapter(this.currentChapterIndex - 1);
            return true;
        }
        return false;
    }

    /**
     * Get current chapter
     */
    getCurrentChapter() {
        return this.chapters[this.currentChapterIndex];
    }

    /**
     * Get chapter by index
     */
    getChapter(index) {
        return this.chapters[index];
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.elements.selector.classList.add('open');
    }

    close() {
        this.isOpen = false;
        this.elements.selector.classList.remove('open');
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    /**
     * Update current chapter based on time
     * @param {number} currentTime - Current playback time
     */
    updateChapterByTime(currentTime) {
        // Use cached start times for efficiency
        for (let i = 0; i < this.chapterStartTimes.length; i++) {
            const startTime = this.chapterStartTimes[i];
            const endTime = startTime + this.chapters[i].duration;
            
            if (currentTime >= startTime && currentTime < endTime) {
                if (this.currentChapterIndex !== i) {
                    this.currentChapterIndex = i;
                    this.updateActiveChapter();
                    this.dispatchEvent('chapterautochange', {
                        index: i,
                        chapter: this.chapters[i]
                    });
                }
                break;
            }
        }
    }
}

// Make ChaptersManager available globally
window.ChaptersManager = ChaptersManager;
