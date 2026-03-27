// Upload simple sin Firebase
let selectedFiles = [];

document.addEventListener('DOMContentLoaded', function() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    // Click to select files
    if (uploadZone) {
        uploadZone.addEventListener('click', () => fileInput.click());
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', handleFiles);
    }
    
    // Drag and drop
    if (uploadZone) {
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            handleFiles({ target: { files: e.dataTransfer.files } });
        });
    }
    
    // Upload button
    if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadSession);
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSelection);
    }
    
    // Update buttons when session name changes
    const sessionNameInput = document.getElementById('sessionName');
    if (sessionNameInput) {
        sessionNameInput.addEventListener('input', updateButtons);
    }
    
    // Load recent sessions
    loadRecentSessions();
});

function handleFiles(e) {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showToast('Por favor selecciona solo archivos de imagen', 'error');
        return;
    }
    
    selectedFiles = [...selectedFiles, ...imageFiles];
    updatePreview();
    updateButtons();
}

function updatePreview() {
    const container = document.getElementById('previewContainer');
    const countElement = document.getElementById('photoCount');
    
    if (countElement) {
        countElement.textContent = `${selectedFiles.length} foto${selectedFiles.length !== 1 ? 's' : ''} seleccionada${selectedFiles.length !== 1 ? 's' : ''}`;
    }
    
    if (!container) return;
    
    if (selectedFiles.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fas fa-images" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>No hay fotos seleccionadas</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.style.cssText = 'position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 2px solid var(--border-color);';
            div.innerHTML = `
                <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; top: 5px; right: 5px;">
                    <button onclick="removeFile(${index})" style="width: 28px; height: 28px; background: rgba(239, 68, 68, 0.9); border: none; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 20px 10px 10px;">
                    <p style="font-size: 11px; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${file.name}</p>
                </div>
            `;
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updatePreview();
    updateButtons();
}

function updateButtons() {
    const uploadBtn = document.getElementById('uploadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sessionName = document.getElementById('sessionName');
    const hasFiles = selectedFiles.length > 0;
    const hasName = sessionName && sessionName.value.trim() !== '';
    
    if (uploadBtn) {
        uploadBtn.disabled = !hasFiles || !hasName;
    }
    if (clearBtn) {
        clearBtn.disabled = !hasFiles;
    }
}

function clearSelection() {
    selectedFiles = [];
    const fileInput = document.getElementById('fileInput');
    const sessionName = document.getElementById('sessionName');
    const sessionCategory = document.getElementById('sessionCategory');
    const sessionDescription = document.getElementById('sessionDescription');
    const setAsCover = document.getElementById('setAsCover');
    
    if (fileInput) fileInput.value = '';
    if (sessionName) sessionName.value = '';
    if (sessionCategory) sessionCategory.value = '';
    if (sessionDescription) sessionDescription.value = '';
    if (setAsCover) setAsCover.checked = false;
    
    updatePreview();
    updateButtons();
    showToast('Selección limpiada', 'success');
}

function uploadSession() {
    const sessionName = document.getElementById('sessionName').value.trim();
    const category = document.getElementById('sessionCategory').value;
    const description = document.getElementById('sessionDescription').value.trim();
    const setAsCover = document.getElementById('setAsCover').checked;
    
    if (!sessionName) {
        showToast('Por favor ingresa un nombre para la sesión', 'error');
        return;
    }
    
    if (selectedFiles.length === 0) {
        showToast('Por favor selecciona al menos una foto', 'error');
        return;
    }
    
    // Show progress
    const progressContainer = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressContainer) progressContainer.style.display = 'block';
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                if (progressContainer) progressContainer.style.display = 'none';
                showToast(`Sesión "${sessionName}" subida exitosamente con ${selectedFiles.length} fotos`, 'success');
                
                if (setAsCover) {
                    showToast('Sesión establecida como principal', 'warning');
                }
                
                clearSelection();
                loadRecentSessions();
            }, 500);
        }
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${Math.round(progress)}%`;
    }, 200);
}

function loadRecentSessions() {
    const container = document.getElementById('recentSessions');
    if (!container) return;
    
    // Simulación de sesiones recientes
    const sessions = [
        { name: 'Jose Texeira', photos: 7, date: 'Hace 2 horas', cover: '../jose-texeira/1.jpeg' },
        { name: 'Wilson Alcequiez', photos: 7, date: 'Hace 1 día', cover: '../Wilson-Alcequiez/1.jpeg' },
        { name: 'Calpo', photos: 10, date: 'Hace 3 días', cover: '../Calpo/1.jpeg' }
    ];
    
    container.innerHTML = '';
    sessions.forEach(session => {
        const div = document.createElement('div');
        div.style.cssText = 'background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; transition: all 0.3s ease;';
        div.innerHTML = `
            <div style="aspect-ratio: 16/10; overflow: hidden;">
                <img src="${session.cover}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;">
            </div>
            <div style="padding: 15px;">
                <h4 style="font-size: 16px; margin-bottom: 5px;">${session.name}</h4>
                <p style="font-size: 12px; color: var(--text-secondary);">
                    <i class="fas fa-images" style="margin-right: 5px;"></i>
                    ${session.photos} fotos • ${session.date}
                </p>
            </div>
        `;
        div.onmouseover = function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            this.querySelector('img').style.transform = 'scale(1.1)';
        };
        div.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            this.querySelector('img').style.transform = 'scale(1)';
        };
        container.appendChild(div);
    });
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
