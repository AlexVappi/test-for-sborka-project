const utils = require('../utils/utils').default;

export default class Cart {
	constructor(data) {
		this.defaultData = data;
		this.data = [];
		for (const product of this.defaultData) {
			this.data.push(JSON.parse(JSON.stringify(product)));
		}
		this.tax = 100;
		this.shipping = 150;
		this.basketContainer = document.querySelector('.products__list');
		this.subtotalPriceEl = document.querySelector('.subtotal-price');
		this.totalPriceEl = document.querySelector('.total-price');
		this.totalCountEl = document.querySelector('.iconBasket__count');
		this.emptyBlockEl = document.querySelector('.basket-empty');
		this.totalTableEl = document.querySelector('.total-table');
		this.addEvents();
	}
	addEvents() {
		const basketHandler = e => {
			// increment event
			if (typeof e.target.dataset.increment !== 'undefined') {
				const id = +e.target.dataset.increment;
				for (const el of this.data) {
					if (el.id === id) {
						++el.count;
						break;
					}
				}
				this.render();
			}

			// decrement event
			if (typeof e.target.dataset.decrement !== 'undefined') {
				const id = +e.target.dataset.decrement;
				for (const el of this.data) {
					if (el.id === id) {
						--el.count;
						if (el.count < 1) {
							this.removeElem(id);
							return;
						}
						break;
					}
				}
				this.render();
			}

			//remove event
			if (typeof e.target.dataset.remove !== 'undefined') {
				const id = +e.target.dataset.remove;
				for (const el of this.data) {
					if (el.id === id) {
						this.removeElem(id);
						return;
					}
				}
			}
		};

		this.basketContainer.addEventListener('click', basketHandler);

		if (module.hot) {
			module.hot.dispose(() => {
				this.basketContainer.removeEventListener('click', basketHandler);
			});
		}
	}
	removeElem(id) {
		let i = 0;
		for (const el of this.data) {
			if (el.id === id) {
				this.data.splice(i, 1);
				break;
			}
			i++;
		}
		this.render();
	}
	generateProductHTML(el) {
		const result = `
		<div class="product">
		<img class="product__image" src="${el.image}" alt="${el.title}">
		<div class="product__body">
			<div class="product__desc">${el.desc}</div>
			<div class="product__bottom">
				<div class="product__counter">
					<div data-decrement="${el.id}" class="counter-btn counter-btn__dec"></div>
					<div class="product__count">${el.count}</div>
					<div data-increment="${el.id}" class="counter-btn counter-btn__inc"></div>
				</div>
				<div class="product__price">$&nbsp;<span class="product__sum">${utils.formatNumber(
					el.price * el.count
				)}</span></div>
			</div>
		</div>
		<div class="product-remove" data-remove="${el.id}">
			<svg class="icon product-remove__icon" width="19" height="18" viewBox="0 0 19 18">
				<use xlink:href="#icon-cross"/>
			</svg>
		</div>
	</div>
		`;
		return result;
	}
	render(defaultData = false) {
		if (defaultData) {
			this.data = [];
			for (const product of this.defaultData) {
				this.data.push(JSON.parse(JSON.stringify(product)));
			}
		}
		let html = '';
		let subtotalPrice = 0;
		if (this.data.length) {
			this.emptyBlockEl.style.display = 'none';
			this.totalTableEl.classList.remove('total-table_empty');
			this.data.forEach(element => {
				if (element.count > 0) {
					html += this.generateProductHTML(element);
				}
				subtotalPrice += element.price * element.count;
			});
			this.subtotalPriceEl.innerHTML = utils.formatNumber(subtotalPrice);
			this.totalPriceEl.innerHTML = utils.formatNumber(subtotalPrice + this.tax + this.shipping);
		} else {
			this.emptyBlockEl.style.display = 'block';
			this.totalPriceEl.innerHTML = this.subtotalPriceEl.innerHTML = 0;
			this.totalTableEl.classList.add('total-table_empty');
		}

		this.totalCountEl.innerHTML = this.data.length;
		this.basketContainer.innerHTML = html;
	}
}
