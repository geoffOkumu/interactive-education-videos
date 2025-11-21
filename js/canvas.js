/**
 * Canvas Manager - Handles all canvas drawing and animation logic
 * Supports text typing animation, image display with tape effect, and slide transitions
 */

class CanvasManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.currentSlide = null;
        this.typingSpeed = 50; // milliseconds per character
        this.isTyping = false;
        this.typingInterval = null;
        this.images = {};
        this.fontFamily = "'Permanent Marker', cursive";
        this.fontSize = 32;
        
        this.init();
    }

    init() {
        // Set canvas size to match window
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Set default text style
        this.ctx.textBaseline = 'top';
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Redraw current slide if exists
        if (this.currentSlide) {
            this.renderSlide(this.currentSlide, true);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Render a slide with all its content
     * @param {Object} slide - Slide data containing text, images, etc.
     * @param {boolean} instant - If true, render without animation
     */
    async renderSlide(slide, instant = false) {
        this.currentSlide = slide;
        this.clear();
        
        if (instant) {
            // Render everything instantly
            this.drawSlideContent(slide, slide.text ? slide.text.length : 0);
        } else {
            // Animate text typing
            if (slide.text) {
                await this.typeText(slide.text, slide.x || 100, slide.y || 100, slide.fontSize || 32);
            }
            
            // Render images if any
            if (slide.images && slide.images.length > 0) {
                this.drawImages(slide.images);
            }
        }
    }

    /**
     * Draw slide content up to a certain character
     * @param {Object} slide - Slide data
     * @param {number} charIndex - Character index to draw up to
     */
    drawSlideContent(slide, charIndex) {
        this.clear();
        
        // Draw text up to character index
        if (slide.text && charIndex > 0) {
            const text = slide.text.substring(0, charIndex);
            const x = slide.x || 100;
            const y = slide.y || 100;
            const fontSize = slide.fontSize || 32;
            
            this.drawText(text, x, y, fontSize, true);
            
            // Add cursor if currently typing
            if (this.isTyping && charIndex < slide.text.length) {
                const cursorPos = this.calculateCursorPosition(text, x, y, fontSize);
                this.drawCursor(cursorPos.x, cursorPos.y, fontSize);
            }
        }
        
        // Draw images if text is complete
        if (slide.images && slide.images.length > 0 && (!slide.text || charIndex >= slide.text.length)) {
            this.drawImages(slide.images);
        }
    }

    /**
     * Calculate cursor position accounting for multi-line text
     * @param {string} text - Text up to cursor
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {number} fontSize - Font size
     * @returns {Object} Cursor position {x, y}
     */
    calculateCursorPosition(text, x, y, fontSize) {
        const maxWidth = this.canvas.width - x - 100;
        const lines = this.wrapText(text, maxWidth);
        
        if (lines.length === 0) {
            return { x: x, y: y };
        }
        
        const lastLine = lines[lines.length - 1];
        const lineY = y + ((lines.length - 1) * (fontSize + 10));
        const lineX = x + this.ctx.measureText(lastLine).width + 5;
        
        return { x: lineX, y: lineY };
    }

    /**
     * Type text with animation effect
     * @param {string} text - Text to type
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} fontSize - Font size
     */
    typeText(text, x, y, fontSize) {
        return new Promise((resolve) => {
            this.isTyping = true;
            let charIndex = 0;
            
            this.typingInterval = setInterval(() => {
                if (charIndex <= text.length) {
                    this.drawSlideContent(this.currentSlide, charIndex);
                    charIndex++;
                } else {
                    clearInterval(this.typingInterval);
                    this.isTyping = false;
                    this.drawSlideContent(this.currentSlide, text.length);
                    resolve();
                }
            }, this.typingSpeed);
        });
    }

    /**
     * Draw text on canvas
     * @param {string} text - Text to draw
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} fontSize - Font size
     * @param {boolean} multiline - Support multiline text
     */
    drawText(text, x, y, fontSize, multiline = true) {
        this.ctx.font = `${fontSize}px ${this.fontFamily}`;
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        
        if (multiline) {
            const lines = this.wrapText(text, this.canvas.width - x - 100);
            lines.forEach((line, index) => {
                this.ctx.fillText(line, x, y + (index * (fontSize + 10)));
            });
        } else {
            this.ctx.fillText(text, x, y);
        }
        
        this.ctx.shadowBlur = 0;
    }

    /**
     * Wrap text to fit within a certain width
     * @param {string} text - Text to wrap
     * @param {number} maxWidth - Maximum width
     * @returns {Array} Array of text lines
     */
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    /**
     * Draw cursor for typing animation
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} height - Cursor height
     */
    drawCursor(x, y, height) {
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(x, y, 3, height);
    }

    /**
     * Draw images with tape effect
     * @param {Array} images - Array of image objects with src, x, y, width, height
     */
    drawImages(images) {
        images.forEach(img => {
            if (this.images[img.src]) {
                this.drawImageWithTape(
                    this.images[img.src],
                    img.x,
                    img.y,
                    img.width || 300,
                    img.height || 200
                );
            } else {
                // Load image if not already loaded
                const image = new Image();
                image.onload = () => {
                    this.images[img.src] = image;
                    this.drawImageWithTape(
                        image,
                        img.x,
                        img.y,
                        img.width || 300,
                        img.height || 200
                    );
                };
                image.src = img.src;
            }
        });
    }

    /**
     * Draw an image with tape effect in corners
     * @param {Image} image - Image object
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Image width
     * @param {number} height - Image height
     */
    drawImageWithTape(image, x, y, width, height) {
        // Draw white border
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x - 10, y - 10, width + 20, height + 20);
        
        // Draw image
        this.ctx.drawImage(image, x, y, width, height);
        
        // Draw tape strips in corners
        this.drawTape(x - 20, y - 10, 60, 20, -15);
        this.drawTape(x + width - 40, y - 10, 60, 20, 15);
        this.drawTape(x - 20, y + height - 10, 60, 20, 15);
        this.drawTape(x + width - 40, y + height - 10, 60, 20, -15);
    }

    /**
     * Draw a tape strip
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Tape width
     * @param {number} height - Tape height
     * @param {number} rotation - Rotation angle in degrees
     */
    drawTape(x, y, width, height, rotation) {
        this.ctx.save();
        this.ctx.translate(x + width / 2, y + height / 2);
        this.ctx.rotate((rotation * Math.PI) / 180);
        
        // Tape color with transparency
        this.ctx.fillStyle = 'rgba(255, 255, 200, 0.6)';
        this.ctx.fillRect(-width / 2, -height / 2, width, height);
        
        // Tape border
        this.ctx.strokeStyle = 'rgba(200, 200, 150, 0.8)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-width / 2, -height / 2, width, height);
        
        this.ctx.restore();
    }

    /**
     * Stop any ongoing typing animation
     */
    stopTyping() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
            this.isTyping = false;
        }
    }

    /**
     * Set typing speed
     * @param {number} speed - Speed in milliseconds per character
     */
    setTypingSpeed(speed) {
        this.typingSpeed = speed;
    }
}

// Make CanvasManager available globally
window.CanvasManager = CanvasManager;
