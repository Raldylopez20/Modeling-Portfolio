// Dashboard simple sin Firebase
const CONFIG = {
    STORAGE_KEYS: {
        isLoggedIn: 'portfolio_admin_logged_in',
        sessionExpiry: 'portfolio_admin_expiry',
        userData: 'portfolio_admin_user'
    },
    SESSION_DURATION: 24 * 60 * 60 * 1000
};

const Auth = {
    isAuthenticated() {
        const isLoggedIn = localStorage.getItem(CONFIG.STORAGE_KEYS.isLoggedIn);
        const expiry = localStorage.getItem(CONFIG.STORAGE_KEYS.sessionExpiry);
        
        if (!isLoggedIn || !expiry) return false;
        
        if (Date.now() > parseInt(expiry)) {
            this.logout();
            return false;
        }
        
        return true;
    },
    
    logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.isLoggedIn);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.sessionExpiry);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.userData);
        window.location.href = 'login.html';
    },
    
    getUser() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.userData);
        return userData ? JSON.parse(userData) : null;
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de cerrar sesión?')) {
                Auth.logout();
            }
        });
    }
    
    // Cargar datos del usuario
    const user = Auth.getUser();
    if (user) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => el.textContent = user.name);
    }
    
    // Cargar fotos de muestra
    loadGalleryPhotos();
    loadAlbums();
});

function loadGalleryPhotos() {
    const gallery = document.getElementById('photoGallery');
    const sessions = [
        { name: 'jose-texeira', count: 7, cover: '1.jpeg' },
        { name: 'Jose-Jhan', count: 7, cover: '1.jpeg' },
        { name: 'Calpo', count: 10, cover: '1.jpeg' },
        { name: 'Wilson-Alcequiez', count: 7, cover: '1.jpeg' },
        { name: 'focus', count: 10, cover: '1.jpeg' },
        { name: 'Inimigo-Young', count: 11, cover: '1.jpeg' }
    ];
    
    sessions.forEach((session, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'admin-photo';
        photoDiv.draggable = true;
        photoDiv.innerHTML = `
            <img src="../${session.name}/${session.cover}" alt="${session.name}">
            <div class="photo-order">${index + 1}</div>
            <div class="photo-overlay">
                <button class="photo-btn" title="Establecer como portada" onclick="setCover('${session.name}')">
                    <i class="fas fa-image"></i>
                </button>
                <button class="photo-btn" title="Editar" onclick="editSession('${session.name}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="photo-btn" title="Eliminar" onclick="deleteSession('${session.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Drag and drop functionality
        photoDiv.addEventListener('dragstart', handleDragStart);
        photoDiv.addEventListener('dragover', handleDragOver);
        photoDiv.addEventListener('drop', handleDrop);
        photoDiv.addEventListener('dragend', handleDragEnd);
        
        gallery.appendChild(photoDiv);
    });
}

function loadAlbums() {
    const albumsList = document.getElementById('albumsList');
    const albums = [
        { name: 'Jose Texeira', photos: 7, views: 234, category: 'Editorial' },
        { name: 'Jose Jhan', photos: 7, views: 189, category: 'Fashion' },
        { name: 'Calpo', photos: 10, views: 156, category: 'Lifestyle' },
        { name: 'Wilson Alcequiez', photos: 7, views: 145, category: 'Fitness' },
        { name: 'Focus', photos: 10, views: 201, category: 'Editorial' },
        { name: 'Inimigo Young', photos: 11, views: 178, category: 'Streetwear' }
    ];
    
    albums.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.style.cssText = 'background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; transition: all 0.3s ease;';
        albumCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">${album.name}</h3>
                    <span style="font-size: 12px; color: var(--text-secondary); background: var(--bg-darker); padding: 4px 10px; border-radius: 20px;">${album.category}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button style="width: 32px; height: 32px; background: var(--bg-darker); border: none; border-radius: 8px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='var(--text-secondary)'">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button style="width: 32px; height: 32px; background: var(--bg-darker); border: none; border-radius: 8px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-secondary)'">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid var(--border-color);">
                <div style="display: flex; gap: 15px;">
                    <span style="font-size: 13px; color: var(--text-secondary);">
                        <i class="fas fa-images" style="margin-right: 5px; color: var(--primary-color);"></i>
                        ${album.photos} fotos
                    </span>
                    <span style="font-size: 13px; color: var(--text-secondary);">
                        <i class="fas fa-eye" style="margin-right: 5px; color: var(--secondary-color);"></i>
                        ${album.views} vistas
                    </span>
                </div>
                <button class="section-action" style="padding: 8px 16px; font-size: 13px;">
                    <i class="fas fa-external-link-alt"></i>
                    Ver
                </button>
            </div>
        `;
        albumCard.onmouseover = function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        };
        albumCard.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
        albumsList.appendChild(albumCard);
    });
}

// Drag and drop functions
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedElement !== this) {
        const gallery = document.getElementById('photoGallery');
        const allPhotos = [...gallery.children];
        const draggedIndex = allPhotos.indexOf(draggedElement);
        const droppedIndex = allPhotos.indexOf(this);
        
        if (draggedIndex < droppedIndex) {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedElement, this);
        }
        
        updateOrderNumbers();
        
        showToast('Orden actualizado correctamente', 'success');
    }
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedElement = null;
}

function updateOrderNumbers() {
    const orders = document.querySelectorAll('.photo-order');
    orders.forEach((order, index) => {
        order.textContent = index + 1;
    });
}

function setCover(sessionName) {
    showToast(`${sessionName} establecido como portada`, 'success');
}

function editSession(sessionName) {
    showToast(`Editando sesión: ${sessionName}`, 'warning');
}

function deleteSession(sessionName) {
    if (confirm(`¿Estás seguro de eliminar la sesión "${sessionName}"?`)) {
        showToast(`Sesión ${sessionName} eliminada`, 'success');
    }
}

function showReorderModal() {
    showToast('Arrastra las fotos en la galería para reordenarlas', 'warning');
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}

function showAnalyticsModal() {
    window.open('https://analytics.google.com', '_blank');
}

function showCreateAlbumModal() {
    const name = prompt('Nombre del nuevo álbum:');
    if (name) {
        showToast(`Álbum "${name}" creado exitosamente`, 'success');
    }
}

// Toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type} fade-in`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 20px;"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

window.showToast = showToast;
