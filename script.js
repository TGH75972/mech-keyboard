const keys = document.querySelectorAll('.key');
const inputField = document.getElementById('input-field');
let isKeyDown = {};
let capsLockActive = false;
let shiftActive = false;
let glowActive = false;
let currentGlowColor = 'rgba(128, 0, 128, 0.9)';

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

const winKey = document.getElementById('win-key');
winKey.addEventListener('mousedown', () => {
    playRickrollVideo();
});

function handleVirtualKeyPress(keyText) {
    if (isKeyDown[keyText]) return;
    isKeyDown[keyText] = true;

    switch (keyText) {
        case 'CapsLock':
            toggleCapsLock();
            playKeySound('capslock');
            break;
        case 'Shift':
            toggleShift();
            playKeySound('shift');
            break;
        case ' ':
            playKeySound('spacebar');
            inputField.value += ' ';
            break;
        case 'Backspace':
            playKeySound('del');
            inputField.value = inputField.value.slice(0, -1);
            break;
        case 'Enter':
            playKeySound('enter');
            openGoogleSearch();
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
    shiftActive = true;
    const shiftKey = document.querySelector('.shift-key');
    shiftKey.classList.add('active');

    setTimeout(() => {
        shiftKey.classList.remove('active');
    }, 100);
}

function playKeySound(soundType) {
    let audioFile;

    switch (soundType) {
        case 'capslock':
        case 'shift':
            audioFile = 'keypress.mp3';
            break;
        case 'spacebar':
            audioFile = 'spacebar.mp3';
            break;
        case 'enter':
            audioFile = 'enter.mp3';
            break;
        case 'del':
            audioFile = 'del.mp3';
            break;
        case 'keypress':
            audioFile = 'keypress.mp3';
            break;
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

inputField.focus();

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

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.9)`;
}
