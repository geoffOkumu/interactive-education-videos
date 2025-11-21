/**
 * Controls Manager - Handles video control functionality
 * Manages play/pause, progress bar, volume, fullscreen, and auto-hide behavior
 */

class ControlsManager {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.totalDuration = 0;
        this.volume = 0.7;
        this.isMuted = false;
        this.hideTimeout = null;
        this.progressUpdateInterval = null;
        
        this.elements = {
            container: document.getElementById('controlsContainer'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            playIcon: document.querySelector('.play-icon'),
            pauseIcon: document.querySelector('.pause-icon'),
            progressBar: document.getElementById('progressBar'),
            progressFilled: document.getElementById('progressFilled'),
            currentTimeDisplay: document.getElementById('currentTime'),
            totalTimeDisplay: document.getElementById('totalTime'),
            volumeBtn: document.getElementById('volumeBtn'),
            volumeIcon: document.querySelector('.volume-icon'),
            muteIcon: document.querySelector('.mute-icon'),
            volumeSlider: document.getElementById('volumeSlider'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            videoContainer: document.querySelector('.video-container')
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.showControls();
        
        // Initialize volume
        this.setVolume(this.volume);
    }

    setupEventListeners() {
        // Play/Pause
        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Progress bar
        this.elements.progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Volume
        this.elements.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.elements.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Fullscreen
        this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Mouse movement for auto-hide
        this.elements.videoContainer.addEventListener('mousemove', () => {
            this.showControls();
            this.setupAutoHide();
        });
        
        this.elements.videoContainer.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.hideControls();
            }
        });
        
        // Show controls when paused
        this.elements.container.addEventListener('mouseenter', () => {
            this.showControls();
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.skipTime(-5);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.skipTime(5);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.adjustVolume(0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.adjustVolume(-0.1);
                    break;
                case 'm':
                case 'M':
                    this.toggleMute();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.play();
        } else {
            this.pause();
        }
        
        this.updatePlayPauseButton();
    }

    play() {
        this.isPlaying = true;
        this.updatePlayPauseButton();
        this.setupAutoHide();
        
        // Start progress update
        if (!this.progressUpdateInterval) {
            this.progressUpdateInterval = setInterval(() => {
                this.updateProgress();
            }, 100);
        }
        
        // Dispatch play event
        this.dispatchEvent('play');
    }

    pause() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.showControls();
        
        // Stop progress update
        if (this.progressUpdateInterval) {
            clearInterval(this.progressUpdateInterval);
            this.progressUpdateInterval = null;
        }
        
        // Dispatch pause event
        this.dispatchEvent('pause');
    }

    updatePlayPauseButton() {
        if (this.isPlaying) {
            this.elements.playIcon.style.display = 'none';
            this.elements.pauseIcon.style.display = 'block';
        } else {
            this.elements.playIcon.style.display = 'block';
            this.elements.pauseIcon.style.display = 'none';
        }
    }

    updateProgress() {
        if (this.isPlaying && this.totalDuration > 0) {
            this.currentTime += 0.1;
            
            if (this.currentTime >= this.totalDuration) {
                this.currentTime = this.totalDuration;
                this.pause();
                this.dispatchEvent('ended');
            }
            
            const progress = (this.currentTime / this.totalDuration) * 100;
            this.elements.progressFilled.style.width = `${progress}%`;
            this.updateTimeDisplay();
            
            // Dispatch time update event
            this.dispatchEvent('timeupdate', { currentTime: this.currentTime });
        }
    }

    seek(event) {
        const rect = this.elements.progressBar.getBoundingClientRect();
        const pos = (event.clientX - rect.left) / rect.width;
        this.currentTime = pos * this.totalDuration;
        
        const progress = (this.currentTime / this.totalDuration) * 100;
        this.elements.progressFilled.style.width = `${progress}%`;
        this.updateTimeDisplay();
        
        // Dispatch seek event
        this.dispatchEvent('seek', { currentTime: this.currentTime });
    }

    skipTime(seconds) {
        this.currentTime = Math.max(0, Math.min(this.currentTime + seconds, this.totalDuration));
        
        const progress = (this.currentTime / this.totalDuration) * 100;
        this.elements.progressFilled.style.width = `${progress}%`;
        this.updateTimeDisplay();
        
        this.dispatchEvent('seek', { currentTime: this.currentTime });
    }

    setDuration(duration) {
        this.totalDuration = duration;
        this.elements.totalTimeDisplay.textContent = this.formatTime(duration);
    }

    setCurrentTime(time) {
        this.currentTime = time;
        const progress = (this.currentTime / this.totalDuration) * 100;
        this.elements.progressFilled.style.width = `${progress}%`;
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        this.elements.currentTimeDisplay.textContent = this.formatTime(this.currentTime);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.elements.volumeSlider.value = this.volume * 100;
        
        if (this.volume === 0) {
            this.isMuted = true;
        } else {
            this.isMuted = false;
        }
        
        this.updateVolumeButton();
        this.dispatchEvent('volumechange', { volume: this.volume });
    }

    adjustVolume(delta) {
        this.setVolume(this.volume + delta);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.previousVolume = this.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.previousVolume || 0.7);
        }
    }

    updateVolumeButton() {
        if (this.isMuted || this.volume === 0) {
            this.elements.volumeIcon.style.display = 'none';
            this.elements.muteIcon.style.display = 'block';
        } else {
            this.elements.volumeIcon.style.display = 'block';
            this.elements.muteIcon.style.display = 'none';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.elements.videoContainer.requestFullscreen().catch(err => {
                console.error('Error entering fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    showControls() {
        this.elements.container.classList.add('visible');
    }

    hideControls() {
        if (this.isPlaying) {
            this.elements.container.classList.remove('visible');
        }
    }

    setupAutoHide() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        
        if (this.isPlaying) {
            this.hideTimeout = setTimeout(() => {
                this.hideControls();
            }, 3000);
        }
    }

    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    reset() {
        this.pause();
        this.currentTime = 0;
        this.setCurrentTime(0);
    }
}

// Make ControlsManager available globally
window.ControlsManager = ControlsManager;
