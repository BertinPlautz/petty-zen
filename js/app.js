// ===== PETTY ZEN - JAVASCRIPT PRINCIPAL =====

class PettyZenApp {
    constructor() {
        this.currentUser = null;
        this.currentPet = null;
        this.currentScreen = 'home';
        this.achievements = [];
        this.moodHistory = [];
        this.streak = 0;
        
        this.init();
    }

    init() {
        console.log('🐾 Petty Zen App iniciando...');
        
        // Verificar se já tem dados salvos
        this.loadUserData();
        
        // Setup inicial
        this.setupEventListeners();
        this.setupServiceWorker();
        
        // Mostrar tela apropriada
        this.showInitialScreen();
        
        // Inicializar depois de um pequeno delay
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);

        console.log('✅ App inicializado com sucesso!');
    }

    // ===== GERENCIAMENTO DE DADOS =====
    loadUserData() {
        try {
            const userData = localStorage.getItem('pettyzen_user');
            const petData = localStorage.getItem('pettyzen_pet');
            const progressData = localStorage.getItem('pettyzen_progress');

            if (userData && petData) {
                this.currentUser = JSON.parse(userData);
                this.currentPet = JSON.parse(petData);
                
                if (progressData) {
                    const progress = JSON.parse(progressData);
                    this.moodHistory = progress.moodHistory || [];
                    this.achievements = progress.achievements || [];
                    this.streak = progress.streak || 0;
                }

                console.log('📊 Dados do usuário carregados:', this.currentUser.name);
                return true;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
        }
        return false;
    }

    saveUserData() {
        try {
            localStorage.setItem('pettyzen_user', JSON.stringify(this.currentUser));
            localStorage.setItem('pettyzen_pet', JSON.stringify(this.currentPet));
            
            const progressData = {
                moodHistory: this.moodHistory,
                achievements: this.achievements,
                streak: this.streak,
                lastUpdate: new Date().toISOString()
            };
            localStorage.setItem('pettyzen_progress', JSON.stringify(progressData));
            
            console.log('💾 Dados salvos com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
        }
    }

    // ===== GERENCIAMENTO DE TELAS =====
    showInitialScreen() {
        const hasUserData = this.loadUserData();
        
        if (hasUserData) {
            // Usuário já cadastrado - ir direto para o app
            this.showMainApp();
        } else {
            // Primeiro acesso - mostrar welcome
            this.showWelcomeScreen();
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const appContainer = document.getElementById('app-container');
        
        if (welcomeScreen && appContainer) {
            welcomeScreen.classList.add('active');
            appContainer.classList.remove('active');
        }
    }

    showMainApp() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const appContainer = document.getElementById('app-container');
        
        if (welcomeScreen && appContainer) {
            welcomeScreen.classList.remove('active');
            appContainer.classList.add('active');
            
            // Atualizar interface com dados do usuário
            this.updateUserInterface();
            this.updateProgressData();
        }
    }

    switchScreen(screenName) {
        // Remover active de todas as telas
        document.querySelectorAll('.content-screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Remover active de todos os botões de navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Ativar tela selecionada
        const targetScreen = document.getElementById(`${screenName}-screen`);
        const targetBtn = document.querySelector(`.nav-btn[data-screen="${screenName}"]`);

        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }

        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // Executar ações específicas da tela
        this.handleScreenSwitch(screenName);

        console.log(`📱 Tela alterada para: ${screenName}`);
    }

    handleScreenSwitch(screenName) {
        switch (screenName) {
            case 'progress':
                this.updateProgressCharts();
                break;
            case 'chat':
                this.focusChatInput();
                break;
            case 'player':
                this.updateAudioLibrary();
                break;
            case 'settings':
                this.populateSettings();
                break;
        }
    }

    // ===== CONFIGURAÇÃO DE EVENTOS =====
    setupEventListeners() {
        // Botão de iniciar app
        const startBtn = document.getElementById('start-app');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleUserRegistration());
        }

        // Botões de ansiedade
        document.querySelectorAll('.anxiety-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.anxiety-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Navegação inferior
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.switchScreen(screen);
            });
        });

        // Ações rápidas
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Play button da recomendação diária
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                const audio = e.currentTarget.dataset.audio;
                this.playAudio(audio);
            });
        }

        // Cards de áudio
        document.querySelectorAll('.audio-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const audioName = e.currentTarget.dataset.audio;
                this.selectAudio(audioName);
            });
        });

        // Botões de humor
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.recordMood(e.currentTarget.dataset.mood);
            });
        });

        // Configurações - toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.handleSettingChange(e.target.id, e.target.checked);
            });
        });

        // Notificações
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Configurações rápidas
        const settingsBtn = document.querySelector('.settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.switchScreen('settings'));
        }

        console.log('🔗 Event listeners configurados');
    }

    // ===== REGISTRO DO USUÁRIO =====
    handleUserRegistration() {
        const ownerName = document.getElementById('owner-name').value.trim();
        const petName = document.getElementById('pet-name').value.trim();
        const petBreed = document.getElementById('pet-breed').value;
        const petAge = document.getElementById('pet-age').value;
        const anxietyLevel = document.querySelector('.anxiety-btn.selected')?.dataset.level;

        // Validação
        if (!ownerName || !petName || !petBreed || !petAge || !anxietyLevel) {
            this.showMessage('Por favor, preencha todos os campos! 🐾', 'error');
            return;
        }

        // Salvar dados
        this.currentUser = {
            name: ownerName,
            registrationDate: new Date().toISOString(),
            settings: {
                notifications: true,
                reminders: true
            }
        };

        this.currentPet = {
            name: petName,
            breed: petBreed,
            age: petAge,
            anxietyLevel: anxietyLevel,
            avatar: this.generatePetAvatar(petBreed)
        };

        // Inicializar progresso
        this.initializeProgress();

        // Salvar e ir para o app
        this.saveUserData();
        this.showMessage(`Bem-vindas, ${ownerName} e ${petName}! 💕`, 'success');
        
        setTimeout(() => {
            this.showMainApp();
        }, 1500);

        console.log('👤 Usuário registrado:', this.currentUser);
    }

    generatePetAvatar(breed) {
        // Gerar emoji baseado na raça
        const breedEmojis = {
            'labrador': '🦮',
            'golden': '🐕',
            'bulldog': '🐶',
            'poodle': '🐩',
            'husky': '🐺',
            'srd': '🐕‍🦺'
        };
        return breedEmojis[breed] || '🐕';
    }

    initializeProgress() {
        this.moodHistory = [];
        this.achievements = [
            {
                id: 'first_day',
                name: 'Primeiro Dia',
                description: 'Começou a jornada zen!',
                earned: true,
                date: new Date().toISOString()
            }
        ];
        this.streak = 1;

        // Adicionar entrada de humor inicial
        this.recordMood('calm');
    }

    // ===== INTERFACE DO USUÁRIO =====
    updateUserInterface() {
        if (!this.currentUser || !this.currentPet) return;

        // Atualizar nomes
        const userNameDisplay = document.getElementById('user-name-display');
        const petNameDisplay = document.getElementById('pet-name-display');
        const petProgressName = document.getElementById('pet-progress-name');

        if (userNameDisplay) userNameDisplay.textContent = this.currentUser.name;
        if (petNameDisplay) petNameDisplay.textContent = this.currentPet.name;
        if (petProgressName) petProgressName.textContent = this.currentPet.name;

        // Atualizar avatar do pet
        const petAvatar = document.querySelector('.pet-avatar i');
        if (petAvatar) {
            petAvatar.textContent = this.currentPet.avatar || '🐕';
        }

        // Atualizar saudação contextual
        this.updateGreeting();

        console.log('🎨 Interface atualizada');
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Oi';

        if (hour < 12) greeting = 'Bom dia';
        else if (hour < 18) greeting = 'Boa tarde';
        else greeting = 'Boa noite';

        const greetingText = document.querySelector('.greeting-text');
        if (greetingText && this.currentUser) {
            greetingText.innerHTML = `${greeting}, <span id="user-name-display">${this.currentUser.name}</span>!`;
        }
    }

    updateProgressData() {
        // Atualizar contador de sequência
        const streakCounter = document.querySelector('.streak-counter span');
        if (streakCounter) {
            streakCounter.textContent = `${this.streak} dias consecutivos!`;
        }

        // Atualizar progresso da semana
        this.updateWeekProgress();

        // Atualizar conquistas
        this.updateAchievementsDisplay();
    }

    updateWeekProgress() {
        const progressItems = document.querySelectorAll('.progress-item');
        const today = new Date().getDay(); // 0 = domingo, 6 = sábado

        progressItems.forEach((item, index) => {
            const moodIndicator = item.querySelector('.mood-indicator');
            
            // Limpar classes
            item.classList.remove('active', 'completed');
            moodIndicator.classList.remove('happy', 'calm', 'anxious');

            if (index === today) {
                item.classList.add('active');
            } else if (index < today) {
                item.classList.add('completed');
                
                // Adicionar humor aleatório para dias passados (demo)
                const moods = ['happy', 'calm', 'calm'];
                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                moodIndicator.classList.add(randomMood);
            }
        });
    }

    // ===== AÇÕES RÁPIDAS =====
    handleQuickAction(action) {
        switch (action) {
            case 'emergency':
                this.handleEmergency();
                break;
            case 'mood-check':
                this.openMoodCheck();
                break;
            case 'timer':
                this.openWorkTimer();
                break;
            case 'chat':
                this.switchScreen('chat');
                break;
        }

        console.log(`⚡ Ação rápida: ${action}`);
    }

    handleEmergency() {
        // SOS Ansiedade - tocar áudio calmante imediatamente
        this.showMessage('🚨 Modo SOS ativado! Tocando áudio calmante...', 'warning');
        this.playAudio('chuva-suave');
        this.switchScreen('player');
        
        // Adicionar vibração se disponível
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    }

    openMoodCheck() {
        this.showMessage('📸 Tire uma foto do seu cãozinho e registre o humor dele hoje!', 'info');
        this.switchScreen('progress');
        
        // Simular abertura da câmera (em app real seria navigator.mediaDevices.getUserMedia)
        setTimeout(() => {
            this.recordMood('calm');
            this.showMessage('✅ Humor registrado com sucesso!', 'success');
        }, 2000);
    }

    openWorkTimer() {
        this.showMessage('⏰ Timer de trabalho configurado! Seu cãozinho ficará calmo enquanto você trabalha.', 'info');
        this.switchScreen('player');
        
        // Ativar timer de 2 horas automaticamente
        const timerBtn = document.querySelector('.timer-btn[data-minutes="120"]');
        if (timerBtn) {
            timerBtn.click();
        }
    }

    // ===== SISTEMA DE HUMOR =====
    recordMood(mood) {
        const today = new Date().toISOString().split('T')[0];
        
        // Remover entrada do mesmo dia se existir
        this.moodHistory = this.moodHistory.filter(entry => 
            entry.date.split('T')[0] !== today
        );

        // Adicionar nova entrada
        this.moodHistory.push({
            date: new Date().toISOString(),
            mood: mood,
            petName: this.currentPet.name
        });

        // Manter apenas os últimos 30 dias
        if (this.moodHistory.length > 30) {
            this.moodHistory = this.moodHistory.slice(-30);
        }

        // Verificar conquistas
        this.checkAchievements();

        // Salvar dados
        this.saveUserData();

        console.log(`😊 Humor registrado: ${mood}`);
    }

    // ===== SISTEMA DE CONQUISTAS =====
    checkAchievements() {
        const achievementsToCheck = [
            {
                id: 'first_week',
                name: 'Primeira Semana',
                description: '7 dias de dedicação!',
                condition: () => this.moodHistory.length >= 7
            },
            {
                id: 'happy_streak',
                name: 'Mamãe Zen',
                description: 'Pet mais calmo detectado',
                condition: () => {
                    const lastThree = this.moodHistory.slice(-3);
                    return lastThree.length >= 3 && lastThree.every(entry => 
                        entry.mood === 'happy' || entry.mood === 'calm'
                    );
                }
            },
            {
                id: 'consistency',
                name: 'Consistência',
                description: '14 dias seguidos registrados',
                condition: () => this.streak >= 14
            },
            {
                id: 'pet_master',
                name: 'Pet Zen Master',
                description: '30 dias de jornada zen',
                condition: () => this.moodHistory.length >= 30
            }
        ];

        achievementsToCheck.forEach(achievement => {
            const alreadyEarned = this.achievements.find(a => a.id === achievement.id);
            
            if (!alreadyEarned && achievement.condition()) {
                this.earnAchievement(achievement);
            }
        });
    }

    earnAchievement(achievement) {
        const newAchievement = {
            ...achievement,
            earned: true,
            date: new Date().toISOString()
        };
        
        this.achievements.push(newAchievement);
        
        // Mostrar notificação de conquista
        this.showAchievementNotification(achievement);
        
        // Salvar dados
        this.saveUserData();

        console.log(`🏆 Nova conquista: ${achievement.name}`);
    }

    showAchievementNotification(achievement) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <i class="fas fa-trophy"></i>
                <div>
                    <h4>Nova Conquista!</h4>
                    <p>${achievement.name}</p>
                </div>
            </div>
        `;

        // Adicionar estilos inline
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
            color: 'white',
            padding: '1rem',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            animation: 'slideInRight 0.5s ease',
            maxWidth: '280px'
        });

        document.body.appendChild(notification);

        // Adicionar vibração
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 100]);
        }

        // Remover após 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }

    updateAchievementsDisplay() {
        const achievementsGrid = document.querySelector('.achievements-grid');
        if (!achievementsGrid) return;

        // Limpar grid atual
        achievementsGrid.innerHTML = '';

        // Achievements template
        const allAchievements = [
            {
                id: 'first_week',
                name: 'Primeira Semana',
                description: '7 dias de dedicação!',
                icon: 'fas fa-star'
            },
            {
                id: 'happy_streak',
                name: 'Mamãe Zen',
                description: 'Pet mais calmo detectado',
                icon: 'fas fa-heart'
            },
            {
                id: 'pet_master',
                name: 'Pet Zen Master',
                description: '30 dias para desbloquear',
                icon: 'fas fa-trophy'
            }
        ];

        allAchievements.forEach(achievement => {
            const earned = this.achievements.find(a => a.id === achievement.id);
            const progress = this.calculateAchievementProgress(achievement.id);

            const achievementCard = document.createElement('div');
            achievementCard.className = `achievement-card ${earned ? 'earned' : ''}`;
            
            achievementCard.innerHTML = `
                <i class="${achievement.icon}"></i>
                <div>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
                ${!earned && progress ? `<div class="progress-badge">${progress}</div>` : ''}
            `;

            achievementsGrid.appendChild(achievementCard);
        });
    }

    calculateAchievementProgress(achievementId) {
        switch (achievementId) {
            case 'first_week':
                return this.moodHistory.length < 7 ? `${this.moodHistory.length}/7` : null;
            case 'pet_master':
                return this.moodHistory.length < 30 ? `${this.moodHistory.length}/30` : null;
            default:
                return null;
        }
    }

    // ===== ÁUDIO =====
    selectAudio(audioName) {
        // Remover seleção anterior
        document.querySelectorAll('.audio-card').forEach(card => {
            card.classList.remove('active');
        });

        // Selecionar novo áudio
        const audioCard = document.querySelector(`.audio-card[data-audio="${audioName}"]`);
        if (audioCard) {
            audioCard.classList.add('active');
        }

        // Atualizar informações do player
        this.updatePlayerInfo(audioName);

        console.log(`🎵 Áudio selecionado: ${audioName}`);
    }

    playAudio(audioName) {
        // Selecionar áudio
        this.selectAudio(audioName);
        
        // Ir para tela do player
        this.switchScreen('player');
        
        // Simular reprodução (em um app real, seria reproduzido o arquivo MP3)
        this.showMessage(`▶️ Tocando: ${this.getAudioTitle(audioName)}`, 'info');
        
        console.log(`▶️ Reproduzindo: ${audioName}`);
    }

    updatePlayerInfo(audioName) {
        const audioInfo = this.getAudioInfo(audioName);
        
        const titleElement = document.getElementById('current-audio-title');
        const descriptionElement = document.getElementById('current-audio-description');

        if (titleElement) titleElement.textContent = audioInfo.title;
        if (descriptionElement) descriptionElement.textContent = audioInfo.description;
    }

    getAudioInfo(audioName) {
        const audioData = {
            'chuva-suave': {
                title: 'Chuva Suave',
                description: 'Sons naturais de chuva para relaxamento profundo'
            },
            'ondas-mar': {
                title: 'Ondas do Mar',
                description: 'Tranquilidade infinita com sons do oceano'
            },
            'floresta-calma': {
                title: 'Floresta Calma',
                description: 'Paz da natureza com sons da mata'
            },
            'lareira': {
                title: 'Lareira Acolhedora',
                description: 'Conforto do lar com sons do fogo'
            },
            'piano-zen': {
                title: 'Piano Zen',
                description: 'Serenidade musical com piano suave'
            },
            'violao-suave': {
                title: 'Violão Suave',
                description: 'Melodia relaxante com dedilhado'
            }
        };

        return audioData[audioName] || { title: 'Áudio Relaxante', description: 'Som terapêutico para seu pet' };
    }

    getAudioTitle(audioName) {
        return this.getAudioInfo(audioName).title;
    }

    updateAudioLibrary() {
        // Atualizar estatísticas dos áudios baseado no uso
        console.log('🎼 Biblioteca de áudios atualizada');
    }

    // ===== CONFIGURAÇÕES =====
    populateSettings() {
        if (!this.currentPet) return;

        const petNameInput = document.getElementById('settings-pet-name');
        const petBreedSelect = document.getElementById('settings-pet-breed');

        if (petNameInput) petNameInput.value = this.currentPet.name;
        if (petBreedSelect) petBreedSelect.value = this.currentPet.breed;
    }

    handleSettingChange(settingId, value) {
        if (!this.currentUser.settings) {
            this.currentUser.settings = {};
        }

        switch (settingId) {
            case 'reminder-toggle':
                this.currentUser.settings.reminders = value;
                this.showMessage(value ? '🔔 Lembretes ativados' : '🔕 Lembretes desativados', 'info');
                break;
            case 'progress-toggle':
                this.currentUser.settings.notifications = value;
                this.showMessage(value ? '📊 Notificações de progresso ativadas' : '📊 Notificações de progresso desativadas', 'info');
                break;
        }

        this.saveUserData();
        console.log(`⚙️ Configuração alterada: ${settingId} = ${value}`);
    }

    // ===== GRÁFICOS =====
    updateProgressCharts() {
        const canvas = document.getElementById('mood-chart');
        if (!canvas || !window.Chart) return;

        // Preparar dados dos últimos 7 dias
        const labels = [];
        const data = [];
        const colors = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            labels.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }));
            
            const moodEntry = this.moodHistory.find(entry => 
                entry.date.split('T')[0] === dateString
            );

            if (moodEntry) {
                switch (moodEntry.mood) {
                    case 'happy': 
                        data.push(3);
                        colors.push('#4caf50');
                        break;
                    case 'calm':
                        data.push(2);
                        colors.push('#2196f3');
                        break;
                    case 'anxious':
                        data.push(1);
                        colors.push('#ff5722');
                        break;
                    default:
                        data.push(0);
                        colors.push('#e0e0e0');
                }
            } else {
                data.push(0);
                colors.push('#e0e0e0');
            }
        }

        // Destruir gráfico anterior se existir
        if (this.moodChart) {
            this.moodChart.destroy();
        }

        // Criar novo gráfico
        this.moodChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Humor do Pet',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 3,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                switch (value) {
                                    case 3: return '😊 Feliz';
                                    case 2: return '😌 Calmo';
                                    case 1: return '😰 Ansioso';
                                    default: return '';
                                }
                            }
                        }
                    }
                }
            }
        });

        console.log('📊 Gráfico de humor atualizado');
    }

    // ===== CHAT =====
    focusChatInput() {
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.focus();
            }
        }, 300);
    }

    // ===== NOTIFICAÇÕES =====
    showNotifications() {
        const notifications = [
            '🎵 Hora da sessão relaxante com o ' + (this.currentPet?.name || 'seu pet') + '!',
            '📊 Parabéns! 3 dias consecutivos de melhora no humor!',
            '💡 Dica: Dias chuvosos são ideais para áudio de lareira!'
        ];

        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        this.showMessage(randomNotification, 'info');
    }

    // ===== SERVICE WORKER =====
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('🔧 Service Worker registrado:', registration);
                })
                .catch(error => {
                    console.log('❌ Erro no Service Worker:', error);
                });
        }
    }

    // ===== UTILITÁRIOS =====
    showMessage(message, type = 'info') {
        // Criar elemento de mensagem
        const messageElement = document.createElement('div');
        messageElement.className = `message-toast ${type}`;
        messageElement.textContent = message;

        // Estilos
        Object.assign(messageElement.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '1rem 1.5rem',
            borderRadius: '25px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            maxWidth: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            animation: 'slideDown 0.3s ease'
        });

        // Cores por tipo
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };

        messageElement.style.background = colors[type] || colors.info;

        // Adicionar ao DOM
        document.body.appendChild(messageElement);

        // Remover após 3 segundos
        setTimeout(() => {
            messageElement.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 3000);

        console.log(`💬 Mensagem (${type}): ${message}`);
    }

    // Método para resetar dados (desenvolvimento)
    resetApp() {
        localStorage.clear();
        location.reload();
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Criar instância global do app
    window.pettyZen = new PettyZenApp();
});

// ===== CSS PARA ANIMAÇÕES DAS MENSAGENS =====
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .achievement-notification .achievement-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .achievement-notification i {
        font-size: 1.5rem;
    }

    .achievement-notification h4 {
        margin: 0;
        font-size: 0.9rem;
    }

    .achievement-notification p {
        margin: 0;
        font-size: 0.8rem;
        opacity: 0.9;
    }
`;

document.head.appendChild(messageStyles);

console.log('🚀 Petty Zen App carregado com sucesso!');