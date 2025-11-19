// Gallery functionality
function initGallery() {
    const galleryTrack = document.getElementById('gallery-track');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    const scrollbarThumb = document.getElementById('scrollbar-thumb');
    
    if (!galleryTrack) return;
    
    const galleryItems = galleryTrack.querySelectorAll('.gallery-item');
    const itemWidth = galleryItems[0].offsetWidth + 20; // width + gap
    const visibleItems = Math.floor(galleryTrack.offsetWidth / itemWidth);
    const totalItems = galleryItems.length;
    
    // Update scrollbar thumb
    function updateScrollbar() {
        const scrollableWidth = galleryTrack.scrollWidth - galleryTrack.clientWidth;
        const scrollPosition = galleryTrack.scrollLeft;
        const thumbWidth = Math.max((galleryTrack.clientWidth / galleryTrack.scrollWidth) * 100, 10);
        const thumbPosition = (scrollPosition / scrollableWidth) * (100 - thumbWidth);
        
        scrollbarThumb.style.width = `${thumbWidth}%`;
        scrollbarThumb.style.left = `${thumbPosition}%`;
        
        // Update button states
        galleryPrev.disabled = scrollPosition <= 0;
        galleryNext.disabled = scrollPosition >= scrollableWidth - 10; // 10px tolerance
    }
    
    // Scroll to position
    function scrollGallery(direction) {
        const scrollAmount = itemWidth * visibleItems * 0.8;
        galleryTrack.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Click on scrollbar track
    scrollbarThumb.parentElement.addEventListener('click', (e) => {
        const trackRect = scrollbarThumb.parentElement.getBoundingClientRect();
        const clickX = e.clientX - trackRect.left;
        const percentage = clickX / trackRect.width;
        const scrollableWidth = galleryTrack.scrollWidth - galleryTrack.clientWidth;
        galleryTrack.scrollTo({
            left: percentage * scrollableWidth,
            behavior: 'smooth'
        });
    });
    
    // Event listeners
    galleryPrev.addEventListener('click', () => scrollGallery(-1));
    galleryNext.addEventListener('click', () => scrollGallery(1));
    galleryTrack.addEventListener('scroll', updateScrollbar);
    
    // Initialize
    updateScrollbar();
    
    // Update on resize
    window.addEventListener('resize', updateScrollbar);
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);

// Add keyboard navigation for better accessibility
document.addEventListener('keydown', (e) => {
    const galleryTrack = document.getElementById('gallery-track');
    if (!galleryTrack) return;
    
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        document.getElementById('gallery-prev')?.click();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        document.getElementById('gallery-next')?.click();
    }
});