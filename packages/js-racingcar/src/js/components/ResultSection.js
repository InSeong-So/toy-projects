import ComponentHandler from './abstract/index.js';
import { renderResetArea } from '../services.js';
import * as Helpers from '../helpers/index.js';

const template = /*html*/ `
<section class="d-flex justify-center mt-5 hidden" name="result-section">
  <div>
    <h2>🏆 최종 우승자: <span id="winners"></span> 🏆</h2>
    <section class="d-flex justify-center hidden" id="game-reset-area">
      <button type="button" id="game-reset" class="btn btn-cyan">다시 시작하기</button>
    </section>
  </div>
</section>`;

export default class ResultSection extends ComponentHandler {
  #removeHandler;

  constructor() {
    super();
    this.insertAdjacentElement('afterbegin', Helpers.$element(template));
  }

  finishGame() {
    // prettier-ignore
    this.process(
      Helpers.pipe(
        Helpers.trimComma,
        renderResetArea,
      ),
      this.getAttribute('winners'),
    );
  }

  gameReset = event => {
    if (!event.target.matches('#game-reset')) return;
    this.dispatch('reset');
  };

  static get observedAttributes() {
    return ['winners'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!newValue) return this.firstElementChild.classList.add('hidden');

    this.firstElementChild.classList.remove('hidden');
    this.finishGame();
  }

  connectedCallback() {
    this.#removeHandler = this.bindHandler([
      {
        type: 'click',
        callback: this.gameReset,
      },
    ]);
  }

  disconnectedCallback() {
    this.#removeHandler();
  }
}

customElements.define('result-section', ResultSection);
