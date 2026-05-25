// Configuration
const PIXELS_PER_SECOND = 40; // How many pixels represents 1 second on the timeline
const SECONDS_PER_THUMBNAIL = 2; // Extract thumbnail every X seconds

// Emotion metadata and recommended SFX
const EMOTIONS = {
    inspiration: { label: "ひらめき", icon: "💡", sfx: "ピコーン！", desc: "キラキラ上昇音" },
    surprise: { label: "驚き", icon: "😲", sfx: "ジャン！", desc: "インパクトスイープ" },
    disappointment: { label: "落胆", icon: "😭", sfx: "ショボーン...", desc: "コミカル下降音" },
    shyness: { label: "照れ", icon: "😳", sfx: "ポッ", desc: "ソフトバブル音" },
    question: { label: "疑問", icon: "❓", sfx: "ハテ？", desc: "スライド上昇音" },
    laughter: { label: "笑い", icon: "😂", sfx: "ワハハ！", desc: "バウンシービープ" }
};

// 11 Video Genres / Subject Seed Metadata and BGM synthesizer configurations
const GENRES = {
    vlog: {
        label: "Vlog＆ペット",
        bgmStyle: "アコースティック・ポップ系",
        bgmTitle: "Sunny Paw Steps",
        scene: "穏やかで和やか、可愛らしい日常の空気感",
        subjects: "犬、猫、楽しそうに触れ合う飼い主、可愛い生き物",
        tempo: 105,
        chords: [
            { roots: [60, 64, 67, 71] }, // Cmaj7
            { roots: [57, 60, 64, 67] }, // Am7
            { roots: [53, 57, 60, 64] }, // Fmaj7
            { roots: [55, 59, 62, 65] }  // G7
        ],
        oscType: "triangle",
        melodyPattern: [0, 2, 4, 7, 11, 7, 4, 2]
    },
    gaming: {
        label: "ゲーム",
        bgmStyle: "エレクトロ系",
        bgmTitle: "Pixel Overdrive",
        scene: "エキサイティングで緊迫感のある、ハイテンポなサイバー空間",
        subjects: "アバター、対戦ゲーム画面、派手なスキルエフェクト",
        tempo: 130,
        chords: [
            { roots: [57, 60, 64] }, // Am
            { roots: [53, 57, 60] }, // F
            { roots: [48, 52, 55] }, // C
            { roots: [50, 55, 59] }  // G
        ],
        oscType: "square",
        melodyPattern: [0, 7, 3, 7, 12, 7, 3, 7]
    },
    talking: {
        label: "解説トーク",
        bgmStyle: "Lo-Fiチルアウト系",
        bgmTitle: "Midnight Seminar",
        scene: "知的で落ち着いた雰囲気、作業や学習に適した穏やかなBGM",
        subjects: "説明スライド、手振りを交えるスピーカー、解説者",
        tempo: 78,
        chords: [
            { roots: [48, 52, 55, 59] }, // Cmaj7
            { roots: [52, 55, 59, 62] }, // Em7
            { roots: [53, 57, 60, 64] }, // Fmaj7
            { roots: [55, 59, 62, 65] }  // G7
        ],
        oscType: "sine",
        melodyPattern: [0, 4, 7, 12, 11, 7, 4, 0]
    },
    scenic: {
        label: "風景シネマ",
        bgmStyle: "ネオ・クラシカル系",
        bgmTitle: "Elysian Fields",
        scene: "情緒的で壮大、自然の美しさや時間の移ろいを描く現代ピアノ・ストリングス編成",
        subjects: "ドローンから見下ろす森林や海岸、広がる空、差し込む光",
        tempo: 70,
        chords: [
            { roots: [48, 55, 60, 64] }, // C
            { roots: [43, 50, 55, 59] }, // G
            { roots: [45, 52, 57, 60] }, // Am
            { roots: [41, 48, 53, 57] }  // F
        ],
        oscType: "sawtooth",
        melodyPattern: [0, 7, 12, 7]
    },
    variety: {
        label: "エンタメ・バラエティ",
        bgmStyle: "ポップ・ロック系",
        bgmTitle: "Variety Showdown",
        scene: "明るく元気で、賑やかなバラエティ番組のような高揚感",
        subjects: "タレント、ポップなテロップ、賑やかなリアクション",
        tempo: 120,
        chords: [
            { roots: [60, 64, 67] }, // C
            { roots: [53, 57, 60] }, // F
            { roots: [55, 59, 62] }, // G
            { roots: [60, 64, 67] }  // C
        ],
        oscType: "triangle",
        melodyPattern: [0, 4, 7, 12, 7, 4]
    },
    gadget: {
        label: "ガジェット・商品レビュー",
        bgmStyle: "テック・ハウス系",
        bgmTitle: "Silicon Groove",
        scene: "未来的でスタイリッシュ、洗練されたテクノロジーと正確なテンポ感",
        subjects: "スマートフォン、精密な開封レビュー、美しい筐体の接写",
        tempo: 118,
        chords: [
            { roots: [57, 60, 64] }, // Am
            { roots: [50, 53, 57] }, // Dm
            { roots: [55, 59, 62] }, // G
            { roots: [48, 52, 55] }  // C
        ],
        oscType: "sawtooth",
        melodyPattern: [0, 3, 7, 10, 12, 10, 7, 3]
    },
    gourmet: {
        label: "料理・グルメ(レシピ&食べ歩き)",
        bgmStyle: "ジプシー・ジャズ系",
        bgmTitle: "Le Petit Bistro",
        scene: "軽快でスウィングする、心地よいカフェやビストロの賑わい",
        subjects: "焼き上がるステーキ、彩り豊かなパスタ、カフェの看板",
        tempo: 135,
        chords: [
            { roots: [57, 60, 64, 69] }, // Am6
            { roots: [52, 56, 59, 62] }, // E7
            { roots: [50, 53, 57, 60] }, // Dm7
            { roots: [57, 60, 64, 69] }  // Am6
        ],
        oscType: "triangle",
        melodyPattern: [0, 4, 7, 9, 12, 9, 7, 4]
    },
    animation: {
        label: "アニメーション・手描き・3D CG",
        bgmStyle: "シンセサイザー・ウェーブ系",
        bgmTitle: "Retro Future Drive",
        scene: "ノスタルジックでフューチャリスティックな80年代シンセウェーブの躍動感",
        subjects: "2D・3Dキャラクター、手描きを描画するフレーム、美麗なレンダリング",
        tempo: 112,
        chords: [
            { roots: [57, 60, 64] }, // Am
            { roots: [55, 59, 62] }, // G
            { roots: [53, 57, 60] }, // F
            { roots: [52, 56, 59] }  // E
        ],
        oscType: "sawtooth",
        melodyPattern: [0, 7, 12, 7, 14, 12, 7, 0]
    },
    vtuber: {
        label: "バーチャルYouTuber(VTuber)",
        bgmStyle: "Future Funk系",
        bgmTitle: "Neon Hologram Love",
        scene: "ファンキーでエネルギッシュ、ポップでサイバーなディスコ・クラブ空間",
        subjects: "バーチャル配信の様子、ダンスする3Dモデル、リスナーとの対話",
        tempo: 125,
        chords: [
            { roots: [48, 52, 55, 59] }, // Cmaj7
            { roots: [50, 54, 57, 62] }, // D6
            { roots: [47, 50, 54, 57] }, // Bm7
            { roots: [52, 55, 59, 62] }  // Em7
        ],
        oscType: "triangle",
        melodyPattern: [0, 4, 7, 11, 12, 11, 7, 4]
    },
    vehicle: {
        label: "モータースポーツ・乗り物(車載&旅行記)",
        bgmStyle: "ロードムービー風のカントリー・ロック系",
        bgmTitle: "Route 66 Breeze",
        scene: "風を切り疾走するロードムービー、自由で開放感溢れるギター弾き語り調",
        subjects: "フロントガラスから見える流れる景色、エンジン音、旅路の空",
        tempo: 100,
        chords: [
            { roots: [55, 59, 62] }, // G
            { roots: [48, 52, 55] }, // C
            { roots: [50, 54, 57] }, // D
            { roots: [55, 59, 62] }  // G
        ],
        oscType: "triangle",
        melodyPattern: [0, 4, 7, 12, 7, 4]
    },
    fitness: {
        label: "スポーツ・フィットネス",
        bgmStyle: "ヒーリング・ミュージック系",
        bgmTitle: "Zen Flow Yoga",
        scene: "穏やかで静粛、心身の調和をもたらす癒やしのメロディ空間",
        subjects: "ヨガのストレッチ姿勢、瞑想する人物、美しい朝日のスタジオ",
        tempo: 60,
        chords: [
            { roots: [53, 57, 60, 64] }, // Fmaj7
            { roots: [55, 59, 62, 65] }, // G7
            { roots: [52, 55, 59, 62] }, // Em7
            { roots: [57, 60, 64, 67] }  // Am7
        ],
        oscType: "sine",
        melodyPattern: [0, 7, 12, 14, 12, 7]
    }
};

// UI Elements
const uploadInput = document.getElementById('video-upload');
const dropZone = document.getElementById('drop-zone');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const videoContainer = document.getElementById('video-container');
const mainVideo = document.getElementById('main-video');
const statusBadge = document.getElementById('status-badge');

const playPauseBtn = document.getElementById('play-pause-btn');
const timeDisplay = document.getElementById('time-display');

const timelineScrollArea = document.getElementById('timeline-scroll-area');
const timelineTracks = document.getElementById('timeline-tracks');
const playhead = document.getElementById('playhead');

const rulerTrack = document.getElementById('ruler-track');
const videoTrack = document.getElementById('video-track');
const audioTrack = document.getElementById('audio-track');
const audioCanvas = document.getElementById('audio-waveform');
const sfxTrack = document.getElementById('sfx-track');
const analysisTrack = document.getElementById('analysis-track');
const thumbnailCanvas = document.getElementById('thumbnail-canvas');
const ctxThumb = thumbnailCanvas.getContext('2d', { willReadFrequently: true });

// Inspector Elements
const inspectorPanel = document.getElementById('inspector-panel');
const closeInspectorBtn = document.getElementById('close-inspector-btn');
const inspectorTime = document.getElementById('inspector-time');
const inspectorSfxName = document.getElementById('inspector-sfx-name');
const playSfxBtn = document.getElementById('play-sfx-btn');
const emotionGridButtons = document.querySelectorAll('.emotion-btn');

// Tab Elements
const tabManual = document.getElementById('tab-manual');
const tabAi = document.getElementById('tab-ai');
const tabContentManual = document.getElementById('tab-content-manual');
const tabContentAi = document.getElementById('tab-content-ai');
const aiAdviceList = document.getElementById('ai-advice-list');

// Active state properties
let audioContext = null;
let currentVideoDuration = 0;
let isAnalyzing = false;
let emotionsArray = []; // Holds the emotion string for each second of the video
let selectedBlockIndex = null; // Currently selected timeline block index
let aiAdviceData = []; // Holds generated AI Co-Pilot recommendations

// Multimodal Extensions properties
let activeGenre = 'vlog';
let hasAudio = true;
let motionActivityData = []; // 1-second motion scores (0.0 to 1.0)
let isPlayingBGM = false;
let bgmIntervalId = null;
let bgmNodes = []; // store active synth nodes for BGM

// Format time in MM:SS
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Initialize application
function init() {
    setupUploadHandlers();
    setupVideoControls();
    setupTimelineInteraction();
    setupInspectorHandlers();
    setupTabHandlers();
    setupGenreSelector();
    setupBGMControls();
    
    // Sync BGM recommendation details on load for the default active genre
    updateBGMRecommendationUI();
}

function setupGenreSelector() {
    const genreGrid = document.getElementById('genre-grid');
    if (!genreGrid) return;
    
    genreGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.genre-btn');
        if (!btn) return;
        
        genreGrid.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        activeGenre = btn.dataset.genre;
        
        // If BGM is playing, stop and restart under new genre style immediately
        if (isPlayingBGM) {
            stopSynthBGM();
            startSynthBGM(activeGenre);
        }
        
        // Update BGM recommendation UI immediately, regardless of upload state!
        updateBGMRecommendationUI();
        
        // If analysis is already complete, update AI recommendation details dynamically!
        if (currentVideoDuration > 0) {
            generateAIAdvice(currentVideoDuration);
        }
    });
}

function setupUploadHandlers() {
    uploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleVideoFile(e.target.files[0]);
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent-color)';
        dropZone.style.background = 'rgba(99, 102, 241, 0.05)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--panel-border)';
        dropZone.style.background = 'var(--panel-bg)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--panel-border)';
        dropZone.style.background = 'var(--panel-bg)';
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                handleVideoFile(file);
            } else {
                alert('Please upload a valid video file.');
            }
        }
    });
}

function handleVideoFile(file) {
    const videoUrl = URL.createObjectURL(file);
    
    // Smoothly terminate BGM synth if it's currently active
    stopSynthBGM();
    
    // Switch UI view
    uploadPlaceholder.classList.add('hidden');
    videoContainer.classList.remove('hidden');
    dropZone.classList.add('video-loaded');
    
    mainVideo.src = videoUrl;
    
    // Always show inspector panel once a video is loaded
    inspectorPanel.classList.remove('hidden');
    
    // Show analyzing badge
    const overlay = document.getElementById('overlay-info');
    overlay.classList.remove('hidden');
    statusBadge.innerText = 'Analyzing Video & Audio...';
    statusBadge.style.color = '#fff';
    
    mainVideo.onloadedmetadata = async () => {
        currentVideoDuration = mainVideo.duration;
        setupTimeline(currentVideoDuration);
        
        // 1. Run real pixel differencing visual motion analysis in background
        await analyzeVideoVisuals(videoUrl, currentVideoDuration);
        
        // 2. Run audio RMS analysis & silence detection
        analyzeAudio(file);
        
        // 3. Extract thumbnails for the visual track
        extractThumbnails(videoUrl, currentVideoDuration);
    };
}

function setupTimeline(duration) {
    const totalWidth = duration * PIXELS_PER_SECOND;
    timelineTracks.style.width = `${totalWidth}px`;
    
    // Clear previous tracks
    rulerTrack.innerHTML = '';
    videoTrack.innerHTML = '';
    sfxTrack.innerHTML = '';
    analysisTrack.innerHTML = '';
    
    // Draw ruler
    for (let i = 0; i <= Math.ceil(duration); i++) {
        const mark = document.createElement('div');
        mark.className = `ruler-mark ${i % 5 === 0 ? 'major' : ''}`;
        mark.style.left = `${i * PIXELS_PER_SECOND}px`;
        
        if (i % 5 === 0) {
            const timeLabel = document.createElement('div');
            timeLabel.className = 'ruler-time';
            timeLabel.innerText = formatTime(i);
            timeLabel.style.left = `${i * PIXELS_PER_SECOND}px`;
            rulerTrack.appendChild(timeLabel);
        }
        rulerTrack.appendChild(mark);
    }
    
    timeDisplay.innerText = `00:00 / ${formatTime(duration)}`;
}

// Setup Video Controls and playhead sync
function setupVideoControls() {
    playPauseBtn.addEventListener('click', () => {
        if (mainVideo.paused) {
            mainVideo.play();
            playPauseBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
        } else {
            mainVideo.pause();
            playPauseBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
        }
    });

    mainVideo.addEventListener('timeupdate', () => {
        const current = mainVideo.currentTime;
        timeDisplay.innerText = `${formatTime(current)} / ${formatTime(currentVideoDuration)}`;
        
        // Update playhead position
        const px = current * PIXELS_PER_SECOND;
        playhead.style.transform = `translateX(${px}px)`;
        
        // Auto scroll timeline if playhead goes out of view
        const scrollLeft = timelineScrollArea.scrollLeft;
        const width = timelineScrollArea.clientWidth;
        
        if (px > scrollLeft + width * 0.8) {
            timelineScrollArea.scrollLeft = px - width * 0.2;
        } else if (px < scrollLeft) {
            timelineScrollArea.scrollLeft = px;
        }
    });

    mainVideo.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
    });
}

function setupTimelineInteraction() {
    // Intercept clicks on the general timeline scroll area to sync playhead (excluding sfx track clicks)
    timelineScrollArea.addEventListener('click', (e) => {
        if (!currentVideoDuration) return;
        if (e.target.closest('#sfx-track')) return;
        
        const rect = timelineTracks.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        
        let newTime = clickX / PIXELS_PER_SECOND;
        newTime = Math.max(0, Math.min(newTime, currentVideoDuration));
        
        mainVideo.currentTime = newTime;
    });
}

// ----------------------------------------------------
// Web Audio API Synthesizer (SFX Engine)
// ----------------------------------------------------
function playSynthSFX(emotion) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const now = audioContext.currentTime;
    
    // Master volume node
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.22, now); // comfortable volume
    masterGain.connect(audioContext.destination);
    
    if (emotion === 'inspiration') {
        // "💡 ひらめき" -> Sparkling chime: two high notes, rising pitch, quick decay
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(1318.51, now); // E6
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.4, now + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        osc1.connect(gain1);
        gain1.connect(masterGain);
        
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1760.00, now + 0.08); // A6
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.setValueAtTime(0, now + 0.06);
        gain2.gain.linearRampToValueAtTime(0.4, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc2.connect(gain2);
        gain2.connect(masterGain);
        
        osc1.start(now);
        osc1.stop(now + 0.35);
        osc2.start(now);
        osc2.stop(now + 0.45);
        
    } else if (emotion === 'surprise') {
        // "😲 驚き" -> Sharp warning sweep
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);
        
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        const subOsc = audioContext.createOscillator();
        const subGain = audioContext.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(80, now);
        subGain.gain.setValueAtTime(0.8, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        subOsc.connect(subGain);
        subGain.connect(masterGain);
        
        osc.start(now);
        osc.stop(now + 0.35);
        subOsc.start(now);
        subOsc.stop(now + 0.38);
        
    } else if (emotion === 'disappointment') {
        // "😭 落胆" -> falling pitch comical trombone sweep with LFO vibrato
        const duration = 0.75;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(110, now + duration);
        
        const vibrato = audioContext.createOscillator();
        const vibratoGain = audioContext.createGain();
        vibrato.frequency.value = 8.5; // 8.5 Hz
        vibratoGain.gain.value = 18; 
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.linearRampToValueAtTime(0.6, now + duration - 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        vibrato.start(now);
        osc.start(now);
        
        vibrato.stop(now + duration);
        osc.stop(now + duration);
        
    } else if (emotion === 'shyness') {
        // "😳 照れ" -> Soft warm bubble pops ("風船の弾けるようなポップな効果音" pop synth)
        const freqs = [293.66, 349.23, 440.00, 523.25]; // D4, F4, A4, C5
        freqs.forEach((freq, idx) => {
            const delay = idx * 0.07;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + delay);
            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(0.5, now + delay + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(now);
            osc.stop(now + delay + 0.2);
        });
        
    } else if (emotion === 'question') {
        // "❓ 疑問" -> Short sliding up "huh?" tone
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.2);
        
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(now);
        osc.stop(now + 0.28);
        
    } else if (emotion === 'laughter') {
        // "😂 笑い" -> Bouncy retro laughter sound
        const notes = [280, 310, 280, 310, 340, 280];
        notes.forEach((freq, idx) => {
            const delay = idx * 0.065;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + delay);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(0.4, now + delay + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(now);
            osc.stop(now + delay + 0.07);
        });
    }
}

// ----------------------------------------------------
// Web Audio API Synthesizer (BGM Engine)
// ----------------------------------------------------
function startSynthBGM(genre) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const config = GENRES[genre];
    isPlayingBGM = true;
    
    // Toggle UI visualizer active animations
    const visualizer = document.getElementById('bgm-visualizer');
    if (visualizer) visualizer.classList.remove('hidden');
    const playBtn = document.getElementById('bgm-play-btn');
    if (playBtn) {
        playBtn.innerHTML = '<i class="ph-fill ph-pause-circle"></i> BGMを停止する';
    }
    
    let chordIndex = 0;
    const secondsPerBeat = 60 / config.tempo;
    const secondsPerChord = secondsPerBeat * 4; // 4 beats per chord
    
    const playNextChord = () => {
        if (!isPlayingBGM) return;
        
        const now = audioContext.currentTime;
        const chord = config.chords[chordIndex];
        
        // Lowpass filter to smooth chord frequencies
        const filter = audioContext.createBiquadFilter();
        filter.type = "lowpass";
        if (config.oscType === "sine") {
            filter.frequency.setValueAtTime(1000, now);
        } else if (config.oscType === "sawtooth") {
            filter.frequency.setValueAtTime(500, now); // Warm, filtered detuned analog sawtooths
            filter.Q.setValueAtTime(3.5, now);
        } else {
            filter.frequency.setValueAtTime(800, now);
        }
        
        // Gain node for smooth chords
        const chordGain = audioContext.createGain();
        chordGain.gain.setValueAtTime(0, now);
        chordGain.gain.linearRampToValueAtTime(0.06, now + 0.4); // soft pad attack
        chordGain.gain.setValueAtTime(0.06, now + secondsPerChord - 0.4);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + secondsPerChord);
        
        filter.connect(chordGain);
        chordGain.connect(audioContext.destination);
        bgmNodes.push(chordGain);
        
        // Start polyphonic chord oscillators
        chord.roots.forEach((midiNote) => {
            const osc = audioContext.createOscillator();
            osc.type = config.oscType;
            const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
            osc.frequency.setValueAtTime(freq, now);
            
            // Add subtle detune for scenic cinematic strings
            if (genre === 'scenic') {
                osc.detune.setValueAtTime((Math.random() - 0.5) * 16, now);
            }
            
            osc.connect(filter);
            osc.start(now);
            osc.stop(now + secondsPerChord);
        });
        
        // Play dynamic arpeggiated synth melody in parallel
        const melodyGain = audioContext.createGain();
        melodyGain.gain.setValueAtTime(0, now);
        melodyGain.gain.linearRampToValueAtTime(0.03, now + 0.15);
        melodyGain.gain.exponentialRampToValueAtTime(0.001, now + secondsPerChord - 0.1);
        melodyGain.connect(audioContext.destination);
        bgmNodes.push(melodyGain);
        
        const pattern = config.melodyPattern;
        pattern.forEach((noteOffset, step) => {
            const stepTime = now + (step * secondsPerBeat);
            const osc = audioContext.createOscillator();
            // Upbeat genres use square synth leads, healing/chill uses sine chimes
            osc.type = (genre === 'gaming' || genre === 'animation' || genre === 'vtuber') ? 'square' : 'sine';
            
            const highestNote = chord.roots[chord.roots.length - 1];
            const midiMelody = highestNote + noteOffset + 12; // Octave higher
            const freq = 440 * Math.pow(2, (midiMelody - 69) / 12);
            
            osc.frequency.setValueAtTime(freq, stepTime);
            
            const noteGain = audioContext.createGain();
            noteGain.gain.setValueAtTime(0, stepTime);
            noteGain.gain.linearRampToValueAtTime(0.02, stepTime + 0.04);
            noteGain.gain.exponentialRampToValueAtTime(0.001, stepTime + secondsPerBeat - 0.04);
            
            osc.connect(noteGain);
            noteGain.connect(melodyGain);
            
            osc.start(stepTime);
            osc.stop(stepTime + secondsPerBeat);
        });
        
        chordIndex = (chordIndex + 1) % config.chords.length;
        
        // Schedule next chord repeat
        bgmIntervalId = setTimeout(playNextChord, secondsPerChord * 1000);
    };
    
    playNextChord();
}

function stopSynthBGM() {
    isPlayingBGM = false;
    if (bgmIntervalId) {
        clearTimeout(bgmIntervalId);
        bgmIntervalId = null;
    }
    
    // Stop and disconnect all active audio graph nodes
    bgmNodes.forEach((node) => {
        try {
            node.disconnect();
        } catch (e) {}
    });
    bgmNodes = [];
    
    // Reset play state and classes in the UI
    const visualizer = document.getElementById('bgm-visualizer');
    if (visualizer) visualizer.classList.add('hidden');
    const playBtn = document.getElementById('bgm-play-btn');
    if (playBtn) {
        playBtn.innerHTML = '<i class="ph-fill ph-play-circle"></i> BGMを試聴する';
    }
}

function setupBGMControls() {
    const playBtn = document.getElementById('bgm-play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (isPlayingBGM) {
                stopSynthBGM();
            } else {
                startSynthBGM(activeGenre);
            }
        });
    }
}

// ----------------------------------------------------
// Visual Frame Differencing Computer Vision Loop
// ----------------------------------------------------
async function analyzeVideoVisuals(videoUrl, duration) {
    return new Promise((resolve) => {
        const hiddenVideo = document.createElement('video');
        hiddenVideo.src = videoUrl;
        hiddenVideo.crossOrigin = "anonymous";
        hiddenVideo.muted = true;
        
        // Small hidden canvas to perform rapid, thread-safe pixel compares
        const motionCanvas = document.createElement('canvas');
        motionCanvas.width = 32;
        motionCanvas.height = 24;
        const motionCtx = motionCanvas.getContext('2d', { willReadFrequently: true });
        
        const totalSeconds = Math.ceil(duration);
        motionActivityData = new Array(totalSeconds).fill(0.0);
        
        hiddenVideo.onloadedmetadata = () => {
            let currentSecond = 0;
            let prevFrameData = null;
            
            const analyzeNext = () => {
                if (currentSecond >= totalSeconds) {
                    resolve();
                    return;
                }
                
                // Keep the loading screen progress updated
                const progressPercent = Math.round((currentSecond / totalSeconds) * 100);
                if (statusBadge && isAnalyzing) {
                    statusBadge.innerText = `Analyzing Video Frames (${progressPercent}%)...`;
                }
                
                hiddenVideo.currentTime = currentSecond;
            };
            
            hiddenVideo.addEventListener('seeked', () => {
                motionCtx.drawImage(hiddenVideo, 0, 0, 32, 24);
                const imgData = motionCtx.getImageData(0, 0, 32, 24);
                const pixels = imgData.data;
                
                if (prevFrameData) {
                    let diffSum = 0;
                    for (let i = 0; i < pixels.length; i += 4) {
                        diffSum += Math.abs(pixels[i] - prevFrameData[i]);     // R
                        diffSum += Math.abs(pixels[i+1] - prevFrameData[i+1]); // G
                        diffSum += Math.abs(pixels[i+2] - prevFrameData[i+2]); // B
                    }
                    
                    const maxDiff = 32 * 24 * 3 * 255;
                    let normalizedDiff = diffSum / maxDiff;
                    
                    // Scale it so standard camerawork generates visible motion scores
                    let motionScore = Math.min(1.0, normalizedDiff * 12.0);
                    
                    motionActivityData[currentSecond] = parseFloat(motionScore.toFixed(3));
                } else {
                    // Start of video defaults to minor noise
                    motionActivityData[currentSecond] = 0.05;
                }
                
                prevFrameData = new Uint8ClampedArray(pixels);
                currentSecond++;
                analyzeNext();
            });
            
            analyzeNext();
        };
        
        hiddenVideo.onerror = (e) => {
            console.error("Frame-based video visual analysis failed:", e);
            resolve();
        };
    });
}

// ----------------------------------------------------
// AI Simulation Heuristics: Emotion Classifier
// ----------------------------------------------------
function analyzeEmotions(energyData, maxEnergy) {
    const dataToUse = hasAudio ? energyData : motionActivityData;
    const maxVal = hasAudio ? maxEnergy : 1.0;
    const duration = dataToUse.length;
    const computedEmotions = new Array(duration).fill(null);
    
    const highThreshold = maxVal * 0.5; 
    const midThreshold = maxVal * 0.2;
    
    for (let i = 0; i < duration; i++) {
        const val = dataToUse[i];
        const prevVal = i > 0 ? dataToUse[i - 1] : 0;
        const nextVal = i < duration - 1 ? dataToUse[i + 1] : 0;
        
        // 1. "驚き" (Surprise) -> Sudden spike
        if (val > highThreshold && val > prevVal * 1.6) {
            computedEmotions[i] = 'surprise';
        }
        // 2. "落胆" (Disappointment) -> Drop to quiet after a spike
        else if (val < midThreshold && prevVal > highThreshold) {
            computedEmotions[i] = 'disappointment';
        }
        // 3. "笑い" (Laughter) -> Steady medium high level
        else if (val > midThreshold && val <= highThreshold && prevVal > midThreshold && nextVal > midThreshold) {
            computedEmotions[i] = 'laughter';
        }
        // 4. "ひらめき" (Inspiration) -> Rising from quiet
        else if (val > midThreshold && prevVal < midThreshold * 0.4) {
            computedEmotions[i] = 'inspiration';
        }
        // 5. "疑問" (Question) -> Subtle low-mid oscillations
        else if (val > midThreshold * 0.4 && val < midThreshold && Math.abs(val - prevVal) > maxVal * 0.04) {
            computedEmotions[i] = 'question';
        }
        // 6. "照れ" (Shyness - pop synth pop trigger!) -> Calm periods
        else {
            if (val < midThreshold * 0.3) {
                computedEmotions[i] = 'shyness';
            } else {
                const indexPattern = ['shyness', 'question', 'inspiration', 'shyness', 'question', 'inspiration'];
                computedEmotions[i] = indexPattern[(i * 7) % indexPattern.length];
            }
        }
    }
    
    return computedEmotions;
}

// ----------------------------------------------------
// AI Co-Pilot: Dynamic Multimodal Advice Engine
// ----------------------------------------------------
function updateBGMRecommendationUI() {
    const card = document.getElementById('bgm-recommend-card');
    if (!card) return;
    
    card.classList.remove('hidden');
    
    const badge = document.getElementById('analysis-mode-badge');
    if (badge) {
        if (currentVideoDuration === 0) {
            badge.className = 'bgm-badge';
            badge.innerHTML = '<i class="ph ph-sparkles"></i> 分析準備完了（推奨BGMプレビュー表示）';
        } else if (hasAudio) {
            badge.className = 'bgm-badge';
            badge.innerHTML = '<i class="ph-fill ph-waveform"></i> 音声+映像ハイブリッド解析';
        } else {
            badge.className = 'bgm-badge silent-mode';
            badge.innerHTML = '<i class="ph-fill ph-speaker-slash"></i> 映像・動き解析モード (環境音なし)';
        }
    }
    
    const config = GENRES[activeGenre];
    
    // Set static text from seeded genre config
    document.getElementById('detected-scene').innerText = config.scene;
    document.getElementById('detected-subjects').innerText = config.subjects;
    
    // Formulate a dynamic visual composition analysis using calculated visual motion values
    let motionDesc = "";
    if (currentVideoDuration === 0) {
        motionDesc = "動画をアップロードすると、映像の動きや構図変化がここに自動分析されます。";
    } else {
        let averageMotion = 0;
        if (motionActivityData.length > 0) {
            const sum = motionActivityData.reduce((a, b) => a + b, 0);
            averageMotion = sum / motionActivityData.length;
        }
        
        if (averageMotion > 0.35) {
            motionDesc = `カメラワークが活発であり、被写体の素早い動作や激しいカット割りが多く検出されています。 (平均動き量: ${(averageMotion * 100).toFixed(0)}%)`;
        } else if (averageMotion > 0.15) {
            motionDesc = `なだらかなカメラのパンニング（視点移動）と、適度な被写体の動きが検出されたバランスの良い構図です。 (平均動き量: ${(averageMotion * 100).toFixed(0)}%)`;
        } else {
            motionDesc = `固定カメラ撮影を主体とした、構図が非常に安定した落ち着きのある映像構造です。 (平均動き量: ${(averageMotion * 100).toFixed(0)}%)`;
        }
    }
    
    document.getElementById('detected-motion').innerText = motionDesc;
    
    // Display the recommended matching style
    document.getElementById('recommended-bgm-style').innerText = `${config.bgmTitle} (${config.bgmStyle})`;
}

function generateAIAdvice(duration) {
    aiAdviceList.innerHTML = '';
    aiAdviceData = [];
    
    const config = GENRES[activeGenre];
    
    // Determine dynamic advice count depending on video length:
    // ~60s -> 3 advices
    // ~300s -> up to 5 advices
    let numAdvices = 3;
    if (duration > 300) {
        numAdvices = 5;
    } else if (duration > 180) {
        numAdvices = 4;
    }
    
    const advices = [];
    const usedSeconds = new Set();
    
    // Extract interest groups from detected emotions (which represent visual movement & audio shapes)
    const surpriseIndices = [];
    const inspirationIndices = [];
    const disappointmentIndices = [];
    const shynessIndices = [];
    const laughterIndices = [];
    const questionIndices = [];
    
    emotionsArray.forEach((em, idx) => {
        if (em === 'surprise') surpriseIndices.push(idx);
        else if (em === 'inspiration') inspirationIndices.push(idx);
        else if (em === 'disappointment') disappointmentIndices.push(idx);
        else if (em === 'shyness') shynessIndices.push(idx);
        else if (em === 'laughter') laughterIndices.push(idx);
        else if (em === 'question') questionIndices.push(idx);
    });
    
    // Select unique timestamps distributed nicely over the timeline
    const getUniqueIndex = (indices, fallbackTime) => {
        if (indices.length > 0) {
            for (let idx of indices) {
                if (!usedSeconds.has(idx)) {
                    let farEnough = true;
                    for (let used of usedSeconds) {
                        if (Math.abs(used - idx) < 6) farEnough = false;
                    }
                    if (farEnough) {
                        usedSeconds.add(idx);
                        return idx;
                    }
                }
            }
        }
        
        let fb = fallbackTime;
        while (usedSeconds.has(fb) && fb < duration) {
            fb++;
        }
        usedSeconds.add(fb);
        return fb;
    };
    
    // 1. Balloon Pop Sound SFX Recommendation (Direct user feature)
    // Runs a dynamic second scan using our pixel diffing score for this video!
    const popTime = getUniqueIndex(shynessIndices, Math.min(62, Math.floor(duration / 2)));
    
    let popText = "";
    if (!hasAudio) {
        popText = `映像のピクセル差分を分析した結果、適度な構図変化のある穏やかな瞬間（動き量: ${(motionActivityData[popTime] * 100).toFixed(0)}%）を検出しました。このタイミングに、弾力のあるシンセサウンドの **『ポッ（風船が弾けるようなポップな効果音 - Pop Synth）』** を1秒単位で正確に重ねましょう。無音動画にリズミカルで気持ち良いアクセントを付与できます。`;
    } else {
        popText = `音声の環境ノイズレベルが抑えられた区間です。周囲の音に被せるように、軽快な **『ポッ（風船が弾けるポップな効果音 - Pop Synth）』** をオーバーラップさせて自然に挿入しましょう。動画の進行に可愛いテンポの変化を加えられます。`;
    }
    
    advices.push({
        time: popTime,
        emotion: 'shyness',
        title: "🎈 ポップ効果音の推奨",
        text: popText
    });
    
    // 2. High Impact / Cut Scene Accent Recommendation
    const surpriseTime = getUniqueIndex(surpriseIndices, Math.min(5, Math.floor(duration * 0.15)));
    let surpriseText = "";
    if (!hasAudio) {
        surpriseText = `映像ピクセル解析の結果、構図が劇的に切り替わったか、被写体が急激に動いたフレームです。視覚的な盛り上がりに同調するように、迫力のある **『ジャン！（インパクトスイープ）』** を配置しましょう。カットの変わり目をシャープに強調し、テンポを高めます。`;
    } else {
        surpriseText = `音声データの波形から、急激にボリュームが立ち上がったピーク（音量エネルギーのスパイク）を検出。環境音の急増ポイントに重ねる形で、鮮烈な **『ジャン！（インパクトスイープ）』** をオーバーラップさせて配置しましょう。映像と音声の迫力が調和します。`;
    }
    
    advices.push({
        time: surpriseTime,
        emotion: 'surprise',
        title: "😲 インパクト演出の追加",
        text: surpriseText
    });
    
    // 3. Sparkling Chime / Creative Spark Recommendation
    if (numAdvices >= 3) {
        const inspTime = getUniqueIndex(inspirationIndices, Math.min(18, Math.floor(duration * 0.45)));
        let inspText = "";
        if (!hasAudio) {
            inspText = `映像の動きが静寂からなだらかに上昇するポイントを捕捉しました。キャラクターがひらめいたシーンや、場面の転換点に合わせて、キラキラした高音の **『ピコーン！（ひらめき）』** を挿入しましょう。視覚的な気付きをコミカルに補強します。`;
        } else {
            inspText = `音声エネルギーに上品な立ち上がりが検出されました。環境音とぶつからないよう、高域が澄んだ **『ピコーン！（ひらめき）』** をオーバーラップ挿入することを推奨します。BGMスタイルの「${config.bgmStyle}」の周波数帯域とも美しく馴染みます。`;
        }
        
        advices.push({
            time: inspTime,
            emotion: 'inspiration',
            title: "💡 気付き・ひらめきの強調",
            text: inspText
        });
    }
    
    // 4. Comical Disappointment Trombone Recommendation
    if (numAdvices >= 4) {
        const disTime = getUniqueIndex(disappointmentIndices, Math.min(32, Math.floor(duration * 0.75)));
        let disText = "";
        if (!hasAudio) {
            disText = `活発な映像の動きの後に、急激に動きが完全にストップ（0.0付近に下降）したポイントです。この映像の急激な落差（静止した間）を逃さず、コミカルな **『ショボーン...（トロンボーン調下降音）』** を差し挟むことで、映像内のオチや落胆の表情を非常にユーモラスに演出できます。`;
        } else {
            disText = `盛り上がった後に急激な無音（オーディオの極端なレベル減衰）が訪れたギャップ部分です。セリフやノイズの隙間に哀愁漂う **『ショボーン...（トロンボーン調下降音）』** をオーバーラップ配置することで、ギャグやオチのコメディセンスを完璧に補強します。`;
        }
        
        advices.push({
            time: disTime,
            emotion: 'disappointment',
            title: "😭 コミカルなオチ・落胆の演出",
            text: disText
        });
    }
    
    // 5. Question / Fluctuation Recommendation
    if (numAdvices >= 5) {
        const doubtTime = getUniqueIndex(questionIndices, Math.min(48, Math.floor(duration * 0.9)));
        let doubtText = "";
        if (!hasAudio) {
            doubtText = `ピクセル差分が細かく変動し、被写体が首をかしげたり細かな仕草を行ったりしているような動きを検出しました。このビジュアルに合わせ、可愛らしく語尾が上がる **『ハテ？（疑問音）』** を配置しましょう。キャラクターの疑問や問いかけの表情にベストマッチします。`;
        } else {
            doubtText = `音声データ内に細かな振幅の変化（声の揺らぎなど）が検知されました。会話の間の微妙なニュアンスや疑問を提示するカットで、コミカルな **『ハテ？（疑問音）』** をオーバーラップ挿入し、シーンの親しみやすさをアップさせましょう。`;
        }
        
        advices.push({
            time: doubtTime,
            emotion: 'question',
            title: "❓ 疑問・問いかけのアクセント",
            text: doubtText
        });
    }
    
    // Sort chronological order
    advices.sort((a, b) => a.time - b.time);
    
    // Map chronological suggestions into the timeline block array
    advices.forEach((adv) => {
        if (adv.time < duration) {
            emotionsArray[adv.time] = adv.emotion;
        }
    });
    
    // Re-render sfx blocks on timeline track
    drawSFXTrack(emotionsArray);
    
    // Synchronize recommended BGM description card
    updateBGMRecommendationUI();
    
    // Output cards to AI tab UI list
    aiAdviceData = advices;
    
    aiAdviceData.forEach((adv) => {
        const card = document.createElement('div');
        card.className = 'ai-advice-card';
        card.dataset.index = adv.time;
        
        const emLabel = EMOTIONS[adv.emotion].label;
        const emIcon = EMOTIONS[adv.emotion].icon;
        
        card.innerHTML = `
            <div class="ai-advice-meta">
                <span class="ai-advice-time">${formatTime(adv.time)}</span>
                <span class="ai-advice-tag">${adv.title} (${emIcon} ${emLabel})</span>
            </div>
            <div class="ai-advice-text">${adv.text}</div>
        `;
        
        card.addEventListener('click', () => {
            // Remove previous active outline
            aiAdviceList.querySelectorAll('.ai-advice-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Sync playhead and select manual block
            selectSFXBlock(adv.time);
            
            // Retain active AI advice tab
            tabAi.click();
        });
        
        aiAdviceList.appendChild(card);
    });
}

// ----------------------------------------------------
// Core Feature: Audio Analysis & Silence Detection
// ----------------------------------------------------
async function analyzeAudio(file) {
    isAnalyzing = true;
    hasAudio = true; // reset state
    
    let energyData = [];
    let maxEnergy = 0;
    
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const arrayBuffer = await file.arrayBuffer();
        
        let audioBuffer = null;
        try {
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (decodeErr) {
            // Assume silent/muted MP4 or audio-less container
            console.warn("Could not decode audio data. Assuming silent video.", decodeErr);
        }
        
        if (audioBuffer) {
            const channelData = audioBuffer.getChannelData(0);
            const sampleRate = audioBuffer.sampleRate;
            const duration = audioBuffer.duration;
            
            const blocksCount = Math.ceil(duration);
            const samplesPerBlock = sampleRate; // 1 second block size
            
            for (let i = 0; i < blocksCount; i++) {
                const start = i * samplesPerBlock;
                const end = Math.min(start + samplesPerBlock, channelData.length);
                
                let sumSq = 0;
                for (let j = start; j < end; j++) {
                    sumSq += channelData[j] * channelData[j];
                }
                const rms = Math.sqrt(sumSq / (end - start));
                energyData.push(rms);
                if (rms > maxEnergy) maxEnergy = rms;
            }
            
            // If flat line (completely muted video track or silent background)
            if (maxEnergy < 0.002) {
                console.info("Audio track detected as completely silent.");
                hasAudio = false;
            }
        } else {
            hasAudio = false;
        }
        
        // Remove previous silent track overlay if present
        const oldOverlay = audioTrack.querySelector('.silent-track-overlay');
        if (oldOverlay) oldOverlay.remove();
        
        if (hasAudio) {
            drawAudioWaveform(energyData, maxEnergy);
            generateHighlightAnalysis(energyData, maxEnergy);
            emotionsArray = analyzeEmotions(energyData, maxEnergy);
        } else {
            // Silent Mode timeline adaptations:
            // 1. Draw flat center line on audio waveform canvas
            const width = motionActivityData.length * PIXELS_PER_SECOND;
            const height = audioTrack.clientHeight;
            audioCanvas.width = width;
            audioCanvas.height = height;
            const ctx = audioCanvas.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.stroke();
            
            // 2. Append silent track glassmorphic overlay inside timeline audio container
            const overlay = document.createElement('div');
            overlay.className = 'silent-track-overlay';
            overlay.innerHTML = `
                <div class="silent-track-text">
                    <span class="silent-track-dot"></span>
                    🔇 環境音なし - 映像・動き解析モード作動中
                </div>
            `;
            audioTrack.appendChild(overlay);
            
            // 3. Drive excitement levels directly using actual pixel motion values!
            generateHighlightAnalysis([], 1.0);
            emotionsArray = analyzeEmotions([], 1.0);
        }
        
        // Draw timeline SFX recommended icons
        drawSFXTrack(emotionsArray);
        
        // Formulate Advice list cards and recommended BGM player configurations
        generateAIAdvice(currentVideoDuration);
        
        document.getElementById('status-badge').innerText = 'Analysis Complete';
        setTimeout(() => {
            document.getElementById('overlay-info').classList.add('hidden');
        }, 1500);
        
    } catch (err) {
        console.error("Multimodal analysis orchestration failed:", err);
        statusBadge.innerText = 'Analysis Failed';
        statusBadge.style.color = 'var(--highlight-high)';
    } finally {
        isAnalyzing = false;
    }
}

function drawAudioWaveform(energyData, maxEnergy) {
    const width = energyData.length * PIXELS_PER_SECOND;
    const height = audioTrack.clientHeight;
    
    audioCanvas.width = width;
    audioCanvas.height = height;
    
    const ctx = audioCanvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    
    // Draw center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.stroke();
    
    ctx.fillStyle = 'var(--accent-color)';
    
    energyData.forEach((energy, i) => {
        const normalized = energy / maxEnergy;
        const barHeight = Math.max(2, normalized * height * 0.9);
        
        const x = i * PIXELS_PER_SECOND;
        const y = (height - barHeight) / 2;
        
        ctx.fillRect(x, y, PIXELS_PER_SECOND - 1, barHeight);
    });
}

function generateHighlightAnalysis(energyData, maxEnergy) {
    analysisTrack.innerHTML = '';
    
    const dataToUse = hasAudio ? energyData : motionActivityData;
    const maxVal = hasAudio ? maxEnergy : 1.0;
    
    // Excitement thresholds: High, Medium, Normal
    const highThreshold = maxVal * 0.45; 
    const midThreshold = maxVal * 0.15;
    
    dataToUse.forEach((val, i) => {
        const block = document.createElement('div');
        block.className = 'analysis-block';
        block.style.width = `${PIXELS_PER_SECOND}px`;
        
        let level = 'low';
        if (val > highThreshold) {
            level = 'high';
        } else if (val > midThreshold) {
            level = 'mid';
        }
        
        block.classList.add(level);
        
        let trackMode = hasAudio ? '音声エネルギー' : '映像の動き';
        let percentage = (val / maxVal * 100).toFixed(0);
        let statusText = level === 'high' ? '盛り上がり: 高' : (level === 'mid' ? '中' : '通常');
        
        block.title = `${formatTime(i)} - ${trackMode}: ${percentage}% (${statusText})`;
        
        analysisTrack.appendChild(block);
    });
}

// ----------------------------------------------------
// SFX Track Rendering
// ----------------------------------------------------
function drawSFXTrack(emotions) {
    sfxTrack.innerHTML = '';
    
    emotions.forEach((emotion, i) => {
        const block = document.createElement('div');
        block.className = 'sfx-block';
        block.style.width = `${PIXELS_PER_SECOND}px`;
        block.dataset.emotion = emotion;
        block.dataset.index = i;
        
        const config = EMOTIONS[emotion];
        block.innerHTML = `<span>${config.icon}</span>`;
        block.title = `${formatTime(i)} - ${config.label}: ${config.sfx}`;
        
        block.addEventListener('click', (e) => {
            e.stopPropagation();
            selectSFXBlock(i);
        });
        
        sfxTrack.appendChild(block);
    });
}

function selectSFXBlock(index) {
    const prevSelected = sfxTrack.querySelector('.sfx-block.selected');
    if (prevSelected) prevSelected.classList.remove('selected');
    
    selectedBlockIndex = index;
    const block = sfxTrack.children[index];
    if (block) block.classList.add('selected');
    
    inspectorPanel.classList.remove('hidden');
    inspectorTime.innerText = formatTime(index);
    
    const emotion = emotionsArray[index];
    const config = EMOTIONS[emotion];
    
    inspectorSfxName.innerText = `${config.sfx} (${config.desc})`;
    
    emotionGridButtons.forEach(btn => {
        if (btn.dataset.emotion === emotion) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Highlight matching AI Advice card in the container list
    if (aiAdviceList) {
        const matchingCard = aiAdviceList.querySelector(`.ai-advice-card[data-index="${index}"]`);
        aiAdviceList.querySelectorAll('.ai-advice-card').forEach(c => c.classList.remove('active'));
        if (matchingCard) {
            matchingCard.classList.add('active');
            matchingCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    mainVideo.currentTime = index;
    playSynthSFX(emotion);
}

// ----------------------------------------------------
// SFX Inspector Control Logic
// ----------------------------------------------------
function setupInspectorHandlers() {
    closeInspectorBtn.addEventListener('click', () => {
        // Hide inspector panel on close
        inspectorPanel.classList.add('hidden');
        const prevSelected = sfxTrack.querySelector('.sfx-block.selected');
        if (prevSelected) prevSelected.classList.remove('selected');
        selectedBlockIndex = null;
    });
    
    playSfxBtn.addEventListener('click', () => {
        if (selectedBlockIndex !== null) {
            const emotion = emotionsArray[selectedBlockIndex];
            playSynthSFX(emotion);
        }
    });
    
    emotionGridButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedBlockIndex === null) return;
            
            const newEmotion = btn.dataset.emotion;
            emotionsArray[selectedBlockIndex] = newEmotion;
            
            playSynthSFX(newEmotion);
            
            emotionGridButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const config = EMOTIONS[newEmotion];
            inspectorSfxName.innerText = `${config.sfx} (${config.desc})`;
            
            const block = sfxTrack.children[selectedBlockIndex];
            if (block) {
                block.dataset.emotion = newEmotion;
                block.innerHTML = `<span>${config.icon}</span>`;
                block.title = `${formatTime(selectedBlockIndex)} - ${config.label}: ${config.sfx}`;
            }
            
            // If AI advice exists at this point, update card tags
            if (aiAdviceList) {
                const card = aiAdviceList.querySelector(`.ai-advice-card[data-index="${selectedBlockIndex}"]`);
                if (card) {
                    const tag = card.querySelector('.ai-advice-tag');
                    if (tag) {
                        const titlePrefix = card.innerText.split(' ')[0] || "🎈 効果音の推奨";
                        tag.innerText = `${titlePrefix} (${config.icon} ${config.label})`;
                    }
                }
            }
        });
    });
}

// ----------------------------------------------------
// Inspector Tabs switching logic
// ----------------------------------------------------
function setupTabHandlers() {
    tabManual.addEventListener('click', () => {
        tabManual.classList.add('active');
        tabAi.classList.remove('active');
        tabContentManual.classList.remove('hidden');
        tabContentAi.classList.add('hidden');
    });

    tabAi.addEventListener('click', () => {
        tabAi.classList.add('active');
        tabManual.classList.remove('active');
        tabContentAi.classList.remove('hidden');
        tabContentManual.classList.add('hidden');
    });
}

// ----------------------------------------------------
// Thumbnail Extraction
// ----------------------------------------------------
function extractThumbnails(videoUrl, duration) {
    const hiddenVideo = document.createElement('video');
    hiddenVideo.src = videoUrl;
    hiddenVideo.crossOrigin = "anonymous";
    hiddenVideo.muted = true;
    
    hiddenVideo.onloadedmetadata = () => {
        const ratio = hiddenVideo.videoWidth / hiddenVideo.videoHeight;
        const thumbHeight = 60; // Fixed height in track
        const thumbWidth = thumbHeight * ratio;
        
        thumbnailCanvas.width = thumbWidth;
        thumbnailCanvas.height = thumbHeight;
        
        const numberOfThumbs = Math.ceil(duration / SECONDS_PER_THUMBNAIL);
        let currentThumb = 0;
        
        const extractNext = () => {
            if (currentThumb >= numberOfThumbs) return; // Done
            
            const time = currentThumb * SECONDS_PER_THUMBNAIL;
            hiddenVideo.currentTime = time;
        };
        
        hiddenVideo.addEventListener('seeked', () => {
            ctxThumb.drawImage(hiddenVideo, 0, 0, thumbWidth, thumbHeight);
            
            const imgUrl = thumbnailCanvas.toDataURL('image/jpeg', 0.6);
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'video-thumb';
            img.style.width = `${SECONDS_PER_THUMBNAIL * PIXELS_PER_SECOND}px`;
            
            videoTrack.appendChild(img);
            
            currentThumb++;
            extractNext();
        });
        
        extractNext(); // Start
    };
}

// Start
init();
