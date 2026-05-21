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

let audioContext = null;
let currentVideoDuration = 0;
let isAnalyzing = false;
let emotionsArray = []; // Holds the emotion string for each second of the video
let selectedBlockIndex = null; // Currently selected timeline block index

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
    
    // Switch UI view
    uploadPlaceholder.classList.add('hidden');
    videoContainer.classList.remove('hidden');
    
    mainVideo.src = videoUrl;
    
    // Show analyzing badge
    const overlay = document.getElementById('overlay-info');
    overlay.classList.remove('hidden');
    statusBadge.innerText = 'Analyzing Video & Audio...';
    statusBadge.style.color = '#fff';
    
    mainVideo.onloadedmetadata = () => {
        currentVideoDuration = mainVideo.duration;
        setupTimeline(currentVideoDuration);
        
        // Start Analysis
        analyzeAudio(file);
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
        
        // If we clicked inside the SFX track, handle it separately
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
    
    // Create master volume node to prevent clipping and fade out cleanly
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.25, now); // Reasonable master volume
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
        
        // Vibrato
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
        // "😳 照れ" -> Soft vibraphone bubble pop
        const freqs = [293.66, 349.23, 440.00]; // D4, F4, A4
        freqs.forEach((freq, idx) => {
            const delay = idx * 0.08;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + delay);
            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(0.4, now + delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(now);
            osc.stop(now + delay + 0.22);
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
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(now);
        osc.stop(now + 0.25);
        
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
// AI Simulation Heuristics: Emotion Classifier
// ----------------------------------------------------
function analyzeEmotions(energyData, maxEnergy) {
    const duration = energyData.length;
    const computedEmotions = new Array(duration).fill(null);
    
    const highThreshold = maxEnergy * 0.55; 
    const midThreshold = maxEnergy * 0.25;
    
    for (let i = 0; i < duration; i++) {
        const energy = energyData[i];
        const prevEnergy = i > 0 ? energyData[i - 1] : 0;
        const nextEnergy = i < duration - 1 ? energyData[i + 1] : 0;
        
        // 1. "驚き" (Surprise) -> Sudden loud spike in volume
        if (energy > highThreshold && energy > prevEnergy * 1.7) {
            computedEmotions[i] = 'surprise';
        }
        // 2. "落胆" (Disappointment) -> Drop to silent block right after a high block
        else if (energy < midThreshold && prevEnergy > highThreshold) {
            computedEmotions[i] = 'disappointment';
        }
        // 3. "笑い" (Laughter) -> Constant medium-high rhythmic block
        else if (energy > midThreshold && energy <= highThreshold && prevEnergy > midThreshold && nextEnergy > midThreshold) {
            computedEmotions[i] = 'laughter';
        }
        // 4. "ひらめき" (Inspiration) -> Rising from quiet state
        else if (energy > midThreshold && prevEnergy < midThreshold * 0.4) {
            computedEmotions[i] = 'inspiration';
        }
        // 5. "疑問" (Question) -> Slight fluctuation in low-medium energy
        else if (energy > midThreshold * 0.4 && energy < midThreshold && Math.abs(energy - prevEnergy) > maxEnergy * 0.04) {
            computedEmotions[i] = 'question';
        }
        // 6. "照れ" (Shyness) -> Very low constant energy
        else {
            if (energy < midThreshold * 0.3) {
                computedEmotions[i] = 'shyness';
            } else {
                // Distribute fallback emotions to keep UI interesting
                const indexPattern = ['shyness', 'question', 'inspiration', 'shyness', 'question', 'inspiration'];
                computedEmotions[i] = indexPattern[(i * 7) % indexPattern.length];
            }
        }
    }
    
    return computedEmotions;
}

// ----------------------------------------------------
// Core Feature: Audio Analysis for "Excitement" & SFX
// ----------------------------------------------------
async function analyzeAudio(file) {
    isAnalyzing = true;
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const channelData = audioBuffer.getChannelData(0); // Use first channel
        const sampleRate = audioBuffer.sampleRate;
        const duration = audioBuffer.duration;
        
        // 1 block per second
        const blocksCount = Math.ceil(duration);
        const samplesPerBlock = sampleRate; // 1 second of samples
        
        const energyData = [];
        let maxEnergy = 0;
        
        // Calculate RMS for each 1-second block
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
        
        drawAudioWaveform(energyData, maxEnergy);
        generateHighlightAnalysis(energyData, maxEnergy);
        
        // Core extension: generate and draw emotions array
        emotionsArray = analyzeEmotions(energyData, maxEnergy);
        drawSFXTrack(emotionsArray);
        
        document.getElementById('status-badge').innerText = 'Analysis Complete';
        setTimeout(() => {
            document.getElementById('overlay-info').classList.add('hidden');
        }, 2000);
        
    } catch (err) {
        console.error("Audio analysis failed:", err);
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
        // Normalize energy
        const normalized = energy / maxEnergy;
        const barHeight = Math.max(2, normalized * height * 0.9);
        
        const x = i * PIXELS_PER_SECOND;
        const y = (height - barHeight) / 2;
        
        ctx.fillRect(x, y, PIXELS_PER_SECOND - 1, barHeight);
    });
}

function generateHighlightAnalysis(energyData, maxEnergy) {
    analysisTrack.innerHTML = '';
    
    // Thresholds for excitement (heuristic)
    const highThreshold = maxEnergy * 0.6; 
    const midThreshold = maxEnergy * 0.3;
    
    energyData.forEach((energy, i) => {
        const block = document.createElement('div');
        block.className = 'analysis-block';
        block.style.width = `${PIXELS_PER_SECOND}px`;
        
        let level = 'low';
        if (energy > highThreshold) {
            level = 'high';
        } else if (energy > midThreshold) {
            level = 'mid';
        }
        
        block.classList.add(level);
        
        // Add tooltip
        let label = level === 'high' ? 'High Excitement' : (level === 'mid' ? 'Medium Energy' : 'Normal');
        block.title = `${formatTime(i)} - ${label}`;
        
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
    // Clear previous selection
    const prevSelected = sfxTrack.querySelector('.sfx-block.selected');
    if (prevSelected) prevSelected.classList.remove('selected');
    
    selectedBlockIndex = index;
    const block = sfxTrack.children[index];
    if (block) block.classList.add('selected');
    
    // Open Inspector and sync data
    inspectorPanel.classList.remove('hidden');
    inspectorTime.innerText = formatTime(index);
    
    const emotion = emotionsArray[index];
    const config = EMOTIONS[emotion];
    
    inspectorSfxName.innerText = `${config.sfx} (${config.desc})`;
    
    // Update active button state in Inspector grid
    emotionGridButtons.forEach(btn => {
        if (btn.dataset.emotion === emotion) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Seek video and play synth sound
    mainVideo.currentTime = index;
    playSynthSFX(emotion);
}

// ----------------------------------------------------
// SFX Inspector Control Logic
// ----------------------------------------------------
function setupInspectorHandlers() {
    closeInspectorBtn.addEventListener('click', () => {
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
            
            // Play sound instantly
            playSynthSFX(newEmotion);
            
            // Update active states
            emotionGridButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update label
            const config = EMOTIONS[newEmotion];
            inspectorSfxName.innerText = `${config.sfx} (${config.desc})`;
            
            // Re-render single block on the timeline for instant visual feedback
            const block = sfxTrack.children[selectedBlockIndex];
            if (block) {
                block.dataset.emotion = newEmotion;
                block.innerHTML = `<span>${config.icon}</span>`;
                block.title = `${formatTime(selectedBlockIndex)} - ${config.label}: ${config.sfx}`;
            }
        });
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
        // Calculate dimensions
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
            // Width is how much time it represents
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
