import ComponentHandler from './abstract/index.js';
import { racingWrapper } from '../services.js';
import * as Helpers from '../helpers/index.js';

const template = /*html*/ `
<section class="d-flex justify-center mt-5 hidden"></section>`;

// prettier-ignore
const panel = cars => /*html*/ `
<div class="mt-4 d-flex">${cars.map(car => `
  <div class="mr-2" id="${car.name}">
    <div class="car-player">${car.name}</div>
    ${spinner}
  </div>`).join('')}
</div>`;

const spinner = /*html*/ `
<div class="d-flex justify-center mt-3">
  <div class="relative spinner-container">
    <span class="material spinner"></span>
  </div>
</div>`;

export default class GameSection extends ComponentHandler {
  #cars;

  constructor() {
    super();
    this.insertAdjacentElement('afterbegin', Helpers.$element(template));
  }

  start() {
    const tryCount = this.getAttribute('try-count');
    const cars = this.#cars;

    // prettier-ignore
    this.process(
      Helpers.pipe(
        racingWrapper,
        window.requestAnimationFrame
      ),
      {
        store: this.store,
        cars,
        tryCount,
      },
    );
  }

  static get observedAttributes() {
    return ['try-count'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!newValue) return this.firstElementChild.classList.add('hidden');

    // prettier-ignore
    this.#cars = this.process(
      Helpers.pipe(
        Helpers.split,
        carNames => carNames.map(carName => ({ name: carName, moveCount: 0 }))
      ),
      this.getAttribute('car-names'),
    );

    this.firstElementChild.classList.remove('hidden');
    this.firstElementChild.insertAdjacentElement('afterbegin', Helpers.$element(panel(this.#cars)));

    this.start();
  }
}

customElements.define('game-section', GameSection);
