// Math Error Log - step 1
// Storage (all local, no external requests):
//   mel_children          : [{id, name}] child profiles (names used as labels only)
//   mel_apikeys           : {gemini, claude} API keys entered on this device
//   mel_child_<id>        : {wrongs: []} per-child wrong-answer data (filled in step 2)

const KEY_CHILDREN = 'mel_children';
const KEY_APIKEYS = 'mel_apikeys';
const childKey = (id) => 'mel_child_' + id;

const $ = (id) => document.getElementById(id);

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

let children = store.get(KEY_CHILDREN, null);
if (!children) {
  children = [
    { id: 'c1', name: '하준' },
    { id: 'c2', name: '하건' },
  ];
  store.set(KEY_CHILDREN, children);
}

let currentChild = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.toggle('active', s.id === id);
  });
}

function renderChildren() {
  const box = $('child-list');
  box.innerHTML = '';
  children.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'big child';
    btn.textContent = c.name;
    btn.addEventListener('click', () => openChild(c.id));
    box.appendChild(btn);
  });
}

function openChild(id) {
  currentChild = children.find((c) => c.id === id);
  if (!currentChild) return;
  const data = store.get(childKey(id), { wrongs: [] });
  $('home-title').textContent = currentChild.name + '의 오답노트';
  $('home-count').textContent = '저장된 오답: ' + data.wrongs.length + '개';
  showScreen('screen-home');
}

function openSettings() {
  const keys = store.get(KEY_APIKEYS, { gemini: '', claude: '' });
  $('key-gemini').value = keys.gemini || '';
  $('key-claude').value = keys.claude || '';
  $('save-msg').textContent = '';
  showScreen('screen-settings');
}

function saveKeys() {
  store.set(KEY_APIKEYS, {
    gemini: $('key-gemini').value.trim(),
    claude: $('key-claude').value.trim(),
  });
  $('save-msg').textContent = '이 기기에 저장되었습니다.';
}

$('btn-settings').addEventListener('click', openSettings);
$('btn-settings-back').addEventListener('click', () => showScreen('screen-child'));
$('btn-save-keys').addEventListener('click', saveKeys);
$('btn-back').addEventListener('click', () => showScreen('screen-child'));

renderChildren();
