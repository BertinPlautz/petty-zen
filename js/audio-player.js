     1	// ===== PETTY ZEN - AUDIO PLAYER =====
     2	
     3	class AudioPlayer {
     4	    constructor() {
     5	        this.audioElement = document.getElementById('audio-player');
     6	        this.currentTrack = null;
     7	        this.isPlaying = false;
     8	        this.currentTime = 0;
     9	        this.duration = 300; // 5 minutos padrão
    10	        this.volume = 0.5;
    11	        this.timer = null;
    12	        this.timerDuration = 0;
    13	        this.timerRemaining = 0;
    14	        this.playlist = [];
    15	        this.currentTrackIndex = 0;
    16	        
    17	        this.audioLibrary = {
    18	            'rain': {
    19	                title: 'Chuva Suave',
    20	                description: 'Sons naturais de chuva para relaxamento profundo',
    21	                duration: 300,
    22	                frequency: '50Hz',
    23	                rating: 4.9,
    24	                url: 'assets/audio/rain.mp3',
    25	                icon: '🌧️',
    26	                category: 'natureza'
    27	            },
    28	            'ocean': {
    29	                title: 'Ondas do Mar',
    30	                description: 'Tranquilidade infinita com sons do oceano',
    31	                duration: 300,
    32	                frequency: '45Hz',
    33	                rating: 4.8,
    34	                url: 'assets/audio/ocean.mp3',
    35	                icon: '🌊',
    36	                category: 'natureza'
    37	            },
    38	            'forest': {
    39	                title: 'Floresta Calma',
    40	                description: 'Paz da natureza com sons da mata',
    41	                duration: 300,
    42	                frequency: '55Hz',
    43	                rating: 4.7,
    44	                url: 'assets/audio/forest.mp3',
    45	                icon: '🌲',
    46	                category: 'natureza'
    47	            },
    48	            'spa': {
    49	                title: 'Spa Relaxante',
    50	                description: 'Ambiente de spa para relaxamento total',
    51	                duration: 300,
    52	                frequency: '48Hz',
    53	                rating: 4.9,
    54	                url: 'assets/audio/spa.mp3',
    55	                icon: '🧘',
    56	                category: 'wellness'
    57	            },
    58	            'meditation': {
    59	                title: 'Flauta Tibetana',
    60	                description: 'Sons meditativos da flauta tibetana',
    61	                duration: 300,
    62	                frequency: '52Hz',
    63	                rating: 4.8,
    64	                url: 'assets/audio/meditation.mp3',
    65	                icon: '🪕',
    66	                category: 'meditacao'
    67	            }
    68	        };
    69	
    70	        this.init();
    71	    }
    72	
    73	    startTimeTracking() {
    74	        // Monitorar progresso real do áudio
    75	        if (this.audioElement) {
    76	            this.audioElement.ontimeupdate = () => {
    77	                if (this.isPlaying) {
    78	                    this.currentTime = this.audioElement.currentTime;
    79	                    this.updateProgressBar();
    80	                    this.updateTimeDisplay();
    81	                }
    82	            };
    83	            
    84	            this.audioElement.onended = () => {
    85	                this.isPlaying = false;
    86	                this.updatePlayButton();
    87	                this.stopVisualAnimation();
    88	                console.log('🎵 Áudio terminou');
    89	            };
    90	        }
    91	    }
    92	
    93	    init() {
    94	        console.log('🎵 Audio Player inicializando...');
    95	        
    96	        this.setupEventListeners();
    97	        this.setupAudioElement();
    98	        this.updatePlayerUI();
    99	        
   100	        console.log('✅ Audio Player inicializado');
   101	    }
   102	
   103	    setupEventListeners() {
   104	        // Controles do player
   105	        const playPauseBtn = document.getElementById('play-pause-btn');
   106	        const prevBtn = document.getElementById('prev-btn');
   107	        const nextBtn = document.getElementById('next-btn');
   108	        const volumeSlider = document.querySelector('.volume-slider');
   109	        const progressBar = document.querySelector('.progress-bar');
   110	
   111	        if (playPauseBtn) {
   112	            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
   113	        }
   114	
   115	        if (prevBtn) {
   116	            prevBtn.addEventListener('click', () => this.previousTrack());
   117	        }
   118	
   119	        if (nextBtn) {
   120	            nextBtn.addEventListener('click', () => this.nextTrack());
   121	        }
   122	
   123	        if (volumeSlider) {
   124	            volumeSlider.addEventListener('input', (e) => {
   125	                this.setVolume(e.target.value / 100);
   126	            });
   127	        }
   128	
   129	        if (progressBar) {
   130	            progressBar.addEventListener('click', (e) => {
   131	                this.seekTo(e);
   132	            });
   133	        }
   134	
   135	        // Timer buttons
   136	        document.querySelectorAll('.timer-btn').forEach(btn => {
   137	            btn.addEventListener('click', (e) => {
   138	                const minutes = parseInt(e.target.dataset.minutes);
   139	                this.setTimer(minutes);
   140	            });
   141	        });
   142	
   143	        // Audio cards
   144	        document.querySelectorAll('.audio-card').forEach(card => {
   145	            card.addEventListener('click', (e) => {
   146	                const audioId = e.currentTarget.dataset.audio;
   147	                this.loadTrack(audioId);
   148	            });
   149	        });
   150	
   151	        // Play buttons em outras telas
   152	        document.querySelectorAll('.play-btn').forEach(btn => {
   153	            btn.addEventListener('click', (e) => {
   154	                const audioId = e.currentTarget.dataset.audio;
   155	                this.playTrack(audioId);
   156	            });
   157	        });
   158	
   159	        console.log('🔗 Audio Player event listeners configurados');
   160	    }
   161	
   162	    setupAudioElement() {
   163	        if (!this.audioElement) {
   164	            console.warn('⚠️ Elemento de áudio não encontrado');
   165	            return;
   166	        }
   167	
   168	        // Event listeners do elemento audio
   169	        this.audioElement.addEventListener('loadedmetadata', () => {
   170	            this.duration = this.audioElement.duration;
   171	            this.updateTimeDisplay();
   172	        });
   173	
   174	        this.audioElement.addEventListener('timeupdate', () => {
   175	            this.currentTime = this.audioElement.currentTime;
   176	            this.updateProgressBar();
   177	            this.updateTimeDisplay();
   178	        });
   179	
   180	        this.audioElement.addEventListener('ended', () => {
   181	            this.handleTrackEnd();
   182	        });
   183	
   184	        this.audioElement.addEventListener('play', () => {
   185	            this.isPlaying = true;
   186	            this.updatePlayButton();
   187	            this.startVisualAnimation();
   188	        });
   189	
   190	        this.audioElement.addEventListener('pause', () => {
   191	            this.isPlaying = false;
   192	            this.updatePlayButton();
   193	            this.stopVisualAnimation();
   194	        });
   195	
   196	        this.audioElement.addEventListener('error', (e) => {
   197	            console.error('❌ Erro no áudio:', e);
   198	            this.showAudioError();
   199	        });
   200	
   201	        // Configurar volume inicial
   202	        this.audioElement.volume = this.volume;
   203	
   204	        console.log('🔊 Elemento de áudio configurado');
   205	    }
   206	
   207	    // ===== CONTROLE DE REPRODUÇÃO =====
   208	    
   209	    loadTrack(audioId) {
   210	        const trackInfo = this.audioLibrary[audioId];
   211	        if (!trackInfo) {
   212	            console.error(`❌ Áudio não encontrado: ${audioId}`);
   213	            return;
   214	        }
   215	
   216	        this.currentTrack = audioId;
   217	        this.duration = trackInfo.duration;
   218	
   219	        // Atualizar UI
   220	        this.updatePlayerInfo(trackInfo);
   221	        this.updateAudioSelection(audioId);
   222	
   223	        // Para demonstração, vamos simular o carregamento
   224	        // Em produção, você carregaria o arquivo real
   225	        this.simulateAudioLoad(trackInfo);
   226	
   227	        console.log(`🎵 Áudio carregado: ${trackInfo.title}`);
   228	    }
   229	
   230	    simulateAudioLoad(trackInfo) {
   231	        // Carregar áudio real
   232	        const audioUrl = `assets/audio/${this.currentTrack}.mp3`;
   233	        
   234	        if (this.audioElement) {
   235	            this.audioElement.src = audioUrl;
   236	            this.audioElement.load();
   237	            
   238	            // Event listeners para o áudio
   239	            this.audioElement.onloadedmetadata = () => {
   240	                this.duration = this.audioElement.duration || trackInfo.duration;
   241	                this.currentTime = 0;
   242	                this.updateTimeDisplay();
   243	                this.updateProgressBar();
   244	                
   245	                if (window.pettyZen) {
   246	                    window.pettyZen.showMessage(`🎵 ${trackInfo.title} carregado!`, 'success');
   247	                }
   248	                console.log(`✅ Áudio carregado: ${audioUrl}`);
   249	            };
   250	            
   251	            this.audioElement.onerror = (error) => {
   252	                console.error('Erro ao carregar áudio:', error, audioUrl);
   253	                if (window.pettyZen) {
   254	                    window.pettyZen.showMessage(`❌ Erro ao carregar ${trackInfo.title}`, 'error');
   255	                    window.pettyZen.showMessage(`💡 Verifique se o arquivo existe: ${audioUrl}`, 'info');
   256	                }
   257	            };
   258	            
   259	        } else {
   260	            console.error('Elemento de áudio não encontrado');
   261	        }
   262	    }
   263	
   264	    playTrack(audioId) {
   265	        this.loadTrack(audioId);
   266	        
   267	        // Pequeno delay para carregar, depois reproduzir
   268	        setTimeout(() => {
   269	            this.play();
   270	        }, 600);
   271	
   272	        // Registrar reprodução
   273	        this.recordPlayback(audioId);
   274	    }
   275	
   276	    play() {
   277	        if (!this.currentTrack) {
   278	            this.showMessage('Selecione um áudio primeiro!', 'warning');
   279	            return;
   280	        }
   281	
   282	        if (this.audioElement && this.audioElement.src) {
   283	            // Reproduzir áudio real
   284	            this.audioElement.play().then(() => {
   285	                this.isPlaying = true;
   286	                this.updatePlayButton();
   287	                this.startVisualAnimation();
   288	                this.startTimeTracking();
   289	                console.log('▶️ Reproduzindo áudio real');
   290	            }).catch((error) => {
   291	                console.error('Erro ao reproduzir:', error);
   292	                this.showMessage('❌ Erro na reprodução', 'error');
   293	            });
   294	        } else {
   295	            // Fallback para simulação se não houver arquivo
   296	            this.isPlaying = true;
   297	            this.updatePlayButton();
   298	            this.startVisualAnimation();
   299	            console.log('▶️ Simulando reprodução (arquivo não encontrado)');
   300	        }
   301	        this.startProgressSimulation();
   302	
   303	        // Em produção seria: this.audioElement.play();
   304	        
   305	        console.log(`▶️ Reproduzindo: ${this.currentTrack}`);
   306	        
   307	        // Mostrar notificação
   308	        const trackInfo = this.audioLibrary[this.currentTrack];
   309	        if (window.pettyZen) {
   310	            window.pettyZen.showMessage(`▶️ Tocando: ${trackInfo.title}`, 'info');
   311	        }
   312	    }
   313	
   314	    pause() {
   315	        this.isPlaying = false;
   316	        this.updatePlayButton();
   317	        this.stopVisualAnimation();
   318	        this.stopProgressSimulation();
   319	
   320	        // Pausar áudio real
   321	        if (this.audioElement && !this.audioElement.paused) {
   322	            this.audioElement.pause();
   323	        }
   324	        
   325	        console.log('⏸️ Áudio pausado');
   326	    }
   327	
   328	    togglePlayPause() {
   329	        if (this.isPlaying) {
   330	            this.pause();
   331	        } else {
   332	            this.play();
   333	        }
   334	    }
   335	
   336	    stop() {
   337	        this.pause();
   338	        this.currentTime = 0;
   339	        this.updateProgressBar();
   340	        this.updateTimeDisplay();
   341	        
   342	        console.log('⏹️ Áudio parado');
   343	    }
   344	
   345	    // ===== NAVEGAÇÃO DE PLAYLIST =====
   346	
   347	    createPlaylistFromCurrent() {
   348	        // Criar playlist baseada na seleção atual
   349	        this.playlist = Object.keys(this.audioLibrary);
   350	        this.currentTrackIndex = this.playlist.indexOf(this.currentTrack);
   351	        
   352	        if (this.currentTrackIndex === -1) {
   353	            this.currentTrackIndex = 0;
   354	        }
   355	    }
   356	
   357	    nextTrack() {
   358	        if (this.playlist.length === 0) {
   359	            this.createPlaylistFromCurrent();
   360	        }
   361	
   362	        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
   363	        const nextTrackId = this.playlist[this.currentTrackIndex];
   364	        
   365	        this.playTrack(nextTrackId);
   366	        
   367	        console.log(`⏭️ Próximo: ${nextTrackId}`);
   368	    }
   369	
   370	    previousTrack() {
   371	        if (this.playlist.length === 0) {
   372	            this.createPlaylistFromCurrent();
   373	        }
   374	
   375	        this.currentTrackIndex = this.currentTrackIndex > 0 
   376	            ? this.currentTrackIndex - 1 
   377	            : this.playlist.length - 1;
   378	        
   379	        const prevTrackId = this.playlist[this.currentTrackIndex];
   380	        
   381	        this.playTrack(prevTrackId);
   382	        
   383	        console.log(`⏮️ Anterior: ${prevTrackId}`);
   384	    }
   385	
   386	    handleTrackEnd() {
   387	        // Quando o áudio termina
   388	        this.recordSessionComplete();
   389	        
   390	        // Auto-play próximo (opcional)
   391	        if (this.playlist.length > 1) {
   392	            setTimeout(() => {
   393	                this.nextTrack();
   394	            }, 2000);
   395	        }
   396	    }
   397	
   398	    // ===== CONTROLE DE VOLUME =====
   399	
   400	    setVolume(volumeLevel) {
   401	        this.volume = Math.max(0, Math.min(1, volumeLevel));
   402	        
   403	        if (this.audioElement) {
   404	            this.audioElement.volume = this.volume;
   405	        }
   406	
   407	        // Atualizar slider visual
   408	        const volumeSlider = document.querySelector('.volume-slider');
   409	        if (volumeSlider) {
   410	            volumeSlider.value = this.volume * 100;
   411	        }
   412	
   413	        console.log(`🔊 Volume: ${Math.round(this.volume * 100)}%`);
   414	    }
   415	
   416	    // ===== CONTROLE DE PROGRESSO =====
   417	
   418	    seekTo(event) {
   419	        const progressBar = event.currentTarget;
   420	        const rect = progressBar.getBoundingClientRect();
   421	        const percent = (event.clientX - rect.left) / rect.width;
   422	        
   423	        this.currentTime = percent * this.duration;
   424	        
   425	        if (this.audioElement) {
   426	            this.audioElement.currentTime = this.currentTime;
   427	        }
   428	
   429	        this.updateProgressBar();
   430	        this.updateTimeDisplay();
   431	
   432	        console.log(`⏩ Seek para: ${this.formatTime(this.currentTime)}`);
   433	    }
   434	
   435	    updateProgressBar() {
   436	        const progressFill = document.querySelector('.progress-fill');
   437	        const progressHandle = document.querySelector('.progress-handle');
   438	        
   439	        if (progressFill && this.duration > 0) {
   440	            const percent = (this.currentTime / this.duration) * 100;
   441	            progressFill.style.width = `${percent}%`;
   442	            
   443	            if (progressHandle) {
   444	                progressHandle.style.left = `${percent}%`;
   445	            }
   446	        }
   447	    }
   448	
   449	    updateTimeDisplay() {
   450	        const currentTimeEl = document.querySelector('.time-current');
   451	        const totalTimeEl = document.querySelector('.time-total');
   452	
   453	        if (currentTimeEl) {
   454	            currentTimeEl.textContent = this.formatTime(this.currentTime);
   455	        }
   456	
   457	        if (totalTimeEl) {
   458	            totalTimeEl.textContent = this.formatTime(this.duration);
   459	        }
   460	    }
   461	
   462	    formatTime(seconds) {
   463	        const minutes = Math.floor(seconds / 60);
   464	        const remainingSeconds = Math.floor(seconds % 60);
   465	        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
   466	    }
   467	
   468	    // ===== SIMULAÇÃO DE PROGRESSO (PARA DEMO) =====
   469	
   470	    startProgressSimulation() {
   471	        if (this.progressInterval) {
   472	            clearInterval(this.progressInterval);
   473	        }
   474	
   475	        this.progressInterval = setInterval(() => {
   476	            if (this.isPlaying) {
   477	                this.currentTime += 1;
   478	                
   479	                if (this.currentTime >= this.duration) {
   480	                    this.currentTime = this.duration;
   481	                    this.handleTrackEnd();
   482	                    this.stopProgressSimulation();
   483	                }
   484	                
   485	                this.updateProgressBar();
   486	                this.updateTimeDisplay();
   487	            }
   488	        }, 1000);
   489	    }
   490	
   491	    stopProgressSimulation() {
   492	        if (this.progressInterval) {
   493	            clearInterval(this.progressInterval);
   494	            this.progressInterval = null;
   495	        }
   496	    }
   497	
   498	    // ===== SISTEMA DE TIMER =====
   499	
   500	    setTimer(minutes) {
   501	        // Limpar timer anterior
   502	        this.clearTimer();
   503	
   504	        this.timerDuration = minutes * 60;
   505	        this.timerRemaining = this.timerDuration;
   506	
   507	        // Atualizar UI dos botões
   508	        document.querySelectorAll('.timer-btn').forEach(btn => {
   509	            btn.classList.remove('active');
   510	        });
   511	
   512	        const activeBtn = document.querySelector(`.timer-btn[data-minutes="${minutes}"]`);
   513	        if (activeBtn) {
   514	            activeBtn.classList.add('active');
   515	        }
   516	
   517	        // Iniciar timer
   518	        this.startTimer();
   519	
   520	        // Mostrar confirmação
   521	        if (window.pettyZen) {
   522	            window.pettyZen.showMessage(`⏰ Timer configurado para ${minutes} minutos`, 'success');
   523	        }
   524	
   525	        console.log(`⏰ Timer configurado: ${minutes} minutos`);
   526	    }
   527	
   528	    startTimer() {
   529	        this.updateTimerDisplay();
   530	
   531	        this.timerInterval = setInterval(() => {
   532	            this.timerRemaining--;
   533	            this.updateTimerDisplay();
   534	
   535	            if (this.timerRemaining <= 0) {
   536	                this.handleTimerEnd();
   537	            }
   538	        }, 1000);
   539	    }
   540	
   541	    updateTimerDisplay() {
   542	        const timerDisplay = document.getElementById('timer-remaining');
   543	        if (timerDisplay) {
   544	            if (this.timerRemaining > 0) {
   545	                const minutes = Math.floor(this.timerRemaining / 60);
   546	                const seconds = this.timerRemaining % 60;
   547	                timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} restantes`;
   548	            } else {
   549	                timerDisplay.textContent = '';
   550	            }
   551	        }
   552	    }
   553	
   554	    handleTimerEnd() {
   555	        this.clearTimer();
   556	        this.stop();
   557	
   558	        // Notificação de timer finalizado
   559	        if (window.pettyZen) {
   560	            window.pettyZen.showMessage('⏰ Timer finalizado! Sessão completa.', 'success');
   561	        }
   562	
   563	        // Vibração se disponível
   564	        if (navigator.vibrate) {
   565	            navigator.vibrate([300, 100, 300]);
   566	        }
   567	
   568	        console.log('⏰ Timer finalizado');
   569	    }
   570	
   571	    clearTimer() {
   572	        if (this.timerInterval) {
   573	            clearInterval(this.timerInterval);
   574	            this.timerInterval = null;
   575	        }
   576	
   577	        this.timerDuration = 0;
   578	        this.timerRemaining = 0;
   579	        this.updateTimerDisplay();
   580	
   581	        // Remover seleção dos botões
   582	        document.querySelectorAll('.timer-btn').forEach(btn => {
   583	            btn.classList.remove('active');
   584	        });
   585	    }
   586	
   587	    // ===== INTERFACE DO USUÁRIO =====
   588	
   589	    updatePlayerUI() {
   590	        this.updatePlayButton();
   591	        this.updateTimeDisplay();
   592	        this.updateProgressBar();
   593	        this.updateTimerDisplay();
   594	    }
   595	
   596	    updatePlayButton() {
   597	        const playPauseBtn = document.getElementById('play-pause-btn');
   598	        if (playPauseBtn) {
   599	            const icon = playPauseBtn.querySelector('i');
   600	            if (icon) {
   601	                icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
   602	            }
   603	        }
   604	    }
   605	
   606	    updatePlayerInfo(trackInfo) {
   607	        const titleElement = document.getElementById('current-audio-title');
   608	        const descriptionElement = document.getElementById('current-audio-description');
   609	
   610	        if (titleElement) {
   611	            titleElement.textContent = trackInfo.title;
   612	        }
   613	
   614	        if (descriptionElement) {
   615	            descriptionElement.textContent = trackInfo.description;
   616	        }
   617	    }
   618	
   619	    updateAudioSelection(audioId) {
   620	        // Remover seleção anterior
   621	        document.querySelectorAll('.audio-card').forEach(card => {
   622	            card.classList.remove('active');
   623	        });
   624	
   625	        // Selecionar atual
   626	        const audioCard = document.querySelector(`.audio-card[data-audio="${audioId}"]`);
   627	        if (audioCard) {
   628	            audioCard.classList.add('active');
   629	        }
   630	    }
   631	
   632	    // ===== ANIMAÇÕES VISUAIS =====
   633	
   634	    startVisualAnimation() {
   635	        const waveCircles = document.querySelectorAll('.wave-circle');
   636	        waveCircles.forEach(circle => {
   637	            circle.style.animationPlayState = 'running';
   638	        });
   639	    }
   640	
   641	    stopVisualAnimation() {
   642	        const waveCircles = document.querySelectorAll('.wave-circle');
   643	        waveCircles.forEach(circle => {
   644	            circle.style.animationPlayState = 'paused';
   645	        });
   646	    }
   647	
   648	    // ===== ESTATÍSTICAS E ANALYTICS =====
   649	
   650	    recordPlayback(audioId) {
   651	        const playbackData = {
   652	            audioId: audioId,
   653	            timestamp: new Date().toISOString(),
   654	            petName: window.pettyZen?.currentPet?.name || 'Unknown',
   655	            duration: this.duration
   656	        };
   657	
   658	        // Salvar no localStorage
   659	        let playbackHistory = JSON.parse(localStorage.getItem('pettyzen_playback') || '[]');
   660	        playbackHistory.push(playbackData);
   661	
   662	        // Manter apenas os últimos 100 registros
   663	        if (playbackHistory.length > 100) {
   664	            playbackHistory = playbackHistory.slice(-100);
   665	        }
   666	
   667	        localStorage.setItem('pettyzen_playback', JSON.stringify(playbackHistory));
   668	
   669	        console.log('📊 Reprodução registrada:', audioId);
   670	    }
   671	
   672	    recordSessionComplete() {
   673	        const sessionData = {
   674	            audioId: this.currentTrack,
   675	            completedAt: new Date().toISOString(),
   676	            duration: this.currentTime,
   677	            timerUsed: this.timerDuration > 0
   678	        };
   679	
   680	        // Registrar sessão completa
   681	        let sessions = JSON.parse(localStorage.getItem('pettyzen_sessions') || '[]');
   682	        sessions.push(sessionData);
   683	
   684	        if (sessions.length > 50) {
   685	            sessions = sessions.slice(-50);
   686	        }
   687	
   688	        localStorage.setItem('pettyzen_sessions', JSON.stringify(sessions));
   689	
   690	        // Notificar conclusão
   691	        if (window.pettyZen) {
   692	            window.pettyZen.showMessage('🎉 Sessão de relaxamento concluída!', 'success');
   693	        }
   694	
   695	        console.log('✅ Sessão registrada:', sessionData);
   696	    }
   697	
   698	    // ===== RECOMENDAÇÕES INTELIGENTES =====
   699	
   700	    getRecommendedAudio() {
   701	        const hour = new Date().getHours();
   702	        const playbackHistory = JSON.parse(localStorage.getItem('pettyzen_playback') || '[]');
   703	        
   704	        // Lógica baseada no horário
   705	        let recommendedId = 'chuva-suave'; // padrão
   706	
   707	        if (hour >= 6 && hour < 12) {
   708	            // Manhã - sons suaves
   709	            recommendedId = 'piano-zen';
   710	        } else if (hour >= 12 && hour < 18) {
   711	            // Tarde - natureza
   712	            recommendedId = 'floresta-calma';
   713	        } else if (hour >= 18 && hour < 22) {
   714	            // Noite - sons aconchegantes
   715	            recommendedId = 'lareira';
   716	        } else {
   717	            // Madrugada - muito suave
   718	            recommendedId = 'ondas-mar';
   719	        }
   720	
   721	        // Verificar histórico de preferências
   722	        if (playbackHistory.length > 0) {
   723	            const mostPlayed = this.getMostPlayedAudio(playbackHistory);
   724	            if (mostPlayed && Math.random() > 0.5) {
   725	                recommendedId = mostPlayed;
   726	            }
   727	        }
   728	
   729	        return recommendedId;
   730	    }
   731	
   732	    getMostPlayedAudio(playbackHistory) {
   733	        const counts = {};
   734	        
   735	        playbackHistory.forEach(record => {
   736	            counts[record.audioId] = (counts[record.audioId] || 0) + 1;
   737	        });
   738	
   739	        let mostPlayed = null;
   740	        let maxCount = 0;
   741	
   742	        for (const [audioId, count] of Object.entries(counts)) {
   743	            if (count > maxCount) {
   744	                maxCount = count;
   745	                mostPlayed = audioId;
   746	            }
   747	        }
   748	
   749	        return mostPlayed;
   750	    }
   751	
   752	    updateDailyRecommendation() {
   753	        const recommendedId = this.getRecommendedAudio();
   754	        const recommendedInfo = this.audioLibrary[recommendedId];
   755	
   756	        // Atualizar card de recomendação na home
   757	        const sessionImage = document.querySelector('.session-image i');
   758	        const sessionTitle = document.querySelector('.session-info h3');
   759	        const sessionDescription = document.querySelector('.session-info p');
   760	        const playBtn = document.querySelector('.play-btn');
   761	
   762	        if (sessionImage) {
   763	            const iconClass = this.getAudioIconClass(recommendedId);
   764	            sessionImage.className = iconClass;
   765	        }
   766	
   767	        if (sessionTitle) {
   768	            sessionTitle.textContent = recommendedInfo.title;
   769	        }
   770	
   771	        if (sessionDescription) {
   772	            sessionDescription.textContent = recommendedInfo.description;
   773	        }
   774	
   775	        if (playBtn) {
   776	            playBtn.dataset.audio = recommendedId;
   777	        }
   778	
   779	        console.log(`💡 Recomendação atualizada: ${recommendedInfo.title}`);
   780	    }
   781	
   782	    getAudioIconClass(audioId) {
   783	        const iconMap = {
   784	            'chuva-suave': 'fas fa-cloud-rain',
   785	            'ondas-mar': 'fas fa-water',
   786	            'floresta-calma': 'fas fa-tree',
   787	            'lareira': 'fas fa-fire',
   788	            'piano-zen': 'fas fa-music',
   789	            'violao-suave': 'fas fa-guitar'
   790	        };
   791	
   792	        return iconMap[audioId] || 'fas fa-music';
   793	    }
   794	
   795	    // ===== TRATAMENTO DE ERROS =====
   796	
   797	    showAudioError() {
   798	        if (window.pettyZen) {
   799	            window.pettyZen.showMessage('❌ Erro ao carregar áudio. Verifique sua conexão.', 'error');
   800	        }
   801	
   802	        this.stop();
   803	        console.error('❌ Erro no player de áudio');
   804	    }
   805	
   806	    showMessage(message, type = 'info') {
   807	        if (window.pettyZen) {
   808	            window.pettyZen.showMessage(message, type);
   809	        } else {
   810	            console.log(`${type.toUpperCase()}: ${message}`);
   811	        }
   812	    }
   813	
   814	    // ===== MÉTODOS PÚBLICOS =====
   815	
   816	    getCurrentTrack() {
   817	        return this.currentTrack;
   818	    }
   819	
   820	    isCurrentlyPlaying() {
   821	        return this.isPlaying;
   822	    }
   823	
   824	    getPlaybackStats() {
   825	        const playbackHistory = JSON.parse(localStorage.getItem('pettyzen_playback') || '[]');
   826	        const sessions = JSON.parse(localStorage.getItem('pettyzen_sessions') || '[]');
   827	
   828	        return {
   829	            totalPlaybacks: playbackHistory.length,
   830	            totalSessions: sessions.length,
   831	            mostPlayed: this.getMostPlayedAudio(playbackHistory),
   832	            averageSessionDuration: this.getAverageSessionDuration(sessions)
   833	        };
   834	    }
   835	
   836	    getAverageSessionDuration(sessions) {
   837	        if (sessions.length === 0) return 0;
   838	
   839	        const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
   840	        return totalDuration / sessions.length;
   841	    }
   842	
   843	    // ===== CLEANUP =====
   844	
   845	    destroy() {
   846	        this.stopProgressSimulation();
   847	        this.clearTimer();
   848	        
   849	        if (this.audioElement) {
   850	            this.audioElement.pause();
   851	            this.audioElement.src = '';
   852	        }
   853	
   854	        console.log('🗑️ Audio Player destruído');
   855	    }
   856	}
   857	
   858	// ===== INICIALIZAÇÃO =====
   859	document.addEventListener('DOMContentLoaded', () => {
   860	    // Aguardar o app principal carregar
   861	    setTimeout(() => {
   862	        window.audioPlayer = new AudioPlayer();
   863	        
   864	        // Atualizar recomendação diária
   865	        if (window.audioPlayer) {
   866	            window.audioPlayer.updateDailyRecommendation();
   867	        }
   868	    }, 1000);
   869	});
   870	
   871	console.log('🎵 Audio Player carregado!');
