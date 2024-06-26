const keys = document.querySelectorAll('.key');
const inputField = document.getElementById('input-field');
let isKeyDown = {};
let capsLockActive = false;
let shiftActive = false;
let glowActive = false;
let currentGlowColor = 'rgba(128, 0, 128, 0.9)';
let currentCtrlMode = 'copy';

inputField.addEventListener('keydown', event => {
    event.preventDefault();
});

keys.forEach(key => {
    key.addEventListener('mousedown', () => handleVirtualKeyPress(key.dataset.key));
    key.addEventListener('mouseup', () => handleVirtualKeyRelease(key.dataset.key));
    key.addEventListener('mouseleave', () => handleVirtualKeyRelease(key.dataset.key));
});

const fnKey = document.querySelector('.fn-key');
fnKey.addEventListener('mousedown', () => {
    playKeySound('keypress');
    toggleFnKey();
});

const winKey = document.querySelector('.win-key');
winKey.addEventListener('mousedown', () => {
    playKeySound('default');
    playRickrollVideo();
});

const modeKey = document.querySelector('.mode-key');
modeKey.addEventListener('mousedown', () => {
    playKeySound('mode');
    toggleMode();
});

const ctrlKey = document.querySelector('.ctrl-key');
ctrlKey.addEventListener('mousedown', () => {
    playKeySound('ctrl');
    toggleCtrl();
});

function handleVirtualKeyPress(keyText) {
    if (isKeyDown[keyText]) return;
    isKeyDown[keyText] = true;

    switch (keyText) {
        case 'CapsLock':
            playKeySound('default');
            toggleCapsLock();
            break;
        case 'Shift':
            playKeySound('default');
            toggleShift();
            break;
        case ' ':
            inputField.value += ' ';
            playKeySound('spacebar');
            break;
        case 'Backspace':
            inputField.value = inputField.value.slice(0, -1);
            playKeySound('del');
            break;
        case 'Enter':
            openGoogleSearch();
            playKeySound('enter');
            break;
        case '\\':
            inputField.value += '\\';
            playKeySound('default');
            break;
        default:
            if (/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]$/.test(keyText)) {
                if (/^[a-zA-Z]$/.test(keyText)) {
                    if (capsLockActive || shiftActive) {
                        inputField.value += keyText.toUpperCase();
                        shiftActive = false;
                    } else {
                        inputField.value += keyText.toLowerCase();
                    }
                } else {
                    inputField.value += keyText;
                }
                playKeySound('default');
            }
            break;
    }
}

function handleVirtualKeyRelease(keyText) {
    isKeyDown[keyText] = false;
}

function toggleCapsLock() {
    capsLockActive = !capsLockActive;
    const capsLockKey = document.querySelector('.capslock-key');
    capsLockKey.classList.toggle('active', capsLockActive);
    const letters = document.querySelectorAll('.key[data-key]');
    letters.forEach(letter => {
        const keyText = letter.dataset.key;
        if (/^[a-zA-Z]$/.test(keyText)) {
            letter.textContent = capsLockActive ? keyText.toUpperCase() : keyText.toLowerCase();
        }
    });
}

function toggleShift() {
    shiftActive = !shiftActive;
    const shiftKeys = document.querySelectorAll('.shift-key');
    shiftKeys.forEach(key => {
        key.classList.toggle('active', shiftActive);
    });
}

function playKeySound(soundType) {
    let audioFile;
    switch (soundType) {
        case 'capslock':
        case 'shift':
        case 'ctrl':
        case 'mode':
        case 'spacebar':
            audioFile = 'keypress.mp3';
            break;
        case 'enter':
            audioFile = 'enter.mp3';
            break;
        case 'del':
            audioFile = 'del.mp3';
            break;
        case 'keypress':
        default:
            audioFile = 'keypress.mp3';
            break;
    }
    const audio = new Audio(audioFile);
    audio.play();
}

function openGoogleSearch() {
    const inputText = inputField.value.trim();
    if (inputText) {
        const query = encodeURIComponent(inputText);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
        inputField.value = '';
    }
}

function playRickrollVideo() {
    const rickrollURL = 'https://youtu.be/xvFZjo5PgG0?si=SK_Pi3gtN1lN14yz';
    const newWindow = window.open(rickrollURL, '_blank');
    if (newWindow) {
        newWindow.focus();
    } else {
        alert('Popup blocked! Please enable popups for this site to watch the video.');
    }
}

function toggleFnKey() {
    glowActive = !glowActive;
    currentGlowColor = getRandomColor();
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (glowActive) {
            key.style.animation = `glow 1.5s ease-in-out infinite alternate`;
            key.style.setProperty('--glow-color', currentGlowColor);
        } else {
            key.style.animation = '';
            key.style.boxShadow = '';
        }
    });
}

function toggleMode() {
    if (currentCtrlMode === 'copy') {
        currentCtrlMode = 'paste';
    } else {
        currentCtrlMode = 'copy';
    }
    alert(`Current mode: ${currentCtrlMode}`);
}

function toggleCtrl() {
    switch (currentCtrlMode) {
        case 'copy':
            copyText();
            break;
        case 'paste':
            pasteText();
            break;
        default:
            break;
    }
}

function copyText() {
    inputField.select();
    document.execCommand('copy');
    playKeySound('ctrl');
}

function pasteText() {
    navigator.clipboard.readText().then(text => {
        inputField.value += text;
        playKeySound('ctrl');
    }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.9)`;
}

inputField.focus();
