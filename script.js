const keys = document.querySelectorAll('.key');
const inputField = document.getElementById('input-field');
let isKeyDown = {};
let capsLockActive = false;

inputField.addEventListener('keydown', event => {
    event.preventDefault();
});

keys.forEach(key => {
    key.addEventListener('mousedown', () => handleVirtualKeyPress(key.dataset.key));
    key.addEventListener('mouseup', () => handleVirtualKeyRelease(key.dataset.key));
    key.addEventListener('mouseleave', () => handleVirtualKeyRelease(key.dataset.key));
});

function handleVirtualKeyPress(keyText) {
    if (isKeyDown[keyText]) return;

    isKeyDown[keyText] = true;

    switch (keyText) {
        case 'CapsLock':
            toggleCapsLock();
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
        case 'Win':
            handleWindowsKey();
            break;
        default:
            if (/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]$/.test(keyText)) {
                if (/^[a-zA-Z]$/.test(keyText)) {
                    if (capsLockActive) {
                        inputField.value += keyText.toUpperCase();
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

function playKeySound(soundType) {
    let audioFile;

    switch (soundType) {
        case 'spacebar':
            audioFile = 'spacebar.mp3';
            break;
        case 'enter':
            audioFile = 'enter.mp3';
            break;
        case 'del':
            audioFile = 'del.mp3';
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

function handleWindowsKey() {
    window.open('https://www.example.com', '_blank');
}

inputField.focus();
