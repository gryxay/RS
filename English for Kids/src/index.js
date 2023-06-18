/* eslint-disable */
import images from './mainImages.js';
import cards from './cards.js';
/* eslint-enable */

const App = {
  state: {
    category: 'Main',
  },

  init() {
    if (this.state.category === 'Main') {
      const cardArr = document.querySelectorAll('.card-body');

      /* eslint-disable */

      cardArr.forEach((el, index) => {
        el.style.backgroundImage = `url('${images[index].img}')`;
      });
      
      /* eslint-enable */
    }

    document.querySelector('#container').addEventListener('click', (e) => {
      if (this.state.category === 'Main') {
        if (e.target.classList.contains('card-header')) {
          App.state.category = e.target.innerHTML;
          App.toggleCategory();
        } else if (e.target.classList.contains('card-body')) {
          App.state.category = e.target.parentElement.children[0].innerHTML;
          App.toggleCategory();
        }
      }
    });

    document.querySelector('ul.sidebarMenuInner').addEventListener('click', (e) => {
      App.state.category = e.target.innerHTML;
      App.toggleCategory();
    });
  },

  toggleCategory() {
    const cardArr = document.querySelectorAll('.card-body');
    /* eslint-disable */

    if (this.state.category === 'Main') {
      cardArr.forEach((el, i) => {
        el.parentElement.children[0].innerHTML = images[i].category;
        el.style.backgroundImage = `url('${images[i].img}')`;
        el.parentElement.children[1].removeChild(el.children[0]);
        this.state.rotate = false;
      })
    } else {
      const index = cards[0].indexOf(this.state.category) + 1;

      cardArr.forEach((el, i) => {
        el.parentElement.children[0].innerHTML = cards[index][i].word;
        el.style.backgroundImage = `url('${cards[index][i].image}')`;

        if (!this.state.rotate) {
          const rotateDiv = document.createElement('div');
          rotateDiv.classList.add('rotate');

          const rotateImg = document.createElement('img');
          rotateImg.src = './img/rotate.svg';
          rotateImg.classList.add('rotate');
          rotateDiv.appendChild(rotateImg);

          el.appendChild(rotateDiv);
        }
      });
    }
  },

  /* eslint-enable */

};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
