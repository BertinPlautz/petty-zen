	// ===== PETTY ZEN - JAVASCRIPT PRINCIPAL =====
     2	
     3	class PettyZenApp {
     4	    constructor() {
     5	        this.currentUser = null;
     6	        this.currentPet = null;
     7	        this.currentScreen = 'home';
     8	        this.achievements = [];
     9	        this.moodHistory = [];
    10	        this.streak = 0;
    11	        
    12	        this.init();
    13	    }
    14	
    15	    init() {
    16	        console.log('🐾 Petty Zen App iniciando...');
    17	        
    18	        // Verificar se já tem dados salvos
    19	        this.loadUserData();
    20	        
    21	        // Setup inicial
    22	        this.setupEventListeners();
    23	        this.setupServiceWorker();
    24	        
    25	        // Mostrar tela apropriada
    26	        this.showInitialScreen();
    27	        
    28	        // Inicializar depois de um pequeno delay
    29	        setTimeout(() => {
    30	            this.hideLoadingScreen();
    31	        }, 2000);
    32	
    33	        console.log('✅ App inicializado com sucesso!');
    34	    }
    35	
    36	    // ===== GERENCIAMENTO DE DADOS =====
    37	    loadUserData() {
    38	        try {
    39	            const userData = localStorage.getItem('pettyzen_user');
    40	            const petData = localStorage.getItem('pettyzen_pet');
    41	            const progressData = localStorage.getItem('pettyzen_progress');
    42	
    43	            if (userData && petData) {
    44	                this.currentUser = JSON.parse(userData);
    45	                this.currentPet = JSON.parse(petData);
    46	                
    47	                if (progressData) {
    48	                    const progress = JSON.parse(progressData);
    49	                    this.moodHistory = progress.moodHistory || [];
    50	                    this.achievements = progress.achievements || [];
    51	                    this.streak = progress.streak || 0;
    52	                }
    53	
    54	                console.log('📊 Dados do usuário carregados:', this.currentUser.name);
    55	                return true;
    56	            }
    57	        } catch (error) {
    58	            console.error('❌ Erro ao carregar dados:', error);
    59	        }
    60	        return false;
    61	    }
    62	
    63	    saveUserData() {
    64	        try {
    65	            localStorage.setItem('pettyzen_user', JSON.stringify(this.currentUser));
    66	            localStorage.setItem('pettyzen_pet', JSON.stringify(this.currentPet));
    67	            
    68	            const progressData = {
    69	                moodHistory: this.moodHistory,
    70	                achievements: this.achievements,
    71	                streak: this.streak,
    72	                lastUpdate: new Date().toISOString()
    73	            };
    74	            localStorage.setItem('pettyzen_progress', JSON.stringify(progressData));
    75	            
    76	            console.log('💾 Dados salvos com sucesso!');
    77	        } catch (error) {
    78	            console.error('❌ Erro ao salvar dados:', error);
    79	        }
    80	    }
    81	
    82	    // ===== GERENCIAMENTO DE TELAS =====
    83	    showInitialScreen() {
    84	        const hasUserData = this.loadUserData();
    85	        
    86	        if (hasUserData) {
    87	            // Usuário já cadastrado - ir direto para o app
    88	            this.showMainApp();
    89	        } else {
    90	            // Primeiro acesso - mostrar welcome
    91	            this.showWelcomeScreen();
    92	        }
    93	    }
    94	
    95	    hideLoadingScreen() {
    96	        const loadingScreen = document.getElementById('loading-screen');
    97	        if (loadingScreen) {
    98	            loadingScreen.classList.add('hidden');
    99	            setTimeout(() => {
   100	                loadingScreen.style.display = 'none';
   101	            }, 500);
   102	        }
   103	    }
   104	
   105	    showWelcomeScreen() {
   106	        const welcomeScreen = document.getElementById('welcome-screen');
   107	        const appContainer = document.getElementById('app-container');
   108	        
   109	        if (welcomeScreen && appContainer) {
   110	            welcomeScreen.classList.add('active');
   111	            appContainer.classList.remove('active');
   112	        }
   113	    }
   114	
   115	    showMainApp() {
   116	        const welcomeScreen = document.getElementById('welcome-screen');
   117	        const appContainer = document.getElementById('app-container');
   118	        
   119	        if (welcomeScreen && appContainer) {
   120	            welcomeScreen.classList.remove('active');
   121	            appContainer.classList.add('active');
   122	            
   123	            // Atualizar interface com dados do usuário
   124	            this.updateUserInterface();
   125	            this.updateProgressData();
   126	        }
   127	    }
   128	
   129	    switchScreen(screenName) {
   130	        // Remover active de todas as telas
   131	        document.querySelectorAll('.content-screen').forEach(screen => {
   132	            screen.classList.remove('active');
   133	        });
   134	
   135	        // Remover active de todos os botões de navegação
   136	        document.querySelectorAll('.nav-btn').forEach(btn => {
   137	            btn.classList.remove('active');
   138	        });
   139	
   140	        // Ativar tela selecionada
   141	        const targetScreen = document.getElementById(`${screenName}-screen`);
   142	        const targetBtn = document.querySelector(`.nav-btn[data-screen="${screenName}"]`);
   143	
   144	        if (targetScreen) {
   145	            targetScreen.classList.add('active');
   146	            this.currentScreen = screenName;
   147	        }
   148	
   149	        if (targetBtn) {
   150	            targetBtn.classList.add('active');
   151	        }
   152	
   153	        // Executar ações específicas da tela
   154	        this.handleScreenSwitch(screenName);
   155	
   156	        console.log(`📱 Tela alterada para: ${screenName}`);
   157	    }
   158	
   159	    handleScreenSwitch(screenName) {
   160	        switch (screenName) {
   161	            case 'progress':
   162	                this.updateProgressCharts();
   163	                break;
   164	            case 'chat':
   165	                this.focusChatInput();
   166	                break;
   167	            case 'player':
   168	                this.updateAudioLibrary();
   169	                break;
   170	            case 'settings':
   171	                this.populateSettings();
   172	                break;
   173	        }
   174	    }
   175	
   176	    // ===== CONFIGURAÇÃO DE EVENTOS =====
   177	    setupEventListeners() {
   178	        // Botão de iniciar app
   179	        const startBtn = document.getElementById('start-app');
   180	        if (startBtn) {
   181	            startBtn.addEventListener('click', () => this.handleUserRegistration());
   182	        }
   183	
   184	        // Botões de ansiedade
   185	        document.querySelectorAll('.anxiety-btn').forEach(btn => {
   186	            btn.addEventListener('click', (e) => {
   187	                document.querySelectorAll('.anxiety-btn').forEach(b => b.classList.remove('selected'));
   188	                e.target.classList.add('selected');
   189	            });
   190	        });
   191	
   192	        // Navegação inferior
   193	        document.querySelectorAll('.nav-btn').forEach(btn => {
   194	            btn.addEventListener('click', (e) => {
   195	                const screen = e.currentTarget.dataset.screen;
   196	                this.switchScreen(screen);
   197	            });
   198	        });
   199	
   200	        // Ações rápidas
   201	        document.querySelectorAll('.action-btn').forEach(btn => {
   202	            btn.addEventListener('click', (e) => {
   203	                const action = e.currentTarget.dataset.action;
   204	                this.handleQuickAction(action);
   205	            });
   206	        });
   207	
   208	        // Play button da recomendação diária
   209	        const playBtn = document.querySelector('.play-btn');
   210	        if (playBtn) {
   211	            playBtn.addEventListener('click', (e) => {
   212	                const audio = e.currentTarget.dataset.audio;
   213	                this.playAudio(audio);
   214	            });
   215	        }
   216	
   217	        // Cards de áudio
   218	        document.querySelectorAll('.audio-card').forEach(card => {
   219	            card.addEventListener('click', (e) => {
   220	                const audioName = e.currentTarget.dataset.audio;
   221	                this.selectAudio(audioName);
   222	            });
   223	        });
   224	
   225	        // Botões de humor
   226	        document.querySelectorAll('.mood-btn').forEach(btn => {
   227	            btn.addEventListener('click', (e) => {
   228	                this.recordMood(e.currentTarget.dataset.mood);
   229	            });
   230	        });
   231	
   232	        // Configurações - toggle switches
   233	        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
   234	            toggle.addEventListener('change', (e) => {
   235	                this.handleSettingChange(e.target.id, e.target.checked);
   236	            });
   237	        });
   238	
   239	        // Notificações
   240	        const notificationBtn = document.querySelector('.notification-btn');
   241	        if (notificationBtn) {
   242	            notificationBtn.addEventListener('click', () => this.showNotifications());
   243	        }
   244	
   245	        // Configurações rápidas
   246	        const settingsBtn = document.querySelector('.settings-btn');
   247	        if (settingsBtn) {
   248	            settingsBtn.addEventListener('click', () => this.switchScreen('settings'));
   249	        }
   250	
   251	        console.log('🔗 Event listeners configurados');
   252	    }
   253	
   254	    // ===== REGISTRO DO USUÁRIO =====
   255	    handleUserRegistration() {
   256	        const ownerName = document.getElementById('owner-name').value.trim();
   257	        const petName = document.getElementById('pet-name').value.trim();
   258	        const petBreed = document.getElementById('pet-breed').value;
   259	        const petAge = document.getElementById('pet-age').value;
   260	        const anxietyLevel = document.querySelector('.anxiety-btn.selected')?.dataset.level;
   261	
   262	        // Validação
   263	        if (!ownerName || !petName || !petBreed || !petAge || !anxietyLevel) {
   264	            this.showMessage('Por favor, preencha todos os campos! 🐾', 'error');
   265	            return;
   266	        }
   267	
   268	        // Salvar dados
   269	        this.currentUser = {
   270	            name: ownerName,
   271	            registrationDate: new Date().toISOString(),
   272	            settings: {
   273	                notifications: true,
   274	                reminders: true
   275	            }
   276	        };
   277	
   278	        this.currentPet = {
   279	            name: petName,
   280	            breed: petBreed,
   281	            age: petAge,
   282	            anxietyLevel: anxietyLevel,
   283	            avatar: this.generatePetAvatar(petBreed)
   284	        };
   285	
   286	        // Inicializar progresso
   287	        this.initializeProgress();
   288	
   289	        // Salvar e ir para o app
   290	        this.saveUserData();
   291	        this.showMessage(`Bem-vindas, ${ownerName} e ${petName}! 💕`, 'success');
   292	        
   293	        setTimeout(() => {
   294	            this.showMainApp();
   295	        }, 1500);
   296	
   297	        console.log('👤 Usuário registrado:', this.currentUser);
   298	    }
   299	
   300	    generatePetAvatar(breed) {
   301	        // Gerar emoji baseado na raça
   302	        const breedEmojis = {
   303	            'labrador': '🦮',
   304	            'golden': '🐕',
   305	            'bulldog': '🐶',
   306	            'poodle': '🐩',
   307	            'husky': '🐺',
   308	            'srd': '🐕‍🦺'
   309	        };
   310	        return breedEmojis[breed] || '🐕';
   311	    }
   312	
   313	    initializeProgress() {
   314	        this.moodHistory = [];
   315	        this.achievements = [
   316	            {
   317	                id: 'first_day',
   318	                name: 'Primeiro Dia',
   319	                description: 'Começou a jornada zen!',
   320	                earned: true,
   321	                date: new Date().toISOString()
   322	            }
   323	        ];
   324	        this.streak = 1;
   325	
   326	        // Adicionar entrada de humor inicial
   327	        this.recordMood('calm');
   328	    }
   329	
   330	    // ===== INTERFACE DO USUÁRIO =====
   331	    updateUserInterface() {
   332	        if (!this.currentUser || !this.currentPet) return;
   333	
   334	        // Atualizar nomes
   335	        const userNameDisplay = document.getElementById('user-name-display');
   336	        const petNameDisplay = document.getElementById('pet-name-display');
   337	        const petProgressName = document.getElementById('pet-progress-name');
   338	
   339	        if (userNameDisplay) userNameDisplay.textContent = this.currentUser.name;
   340	        if (petNameDisplay) petNameDisplay.textContent = this.currentPet.name;
   341	        if (petProgressName) petProgressName.textContent = this.currentPet.name;
   342	
   343	        // Atualizar avatar do pet
   344	        const petAvatar = document.querySelector('.pet-avatar i');
   345	        if (petAvatar) {
   346	            petAvatar.textContent = this.currentPet.avatar || '🐕';
   347	        }
   348	
   349	        // Atualizar saudação contextual
   350	        this.updateGreeting();
   351	
   352	        console.log('🎨 Interface atualizada');
   353	    }
   354	
   355	    updateGreeting() {
   356	        const hour = new Date().getHours();
   357	        let greeting = 'Oi';
   358	
   359	        if (hour < 12) greeting = 'Bom dia';
   360	        else if (hour < 18) greeting = 'Boa tarde';
   361	        else greeting = 'Boa noite';
   362	
   363	        const greetingText = document.querySelector('.greeting-text');
   364	        if (greetingText && this.currentUser) {
   365	            greetingText.innerHTML = `${greeting}, <span id="user-name-display">${this.currentUser.name}</span>!`;
   366	        }
   367	    }
   368	
   369	    updateProgressData() {
   370	        // Atualizar contador de sequência
   371	        const streakCounter = document.querySelector('.streak-counter span');
   372	        if (streakCounter) {
   373	            streakCounter.textContent = `${this.streak} dias consecutivos!`;
   374	        }
   375	
   376	        // Atualizar progresso da semana
   377	        this.updateWeekProgress();
   378	
   379	        // Atualizar conquistas
   380	        this.updateAchievementsDisplay();
   381	    }
   382	
   383	    updateWeekProgress() {
   384	        const progressItems = document.querySelectorAll('.progress-item');
   385	        const today = new Date().getDay(); // 0 = domingo, 6 = sábado
   386	
   387	        progressItems.forEach((item, index) => {
   388	            const moodIndicator = item.querySelector('.mood-indicator');
   389	            
   390	            // Limpar classes
   391	            item.classList.remove('active', 'completed');
   392	            moodIndicator.classList.remove('happy', 'calm', 'anxious');
   393	
   394	            if (index === today) {
   395	                item.classList.add('active');
   396	            } else if (index < today) {
   397	                item.classList.add('completed');
   398	                
   399	                // Adicionar humor aleatório para dias passados (demo)
   400	                const moods = ['happy', 'calm', 'calm'];
   401	                const randomMood = moods[Math.floor(Math.random() * moods.length)];
   402	                moodIndicator.classList.add(randomMood);
   403	            }
   404	        });
   405	    }
   406	
   407	    // ===== AÇÕES RÁPIDAS =====
   408	    handleQuickAction(action) {
   409	        switch (action) {
   410	            case 'emergency':
   411	                this.handleEmergency();
   412	                break;
   413	            case 'mood-check':
   414	                this.openMoodCheck();
   415	                break;
   416	            case 'timer':
   417	                this.openWorkTimer();
   418	                break;
   419	            case 'chat':
   420	                this.switchScreen('chat');
   421	                break;
   422	        }
   423	
   424	        console.log(`⚡ Ação rápida: ${action}`);
   425	    }
   426	
   427	    handleEmergency() {
   428	        // SOS Ansiedade - tocar áudio calmante imediatamente
   429	        this.showMessage('🚨 Modo SOS ativado! Tocando áudio calmante...', 'warning');
   430	        this.playAudio('chuva-suave');
   431	        this.switchScreen('player');
   432	        
   433	        // Adicionar vibração se disponível
   434	        if (navigator.vibrate) {
   435	            navigator.vibrate([200, 100, 200]);
   436	        }
   437	    }
   438	
   439	    openMoodCheck() {
   440	        this.showMessage('📸 Tire uma foto do seu cãozinho e registre o humor dele hoje!', 'info');
   441	        this.switchScreen('progress');
   442	        
   443	        // Simular abertura da câmera (em app real seria navigator.mediaDevices.getUserMedia)
   444	        setTimeout(() => {
   445	            this.recordMood('calm');
   446	            this.showMessage('✅ Humor registrado com sucesso!', 'success');
   447	        }, 2000);
   448	    }
   449	
   450	    openWorkTimer() {
   451	        this.showMessage('⏰ Timer de trabalho configurado! Seu cãozinho ficará calmo enquanto você trabalha.', 'info');
   452	        this.switchScreen('player');
   453	        
   454	        // Ativar timer de 2 horas automaticamente
   455	        const timerBtn = document.querySelector('.timer-btn[data-minutes="120"]');
   456	        if (timerBtn) {
   457	            timerBtn.click();
   458	        }
   459	    }
   460	
   461	    // ===== SISTEMA DE HUMOR =====
   462	    recordMood(mood) {
   463	        const today = new Date().toISOString().split('T')[0];
   464	        
   465	        // Remover entrada do mesmo dia se existir
   466	        this.moodHistory = this.moodHistory.filter(entry => 
   467	            entry.date.split('T')[0] !== today
   468	        );
   469	
   470	        // Adicionar nova entrada
   471	        this.moodHistory.push({
   472	            date: new Date().toISOString(),
   473	            mood: mood,
   474	            petName: this.currentPet.name
   475	        });
   476	
   477	        // Manter apenas os últimos 30 dias
   478	        if (this.moodHistory.length > 30) {
   479	            this.moodHistory = this.moodHistory.slice(-30);
   480	        }
   481	
   482	        // Verificar conquistas
   483	        this.checkAchievements();
   484	
   485	        // Salvar dados
   486	        this.saveUserData();
   487	
   488	        console.log(`😊 Humor registrado: ${mood}`);
   489	    }
   490	
   491	    // ===== SISTEMA DE CONQUISTAS =====
   492	    checkAchievements() {
   493	        const achievementsToCheck = [
   494	            {
   495	                id: 'first_week',
   496	                name: 'Primeira Semana',
   497	                description: '7 dias de dedicação!',
   498	                condition: () => this.moodHistory.length >= 7
   499	            },
   500	            {
   501	                id: 'happy_streak',
   502	                name: 'Mamãe Zen',
   503	                description: 'Pet mais calmo detectado',
   504	                condition: () => {
   505	                    const lastThree = this.moodHistory.slice(-3);
   506	                    return lastThree.length >= 3 && lastThree.every(entry => 
   507	                        entry.mood === 'happy' || entry.mood === 'calm'
   508	                    );
   509	                }
   510	            },
   511	            {
   512	                id: 'consistency',
   513	                name: 'Consistência',
   514	                description: '14 dias seguidos registrados',
   515	                condition: () => this.streak >= 14
   516	            },
   517	            {
   518	                id: 'pet_master',
   519	                name: 'Pet Zen Master',
   520	                description: '30 dias de jornada zen',
   521	                condition: () => this.moodHistory.length >= 30
   522	            }
   523	        ];
   524	
   525	        achievementsToCheck.forEach(achievement => {
   526	            const alreadyEarned = this.achievements.find(a => a.id === achievement.id);
   527	            
   528	            if (!alreadyEarned && achievement.condition()) {
   529	                this.earnAchievement(achievement);
   530	            }
   531	        });
   532	    }
   533	
   534	    earnAchievement(achievement) {
   535	        const newAchievement = {
   536	            ...achievement,
   537	            earned: true,
   538	            date: new Date().toISOString()
   539	        };
   540	        
   541	        this.achievements.push(newAchievement);
   542	        
   543	        // Mostrar notificação de conquista
   544	        this.showAchievementNotification(achievement);
   545	        
   546	        // Salvar dados
   547	        this.saveUserData();
   548	
   549	        console.log(`🏆 Nova conquista: ${achievement.name}`);
   550	    }
   551	
   552	    showAchievementNotification(achievement) {
   553	        // Criar elemento de notificação
   554	        const notification = document.createElement('div');
   555	        notification.className = 'achievement-notification';
   556	        notification.innerHTML = `
   557	            <div class="achievement-content">
   558	                <i class="fas fa-trophy"></i>
   559	                <div>
   560	                    <h4>Nova Conquista!</h4>
   561	                    <p>${achievement.name}</p>
   562	                </div>
   563	            </div>
   564	        `;
   565	
   566	        // Adicionar estilos inline
   567	        Object.assign(notification.style, {
   568	            position: 'fixed',
   569	            top: '100px',
   570	            right: '20px',
   571	            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
   572	            color: 'white',
   573	            padding: '1rem',
   574	            borderRadius: '16px',
   575	            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
   576	            zIndex: '9999',
   577	            animation: 'slideInRight 0.5s ease',
   578	            maxWidth: '280px'
   579	        });
   580	
   581	        document.body.appendChild(notification);
   582	
   583	        // Adicionar vibração
   584	        if (navigator.vibrate) {
   585	            navigator.vibrate([100, 50, 100, 50, 100]);
   586	        }
   587	
   588	        // Remover após 4 segundos
   589	        setTimeout(() => {
   590	            notification.style.animation = 'slideOutRight 0.5s ease';
   591	            setTimeout(() => {
   592	                if (notification.parentNode) {
   593	                    notification.parentNode.removeChild(notification);
   594	                }
   595	            }, 500);
   596	        }, 4000);
   597	    }
   598	
   599	    updateAchievementsDisplay() {
   600	        const achievementsGrid = document.querySelector('.achievements-grid');
   601	        if (!achievementsGrid) return;
   602	
   603	        // Limpar grid atual
   604	        achievementsGrid.innerHTML = '';
   605	
   606	        // Achievements template
   607	        const allAchievements = [
   608	            {
   609	                id: 'first_week',
   610	                name: 'Primeira Semana',
   611	                description: '7 dias de dedicação!',
   612	                icon: 'fas fa-star'
   613	            },
   614	            {
   615	                id: 'happy_streak',
   616	                name: 'Mamãe Zen',
   617	                description: 'Pet mais calmo detectado',
   618	                icon: 'fas fa-heart'
   619	            },
   620	            {
   621	                id: 'pet_master',
   622	                name: 'Pet Zen Master',
   623	                description: '30 dias para desbloquear',
   624	                icon: 'fas fa-trophy'
   625	            }
   626	        ];
   627	
   628	        allAchievements.forEach(achievement => {
   629	            const earned = this.achievements.find(a => a.id === achievement.id);
   630	            const progress = this.calculateAchievementProgress(achievement.id);
   631	
   632	            const achievementCard = document.createElement('div');
   633	            achievementCard.className = `achievement-card ${earned ? 'earned' : ''}`;
   634	            
   635	            achievementCard.innerHTML = `
   636	                <i class="${achievement.icon}"></i>
   637	                <div>
   638	                    <h4>${achievement.name}</h4>
   639	                    <p>${achievement.description}</p>
   640	                </div>
   641	                ${!earned && progress ? `<div class="progress-badge">${progress}</div>` : ''}
   642	            `;
   643	
   644	            achievementsGrid.appendChild(achievementCard);
   645	        });
   646	    }
   647	
   648	    calculateAchievementProgress(achievementId) {
   649	        switch (achievementId) {
   650	            case 'first_week':
   651	                return this.moodHistory.length < 7 ? `${this.moodHistory.length}/7` : null;
   652	            case 'pet_master':
   653	                return this.moodHistory.length < 30 ? `${this.moodHistory.length}/30` : null;
   654	            default:
   655	                return null;
   656	        }
   657	    }
   658	
   659	    // ===== ÁUDIO =====
   660	    selectAudio(audioName) {
   661	        // Remover seleção anterior
   662	        document.querySelectorAll('.audio-card').forEach(card => {
   663	            card.classList.remove('active');
   664	        });
   665	
   666	        // Selecionar novo áudio
   667	        const audioCard = document.querySelector(`.audio-card[data-audio="${audioName}"]`);
   668	        if (audioCard) {
   669	            audioCard.classList.add('active');
   670	        }
   671	
   672	        // Atualizar informações do player
   673	        this.updatePlayerInfo(audioName);
   674	
   675	        console.log(`🎵 Áudio selecionado: ${audioName}`);
   676	    }
   677	
   678	    playAudio(audioName) {
   679	        // Selecionar áudio
   680	        this.selectAudio(audioName);
   681	        
   682	        // Ir para tela do player
   683	        this.switchScreen('player');
   684	        
   685	        // Reproduzir arquivo MP3 real
   686	        const audioUrl = `assets/audio/${audioName}.mp3`;
   687	        const audioElement = document.getElementById('audio-player');
   688	        
   689	        if (audioElement) {
   690	            audioElement.src = audioUrl;
   691	            audioElement.load();
   692	            
   693	            // Tentar reproduzir
   694	            audioElement.play().then(() => {
   695	                this.showMessage(`▶️ Tocando: ${this.getAudioTitle(audioName)}`, 'success');
   696	                console.log(`▶️ Reproduzindo: ${audioName} (${audioUrl})`);
   697	            }).catch((error) => {
   698	                console.error('Erro ao reproduzir áudio:', error);
   699	                this.showMessage(`❌ Erro ao carregar: ${this.getAudioTitle(audioName)}`, 'error');
   700	                this.showMessage('💡 Verifique se o arquivo exists em assets/audio/', 'info');
   701	            });
   702	        } else {
   703	            console.error('Elemento audio-player não encontrado');
   704	            this.showMessage('❌ Player não encontrado', 'error');
   705	        }
   706	    }
   707	
   708	    updatePlayerInfo(audioName) {
   709	        const audioInfo = this.getAudioInfo(audioName);
   710	        
   711	        const titleElement = document.getElementById('current-audio-title');
   712	        const descriptionElement = document.getElementById('current-audio-description');
   713	
   714	        if (titleElement) titleElement.textContent = audioInfo.title;
   715	        if (descriptionElement) descriptionElement.textContent = audioInfo.description;
   716	    }
   717	
   718	    getAudioInfo(audioName) {
   719	        const audioData = {
   720	            'chuva-suave': {
   721	                title: 'Chuva Suave',
   722	                description: 'Sons naturais de chuva para relaxamento profundo'
   723	            },
   724	            'ondas-mar': {
   725	                title: 'Ondas do Mar',
   726	                description: 'Tranquilidade infinita com sons do oceano'
   727	            },
   728	            'floresta-calma': {
   729	                title: 'Floresta Calma',
   730	                description: 'Paz da natureza com sons da mata'
   731	            },
   732	            'lareira': {
   733	                title: 'Lareira Acolhedora',
   734	                description: 'Conforto do lar com sons do fogo'
   735	            },
   736	            'piano-zen': {
   737	                title: 'Piano Zen',
   738	                description: 'Serenidade musical com piano suave'
   739	            },
   740	            'violao-suave': {
   741	                title: 'Violão Suave',
   742	                description: 'Melodia relaxante com dedilhado'
   743	            }
   744	        };
   745	
   746	        return audioData[audioName] || { title: 'Áudio Relaxante', description: 'Som terapêutico para seu pet' };
   747	    }
   748	
   749	    getAudioTitle(audioName) {
   750	        return this.getAudioInfo(audioName).title;
   751	    }
   752	
   753	    updateAudioLibrary() {
   754	        // Atualizar estatísticas dos áudios baseado no uso
   755	        console.log('🎼 Biblioteca de áudios atualizada');
   756	    }
   757	
   758	    // ===== CONFIGURAÇÕES =====
   759	    populateSettings() {
   760	        if (!this.currentPet) return;
   761	
   762	        const petNameInput = document.getElementById('settings-pet-name');
   763	        const petBreedSelect = document.getElementById('settings-pet-breed');
   764	
   765	        if (petNameInput) petNameInput.value = this.currentPet.name;
   766	        if (petBreedSelect) petBreedSelect.value = this.currentPet.breed;
   767	    }
   768	
   769	    handleSettingChange(settingId, value) {
   770	        if (!this.currentUser.settings) {
   771	            this.currentUser.settings = {};
   772	        }
   773	
   774	        switch (settingId) {
   775	            case 'reminder-toggle':
   776	                this.currentUser.settings.reminders = value;
   777	                this.showMessage(value ? '🔔 Lembretes ativados' : '🔕 Lembretes desativados', 'info');
   778	                break;
   779	            case 'progress-toggle':
   780	                this.currentUser.settings.notifications = value;
   781	                this.showMessage(value ? '📊 Notificações de progresso ativadas' : '📊 Notificações de progresso desativadas', 'info');
   782	                break;
   783	        }
   784	
   785	        this.saveUserData();
   786	        console.log(`⚙️ Configuração alterada: ${settingId} = ${value}`);
   787	    }
   788	
   789	    // ===== GRÁFICOS =====
   790	    updateProgressCharts() {
   791	        const canvas = document.getElementById('mood-chart');
   792	        if (!canvas || !window.Chart) return;
   793	
   794	        // Preparar dados dos últimos 7 dias
   795	        const labels = [];
   796	        const data = [];
   797	        const colors = [];
   798	
   799	        for (let i = 6; i >= 0; i--) {
   800	            const date = new Date();
   801	            date.setDate(date.getDate() - i);
   802	            const dateString = date.toISOString().split('T')[0];
   803	            
   804	            labels.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }));
   805	            
   806	            const moodEntry = this.moodHistory.find(entry => 
   807	                entry.date.split('T')[0] === dateString
   808	            );
   809	
   810	            if (moodEntry) {
   811	                switch (moodEntry.mood) {
   812	                    case 'happy': 
   813	                        data.push(3);
   814	                        colors.push('#4caf50');
   815	                        break;
   816	                    case 'calm':
   817	                        data.push(2);
   818	                        colors.push('#2196f3');
   819	                        break;
   820	                    case 'anxious':
   821	                        data.push(1);
   822	                        colors.push('#ff5722');
   823	                        break;
   824	                    default:
   825	                        data.push(0);
   826	                        colors.push('#e0e0e0');
   827	                }
   828	            } else {
   829	                data.push(0);
   830	                colors.push('#e0e0e0');
   831	            }
   832	        }
   833	
   834	        // Destruir gráfico anterior se existir
   835	        if (this.moodChart) {
   836	            this.moodChart.destroy();
   837	        }
   838	
   839	        // Criar novo gráfico
   840	        this.moodChart = new Chart(canvas, {
   841	            type: 'bar',
   842	            data: {
   843	                labels: labels,
   844	                datasets: [{
   845	                    label: 'Humor do Pet',
   846	                    data: data,
   847	                    backgroundColor: colors,
   848	                    borderColor: colors,
   849	                    borderWidth: 1,
   850	                    borderRadius: 8
   851	                }]
   852	            },
   853	            options: {
   854	                responsive: true,
   855	                maintainAspectRatio: false,
   856	                plugins: {
   857	                    legend: {
   858	                        display: false
   859	                    }
   860	                },
   861	                scales: {
   862	                    y: {
   863	                        beginAtZero: true,
   864	                        max: 3,
   865	                        ticks: {
   866	                            stepSize: 1,
   867	                            callback: function(value) {
   868	                                switch (value) {
   869	                                    case 3: return '😊 Feliz';
   870	                                    case 2: return '😌 Calmo';
   871	                                    case 1: return '😰 Ansioso';
   872	                                    default: return '';
   873	                                }
   874	                            }
   875	                        }
   876	                    }
   877	                }
   878	            }
   879	        });
   880	
   881	        console.log('📊 Gráfico de humor atualizado');
   882	    }
   883	
   884	    // ===== CHAT =====
   885	    focusChatInput() {
   886	        setTimeout(() => {
   887	            const chatInput = document.getElementById('chat-input');
   888	            if (chatInput) {
   889	                chatInput.focus();
   890	            }
   891	        }, 300);
   892	    }
   893	
   894	    // ===== NOTIFICAÇÕES =====
   895	    showNotifications() {
   896	        const notifications = [
   897	            '🎵 Hora da sessão relaxante com o ' + (this.currentPet?.name || 'seu pet') + '!',
   898	            '📊 Parabéns! 3 dias consecutivos de melhora no humor!',
   899	            '💡 Dica: Dias chuvosos são ideais para áudio de lareira!'
   900	        ];
   901	
   902	        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
   903	        this.showMessage(randomNotification, 'info');
   904	    }
   905	
   906	    // ===== SERVICE WORKER =====
   907	    setupServiceWorker() {
   908	        if ('serviceWorker' in navigator) {
   909	            navigator.serviceWorker.register('/sw.js')
   910	                .then(registration => {
   911	                    console.log('🔧 Service Worker registrado:', registration);
   912	                })
   913	                .catch(error => {
   914	                    console.log('❌ Erro no Service Worker:', error);
   915	                });
   916	        }
   917	    }
   918	
   919	    // ===== UTILITÁRIOS =====
   920	    showMessage(message, type = 'info') {
   921	        // Criar elemento de mensagem
   922	        const messageElement = document.createElement('div');
   923	        messageElement.className = `message-toast ${type}`;
   924	        messageElement.textContent = message;
   925	
   926	        // Estilos
   927	        Object.assign(messageElement.style, {
   928	            position: 'fixed',
   929	            top: '20px',
   930	            left: '50%',
   931	            transform: 'translateX(-50%)',
   932	            padding: '1rem 1.5rem',
   933	            borderRadius: '25px',
   934	            color: 'white',
   935	            fontWeight: '500',
   936	            zIndex: '10000',
   937	            maxWidth: '90%',
   938	            textAlign: 'center',
   939	            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
   940	            animation: 'slideDown 0.3s ease'
   941	        });
   942	
   943	        // Cores por tipo
   944	        const colors = {
   945	            success: '#4caf50',
   946	            error: '#f44336',
   947	            warning: '#ff9800',
   948	            info: '#2196f3'
   949	        };
   950	
   951	        messageElement.style.background = colors[type] || colors.info;
   952	
   953	        // Adicionar ao DOM
   954	        document.body.appendChild(messageElement);
   955	
   956	        // Remover após 3 segundos
   957	        setTimeout(() => {
   958	            messageElement.style.animation = 'slideUp 0.3s ease';
   959	            setTimeout(() => {
   960	                if (messageElement.parentNode) {
   961	                    messageElement.parentNode.removeChild(messageElement);
   962	                }
   963	            }, 300);
   964	        }, 3000);
   965	
   966	        console.log(`💬 Mensagem (${type}): ${message}`);
   967	    }
   968	
   969	    // Método para resetar dados (desenvolvimento)
   970	    resetApp() {
   971	        localStorage.clear();
   972	        location.reload();
   973	    }
   974	}
   975	
   976	// ===== INICIALIZAÇÃO =====
   977	document.addEventListener('DOMContentLoaded', () => {
   978	    // Criar instância global do app
   979	    window.pettyZen = new PettyZenApp();
   980	});
   981	
   982	// ===== CSS PARA ANIMAÇÕES DAS MENSAGENS =====
   983	const messageStyles = document.createElement('style');
   984	messageStyles.textContent = `
   985	    @keyframes slideDown {
   986	        from {
   987	            transform: translateX(-50%) translateY(-100%);
   988	            opacity: 0;
   989	        }
   990	        to {
   991	            transform: translateX(-50%) translateY(0);
   992	            opacity: 1;
   993	        }
   994	    }
   995	
   996	    @keyframes slideUp {
   997	        from {
   998	            transform: translateX(-50%) translateY(0);
   999	            opacity: 1;
  1000	        }
  1001	        to {
  1002	            transform: translateX(-50%) translateY(-100%);
  1003	            opacity: 0;
  1004	        }
  1005	    }
  1006	
  1007	    @keyframes slideInRight {
  1008	        from {
  1009	            transform: translateX(100%);
  1010	            opacity: 0;
  1011	        }
  1012	        to {
  1013	            transform: translateX(0);
  1014	            opacity: 1;
  1015	        }
  1016	    }
  1017	
  1018	    @keyframes slideOutRight {
  1019	        from {
  1020	            transform: translateX(0);
  1021	            opacity: 1;
  1022	        }
  1023	        to {
  1024	            transform: translateX(100%);
  1025	            opacity: 0;
  1026	        }
  1027	    }
  1028	
  1029	    .achievement-notification .achievement-content {
  1030	        display: flex;
  1031	        align-items: center;
  1032	        gap: 0.75rem;
  1033	    }
  1034	
  1035	    .achievement-notification i {
  1036	        font-size: 1.5rem;
  1037	    }
  1038	
  1039	    .achievement-notification h4 {
  1040	        margin: 0;
  1041	        font-size: 0.9rem;
  1042	    }
  1043	
  1044	    .achievement-notification p {
  1045	        margin: 0;
  1046	        font-size: 0.8rem;
  1047	        opacity: 0.9;
  1048	    }
  1049	`;
  1050	
  1051	document.head.appendChild(messageStyles);
  1052	
  1053	console.log('🚀 Petty Zen App carregado com sucesso!');
