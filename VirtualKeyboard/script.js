// eslint-disable-next-line
import keyLayout from './keyArray.js';
// import doesn't work without the file extension added, so disabled eslint for one line

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    textarea: null,
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    language: sessionStorage.getItem('language') === null ? 'EN' : sessionStorage.getItem('language'),
  },

  init() {
    // Create text area
    const textarea = document.createElement('textarea');
    document.getElementsByTagName('body')[0].appendChild(textarea);
    textarea.classList.add('use-keyboard-input');
    textarea.autofocus = true;
    this.elements.textarea = document.querySelector('textarea');

    const div = document.createElement('div');
    div.setAttribute('id', 'changeLanguage');
    document.getElementsByTagName('body')[0].appendChild(div);
    div.appendChild(document.createElement('h2'));
    div.firstChild.innerHTML = 'Change language: shift(hold) + ctrl';

    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboardKeys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboardKey');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    /* eslint-disable no-param-reassign */
    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
    /* eslint-enable no-param-reassign */

    document.querySelector('textarea').addEventListener('keydown', function textAreaEvent(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        this.value = `${this.value.substring(0, this.selectionStart)}\t${this.value.substring(this.selectionEnd)}`;
        this.selectionStart = this.selectionEnd;
        this.selectionEnd = this.selectionStart + 1;
      }
    });

    /* eslint-disable no-param-reassign */

    document.onkeydown = (e) => {
      if (document.querySelector(`#${e.code}`).style !== null) document.querySelector(`#${e.code}`).style.backgroundColor = '#300C17';
      document.querySelector('textarea').focus();
      switch (e.key) {
        case 'Alt':
        case 'Meta':
        case 'CapsLock':
        case 'Control':
        case 'Shift':
        case 'Delete':
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowRight':
          break;
        case 'Tab':
          Keyboard.properties.value += '\t';
          break;
        case 'Enter':
          Keyboard.properties.value += '\n';
          if (!(Keyboard.elements.textarea === document.activeElement)) document.querySelector('textarea').value = Keyboard.properties.value;
          break;
        case 'Backspace':
          Keyboard.properties.value = document.querySelector('textarea').value
            .substring(0, document.querySelector('textarea').value.length - 1);
          if (!(Keyboard.elements.textarea === document.activeElement)) document.querySelector('textarea').value = Keyboard.properties.value;
          break;
        case 'Space':
          Keyboard.properties.value += ' ';
          if (!(Keyboard.elements.textarea === document.activeElement)) document.querySelector('textarea').value = Keyboard.properties.value;
          break;
        default:
          if (Keyboard.properties.language === 'LT') {
            if (document.querySelector(`#${e.code}`).dataset.tertiary) {
              if (Keyboard.properties.shift || Keyboard.properties.capsLock) {
                Keyboard.elements.textarea.value += document.querySelector(`#${e.code}`).dataset.tertiary.toUpperCase();
                Keyboard.properties.value += document.querySelector(`#${e.code}`).dataset.tertiary.toUpperCase();
              } else {
                Keyboard.elements.textarea.value += document.querySelector(`#${e.code}`).dataset.tertiary;
                Keyboard.properties.value += document.querySelector(`#${e.code}`).dataset.tertiary;
              }
              e.preventDefault();
            } else Keyboard.properties.value += e.key;
          } else Keyboard.properties.value += e.key;
          if (!(Keyboard.elements.textarea === document.activeElement)) document.querySelector('textarea').value = Keyboard.properties.value;
      }

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!Keyboard.properties.shift) Keyboard.toggleShift();
      }
    };

    document.onkeyup = (e) => {
      document.querySelector(`#${e.code}`).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      if (e.code === 'CapsLock') {
        Keyboard.toggleCapsLock();
        if (document.querySelector(`#${e.code}`).style !== null) document.querySelector(`#${e.code}`).classList.toggle('keyboardKey--active', Keyboard.properties.capsLock);
      }

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        Keyboard.toggleShift();
      }
      if ((e.code === 'ControlLeft' || e.code === 'ControlRight') && Keyboard.properties.shift) {
        Keyboard.toggleLanguage();
      }
    };
  },
  /* eslint-enable no-param-reassign */

  createIconHTML(iconName) {
    return `<i class="material-icons">${iconName}</i>`;
  },

  createKeys() {
    const fragment = document.createDocumentFragment();

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['Backspace', 'Delete', 'Enter', 'ShiftRight'].indexOf(key.code) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboardKey');
      keyElement.id = key.code;

      keyElement.dataset.primary = key.key;
      if (key.secondary) keyElement.dataset.secondary = key.secondary;
      if (key.tertiary) keyElement.dataset.tertiary = key.tertiary;

      switch (key.key) {
        case 'backspace':
          keyElement.classList.add('keyboardKey--wide');
          keyElement.innerHTML = this.createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            Keyboard.elements.textarea.value = Keyboard.properties.value;
            const start = this.elements.textarea.selectionStart;
            this.properties.value = `${this.elements.textarea.value.substring(0, start - 1)}${this.elements.textarea.value.substring(start, this.elements.textarea.value.length)}`;
            this.triggerEvent('oninput');
            this.elements.textarea.selectionStart = start - 1;
            this.elements.textarea.selectionEnd = start - 1;
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboardKey--wide', 'keyboardKey--activatable');
          keyElement.innerHTML = this.createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboardKey--active', this.properties.capsLock);
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboardKey--wide');
          keyElement.innerHTML = this.createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            Keyboard.elements.textarea.value = Keyboard.properties.value;
            this.properties.value += '\n';
            this.triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboardKey--extra-wide');
          keyElement.innerHTML = this.createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            Keyboard.elements.textarea.value = Keyboard.properties.value;
            this.properties.value += ' ';
            this.triggerEvent('oninput');
          });
          break;

        case 'shift':
          keyElement.textContent = key.key.toLowerCase();

          keyElement.addEventListener('click', () => {
            Keyboard.elements.textarea.value = Keyboard.properties.value;
            this.toggleShift();
            this.triggerEvent('oninput');
          });
          break;

        case 'tab':
          keyElement.textContent = key.key.toLowerCase();

          keyElement.addEventListener('click', () => {
            Keyboard.elements.textarea.value = Keyboard.properties.value;
            this.properties.value += '\t';
            this.triggerEvent('oninput');
          });
          break;

        case 'del':
          keyElement.textContent = key.key.toLowerCase();

          keyElement.addEventListener('click', () => {
            Keyboard.elements.textarea.value = Keyboard.properties.value;
            const start = this.elements.textarea.selectionStart;
            this.properties.value = `${this.elements.textarea.value.substring(0, start)}${this.elements.textarea.value.substring(start + 1, this.elements.textarea.value.length)}`;
            this.triggerEvent('oninput');
            this.elements.textarea.selectionStart = start;
            this.elements.textarea.selectionEnd = start;
          });
          break;

        case 'ctrl':
          keyElement.textContent = key.key.toLowerCase();

          keyElement.addEventListener('click', () => {
            Keyboard.elements.textarea.value = Keyboard.properties.value;
            if (Keyboard.properties.shift) {
              this.toggleLanguage();
              this.toggleShift();
            }
          });
          break;

        case 'alt':
        case 'win':
          keyElement.textContent = key.key.toLowerCase();

          keyElement.addEventListener('click', () => {
            Keyboard.elements.textarea.value = Keyboard.properties.value;
            this.properties.value = this.elements.textarea.value;
            this.triggerEvent('oninput');
          });
          break;

        default:
          if (this.properties.language === 'LT' && key.tertiary) keyElement.textContent = key.tertiary;
          else keyElement.textContent = key.key.toLowerCase();

          keyElement.addEventListener('click', () => {
            if (this.properties.language === 'LT' && key.tertiary) {
              if (this.properties.capsLock || this.properties.shift) {
                this.properties.value += key.tertiary.toUpperCase();
              } else this.properties.value += key.tertiary;
            } else {
              this.properties.value += this.properties
                .capsLock ? key.key.toUpperCase() : key.key.toLowerCase();
            }
            this.triggerEvent('oninput');
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
      document.querySelector('textarea').focus();
    }
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    /* eslint-disable no-param-reassign */

    this.elements.keys.forEach((key) => {
      if (key.childElementCount === 0) {
        if (this.properties.capsLock) {
          switch (key.textContent) {
            case 'shift':
            case 'ctrl':
            case 'win':
            case 'alt':
            case 'tab':
              break;
            case 'v':
              if (key.id === 'ArrowDown') break;
            // eslint-disable-next-line
            default:
              key.textContent = key.textContent.toUpperCase();
          }
        } else {
          key.textContent = key.textContent.toLowerCase();
        }
      }
    });
  },

  toggleShift() {
    this.properties.shift = !this.properties.shift;
    if (this.properties.language === 'EN') {
      this.elements.keys.forEach((key) => {
        if (this.properties.shift) {
          if (key.dataset.secondary) key.textContent = key.dataset.secondary;
        } else {
          switch (key.dataset.primary) {
            case 'backspace':
              key.innerHTML = this.createIconHTML('backspace');
              break;
            case 'enter':
              key.innerHTML = this.createIconHTML('keyboard_return');
              break;
            case 'space':
              key.innerHTML = this.createIconHTML('space_bar');
              break;
            case 'caps':
              key.innerHTML = this.createIconHTML('keyboard_capslock');
              break;
            default:
              key.textContent = key.dataset.primary;
          }
        }
      });
    } else {
      this.elements.keys.forEach((key) => {
        if (this.properties.shift) {
          if (key.dataset.primary === '`') key.textContent = '~';
          else if (key.dataset.tertiary
            && typeof key.dataset.tertiary === 'string') key.textContent = key.dataset.tertiary.toUpperCase();
        } else {
          switch (key.dataset.primary) {
            case 'backspace':
              key.innerHTML = this.createIconHTML('backspace');
              break;
            case 'enter':
              key.innerHTML = this.createIconHTML('keyboard_return');
              break;
            case 'space':
              key.innerHTML = this.createIconHTML('space_bar');
              break;
            case 'caps':
              key.innerHTML = this.createIconHTML('keyboard_capslock');
              break;
            default:
              if (key.dataset.tertiary) key.textContent = key.dataset.tertiary;
              else key.textContent = key.dataset.primary;
          }
        }
      });
    }
  },

  toggleLanguage() {
    Keyboard.properties.language = Keyboard.properties.language === 'EN' ? 'LT' : 'EN';
    sessionStorage.setItem('language', this.properties.language);
    if (this.properties.language === 'EN') {
      this.elements.keys.forEach((key) => {
        if (this.properties.shift) {
          if (key.dataset.tertiary) key.textContent = key.dataset.secondary;
        } else {
          switch (key.dataset.primary) {
            case 'backspace':
              key.innerHTML = this.createIconHTML('backspace');
              break;
            case 'enter':
              key.innerHTML = this.createIconHTML('keyboard_return');
              break;
            case 'space':
              key.innerHTML = this.createIconHTML('space_bar');
              break;
            case 'caps':
              key.innerHTML = this.createIconHTML('keyboard_capslock');
              break;
            default:
              key.textContent = key.dataset.primary;
          }
        }
      });
    } else {
      this.elements.keys.forEach((key) => {
        if (this.properties.shift) {
          if (key.dataset.tertiary) key.textContent = key.dataset.tertiary;
        } else {
          switch (key.dataset.primary) {
            case 'backspace':
              key.innerHTML = this.createIconHTML('backspace');
              break;
            case 'enter':
              key.innerHTML = this.createIconHTML('keyboard_return');
              break;
            case 'space':
              key.innerHTML = this.createIconHTML('space_bar');
              break;
            case 'caps':
              key.innerHTML = this.createIconHTML('keyboard_capslock');
              break;
            default:
              key.textContent = key.dataset.primary;
          }
        }
      });
    }
  },

  /* eslint-enable no-param-reassign */

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  },

};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.init();
});
