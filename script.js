// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    setupSmoothScroll();
    setupInteractivity();
});

// Smooth scroll navigation
function setupSmoothScroll() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Setup interactive features
function setupInteractivity() {
    // Add click handlers to itinerary items
    document.querySelectorAll('.itinerary-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    // Setup note saving
    document.querySelectorAll('.notes-section button').forEach(button => {
        button.addEventListener('click', function() {
            const dayId = this.closest('section').id;
            const textarea = this.previousElementSibling;
            saveNote(dayId, textarea.value);
        });
    });
}

// Save notes to localStorage
function saveNote(dayId, content) {
    const notes = JSON.parse(localStorage.getItem('tripNotes')) || {};
    notes[dayId] = content;
    localStorage.setItem('tripNotes', JSON.stringify(notes));
    showNotification('Note saved!');
}

// Load notes from localStorage
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('tripNotes')) || {};
    document.querySelectorAll('.notes-section textarea').forEach(textarea => {
        const dayId = textarea.closest('section').id;
        if (notes[dayId]) {
            textarea.value = notes[dayId];
        }
    });
}

// Show temporary notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Filter itinerary by time or activity
function filterItinerary(filterType) {
    const items = document.querySelectorAll('.itinerary-item');
    items.forEach(item => {
        if (filterType === 'all') {
            item.style.display = 'block';
        } else {
            const category = item.getAttribute('data-category');
            item.style.display = category === filterType ? 'block' : 'none';
        }
    });
}

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    .itinerary-item.expanded {
        background: #e7f3ff;
        border-left-color: #764ba2;
    }
`;
document.head.appendChild(style);

// Export itinerary as JSON
function exportItinerary() {
    const notes = JSON.parse(localStorage.getItem('tripNotes')) || {};
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'japan-trip-2026.json';
    a.click();
    showNotification('Itinerary exported!');
}

// Import itinerary from JSON
function importItinerary(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem('tripNotes', JSON.stringify(data));
            location.reload();
            showNotification('Itinerary imported!');
        } catch (error) {
            showNotification('Error importing file');
        }
    };
    reader.readAsText(file);
}

// Add event listener for theme toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
