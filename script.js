const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const setSpeedDisplay = (speed) => $('.slider-display').textContent = speed + 'ms';
const parsedLocation = simpleQueryString.parse(location.search);
const { msg, speed } = parsedLocation;

const abcArr = () => {
  return Array(26).fill().map((_, i) => {
    return String.fromCharCode('a'.charCodeAt(0) + i);
  });
}

const abcUC = abcArr().map(n => n.toUpperCase());
const nums = Array(10).fill(0).map((_, i) => i).join('');
const specialChars = '____.,:;÷®©#¥¢?|"!@-=+£$%^&*{}~<>[]()`';
const abc = [...abcArr(), ...abcUC, ...nums, ...specialChars];

const randomHex = () => {
  const maxHex = parseInt('ffffff', 16);
  const num = Math.floor(Math.random() * Math.floor(maxHex));
  return num.toString(16).padEnd(6, "6af");
}

const randomChar = () => {
  const randomNum = Math.floor(Math.random() * (abc.length - 1));
  return abc[randomNum];
}

let timerIdMouseEnter;

const initRandomiseOnMouseEnter = () => {
  $$('.text').forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      timerIdMouseEnter = setInterval(() => {
        item.innerText = randomChar();
      }, 25);
    });
    item.addEventListener('mouseleave', (e) => {
      item.innerText = e.currentTarget.id;
      clearInterval(timerIdMouseEnter);
    });
  });
}

const getRandomLetters = (current, destination) => {
  return current.map((item, index) => {
    if (item.letter !== destination[index]) {
      item.letter = randomChar();
      item.colour = randomHex();
    }
    const colour = item.letter == '_' ? 'transparent' : `#${item.colour}`;
    return `<span id="${item.letter}" style="--col:${colour}" class="text">${item.letter}</span>`;
  }).join('');
}

$('input[name=slider]').addEventListener('input', (e) => {
  setSpeedDisplay(e.target.value);
  if (timerId) {
    clearInterval(timerId);
  }
});

$('button[name=randomise]').addEventListener('click', (e) => {
  shuffle();
});

$('input[name=words]').addEventListener('keyup', (e) => {
  const inputText = e.target.value.trim();
  $('button[name=randomise]').disabled = !inputText.length;
  if (inputText.length && e.key && e.key.toUpperCase() == 'ENTER') {
    shuffle();
  }
});

let timerId;

const shuffle = () => {
  if (timerId) clearInterval(timerId);
  const selectedSpeed = $('.slider').value;
  const inputText = $('input[name=words]').value.trim().replace(/ /g, "_")
  const destination = Array.from(inputText);
  const current = Array(destination.length).fill('').map(item => {
    return { letter: item, colour: `#${randomHex()}` }
  });
  timerId = setInterval(() => {
    $('.normal').innerHTML = getRandomLetters(current, destination);
    $('.mirrored').innerHTML = $('.normal').innerHTML;
    if (current.map(item => item.letter).join('') == destination.join('')) {
      initRandomiseOnMouseEnter();
      clearInterval(timerId);
    }
  }, selectedSpeed);
}

$('input[name=words]').value = msg || '';
$('input[name=words]').focus();
$('button[name=randomise]').disabled = !(msg && msg.length);
const initialSpeed = Number(speed) || 50;
$('input[name=slider]').value = initialSpeed;
setSpeedDisplay(initialSpeed);
msg && shuffle();