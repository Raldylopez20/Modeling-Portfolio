// Portfolio Admin - JavaScript Principal
// Raldy Lopez Portfolio Dashboard

// ===== CONFIGURACIÓN =====
const CONFIG = {
    // Credenciales de acceso
    CREDENTIALS: {
        username: 'rlopez',
        password: 'rlopez123'
    },
    
    // Claves de almacenamiento
    STORAGE_KEYS: {
        isLoggedIn: 'portfolio_admin_logged_in',
        sessionExpiry: 'portfolio_admin_expiry',
        userData: 'portfolio_admin_user'
    },
    
    // Duración de sesión (24 horas)
    SESSION_DURATION: 24 * 60 * 60 * 1000
};

// ===== UTILIDADES =====
const Utils = {
    // Mostrar notificación toast
    showToast(message, type = 'success') {
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
        
        // Auto-remove después de 4 segundos
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },
    
    // Validar email
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Formatear números
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Debounce para eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Copiar al portapapeles
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copiado al portapapeles', 'success');
        } catch (err) {
            this.showToast('Error al copiar', 'error');
        }
    }
};

// ===== AUTENTICACIÓN CON FIREBASE =====
const Auth = {
    // Verificar si hay sesión activa
    isAuthenticated() {
        return new Promise((resolve) => {
            window.firebaseAuth.onAuthStateChanged((user) => {
                resolve(!!user);
            });
        });
    },
    
    // Iniciar sesión con Firebase
    async login(username, password) {
        try {
            // Para Firebase Auth, usamos email/password
            // Convertimos username a email para Firebase
            const email = `${username}@portfolio.local`;
            
            const result = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
            
            if (result.user) {
                // Guardar datos adicionales en localStorage
                localStorage.setItem(CONFIG.STORAGE_KEYS.isLoggedIn, 'true');
                localStorage.setItem(CONFIG.STORAGE_KEYS.sessionExpiry, 
                    (Date.now() + CONFIG.SESSION_DURATION).toString());
                localStorage.setItem(CONFIG.STORAGE_KEYS.userData, 
                    JSON.stringify({ 
                        username: username, 
                        name: 'Raldy Lopez', 
                        role: 'Administrador',
                        uid: result.user.uid 
                    }));
                
                return { success: true, message: 'Inicio de sesión exitoso' };
            }
        } catch (error) {
            console.error('Error en login:', error);
            
            // Si el usuario no existe, lo creamos
            if (error.code === 'auth/user-not-found') {
                try {
                    await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
                    // Intentar login de nuevo
                    return this.login(username, password);
                } catch (createError) {
                    return { success: false, message: 'Error al crear usuario' };
                }
            }
            
            return { success: false, message: 'Usuario o contraseña incorrectos' };
        }
    },
    
    // Cerrar sesión
    async logout() {
        try {
            await window.firebaseAuth.signOut();
            localStorage.removeItem(CONFIG.STORAGE_KEYS.isLoggedIn);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.sessionExpiry);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.userData);
            
            // Redirigir al login
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error en logout:', error);
            window.location.href = 'login.html';
        }
    },
    
    // Obtener datos del usuario
    getUser() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.userData);
        return userData ? JSON.parse(userData) : null;
    }
};

// ===== GESTIÓN DE SESIONES/FOTOS =====
const SessionManager = {
    // Obtener todas las sesiones
    getSessions() {
        // En una implementación real, esto vendría de una API o base de datos
        // Por ahora, devolvemos las sesiones del HTML principal
        return [
            { id: 'jose-texeira', name: 'Jose Texeira', photos: 7, category: 'Editorial', views: 234 },
            { id: 'jose-jhan', name: 'Jose Jhan', photos: 7, category: 'Fashion', views: 189 },
            { id: 'calpo', name: 'Calpo', photos: 10, category: 'Lifestyle', views: 156 },
            { id: 'wilson-alcequiez', name: 'Wilson Alcequiez', photos: 7, category: 'Fitness', views: 145 },
            { id: 'focus', name: 'Focus', photos: 10, category: 'Editorial', views: 201 },
            { id: 'inimigo-young', name: 'Inimigo Young', photos: 11, category: 'Streetwear', views: 178 }
        ];
    },
    
    // Crear nueva sesión
    createSession(sessionData) {
        // Aquí iría la lógica para crear una nueva sesión en la base de datos
        console.log('Creando sesión:', sessionData);
        return { success: true, id: Utils.generateId() };
    },
    
    // Actualizar sesión
    updateSession(id, data) {
        console.log('Actualizando sesión:', id, data);
        return { success: true };
    },
    
    // Eliminar sesión
    deleteSession(id) {
        console.log('Eliminando sesión:', id);
        return { success: true };
    },
    
    // Reordenar sesiones
    reorderSessions(order) {
        console.log('Nuevo orden:', order);
        return { success: true };
    },
    
    // Establecer foto portada
    setCover(sessionId, photoIndex) {
        console.log('Portada establecida:', sessionId, photoIndex);
        return { success: true };
    }
};

// ===== ANALYTICS =====
const Analytics = {
    // Obtener estadísticas
    async getStats() {
        // En implementación real, esto vendría de Google Analytics API
        // Por ahora, devolvemos mensaje de carga
        return {
            totalViews: 'Esperando datos...',
            totalPhotos: 67,
            topPhoto: 'Próximamente',
            topCountry: 'Próximamente',
            viewsChange: 'Configurando...',
            period: 'En proceso'
        };
    },
    
    // Obtener visitas en tiempo real (esperando datos reales)
    getRealtimeViews() {
        return 0; // Google Analytics actualizará esto automáticamente
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación en páginas protegidas
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!isLoginPage) {
        // Verificar si está autenticado con Firebase
        const isAuthenticated = await Auth.isAuthenticated();
        if (!isAuthenticated) {
            // Redirigir al login si no está autenticado
            window.location.href = 'login.html';
            return;
        }
    } else {
        // Si está en login y ya está autenticado, redirigir al dashboard
        const isAuthenticated = await Auth.isAuthenticated();
        if (isAuthenticated) {
            window.location.href = 'dashboard.html';
            return;
        }
    }
    
    // Inicializar componentes según la página
    if (isLoginPage) {
        initLoginPage();
    } else {
        initDashboardPage();
    }
});

// ===== INICIALIZAR PÁGINA DE LOGIN =====
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // Mostrar/ocultar contraseña
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = `<i class="fas fa-${type === 'password' ? 'eye' : 'eye-slash'}"></i>`;
        });
    }
    
    // Crear partículas animadas
    createParticles();
    
    // Manejar submit del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            const submitBtn = loginForm.querySelector('.login-btn');
            const errorMessage = document.getElementById('errorMessage');
            
            // Validar campos
            if (!username || !password) {
                showError('Por favor completa todos los campos');
                return;
            }
            
            // Mostrar loader
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                // Intentar login con Firebase
                const result = await Auth.login(username, password);
                
                if (result.success) {
                    // Login exitoso
                    errorMessage.classList.remove('show');
                    
                    // Guardar preferencia de recordar
                    if (remember) {
                        localStorage.setItem('portfolio_admin_remember', 'true');
                    }
                    
                    // Mostrar mensaje de éxito
                    Utils.showToast('¡Bienvenido Raldy! Redirigiendo...', 'success');
                    
                    // Redirigir al dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    // Login fallido
                    showError(result.message);
                    
                    // Shake animation
                    const card = document.querySelector('.login-card');
                    card.style.animation = 'shake 0.5s ease';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 500);
                }
            } catch (error) {
                showError('Error de conexión. Intenta nuevamente.');
                console.error('Error en login:', error);
            } finally {
                // Ocultar loader
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }
    
    function showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.querySelector('span').textContent = message;
            errorMessage.classList.add('show');
        }
    }
}

// ===== INICIALIZAR PÁGINA DE DASHBOARD =====
function initDashboardPage() {
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
    
    // Inicializar tooltips
    initTooltips();
    
    // Inicializar actualizaciones en tiempo real
    initRealtimeUpdates();
}

// ===== CREAR PARTÍCULAS =====
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        // Tamaño aleatorio
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Color aleatorio (de la paleta)
        const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(particle);
    }
}

// ===== TOOLTIPS =====
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = el.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = el.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
            });
            
            el._tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', () => {
            if (el._tooltip) {
                el._tooltip.remove();
                el._tooltip = null;
            }
        });
    });
}

// ===== ACTUALIZACIONES EN TIEMPO REAL =====
function initRealtimeUpdates() {
    // Nota: Las actualizaciones en tiempo real se activarán cuando Google Analytics
    // comience a recibir datos reales. Esto puede tardar 24-48 horas.
    
    // Verificar expiración de sesión cada minuto
    setInterval(() => {
        if (!Auth.isAuthenticated()) {
            Auth.logout();
        }
    }, 60000);
}

// ===== MÓDULO DE EXPORTACIÓN =====
window.PortfolioAdmin = {
    Utils,
    Auth,
    SessionManager,
    Analytics,
    showToast: Utils.showToast,
    logout: Auth.logout
};

// Función global para mostrar toasts (usada en HTML inline)
window.showToast = Utils.showToast.bind(Utils);
