// import { gsap } from 'gsap';

// import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
// gsap.registerPlugin(ScrollToPlugin);

// global.gsap = gsap;

// gsap.defaults({
// 	overwrite: 'auto',
// });

class ProjectApp {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			// Signal: require('./classes/Signal').default,
			Popover: require('./classes/Popover').default,
			Cart: require('./classes/Cart').default,
		};
		this.components = {};
		this.helpers = {};
		this.modules = {};
		document.addEventListener('DOMContentLoaded', () => {
			document.documentElement.classList.remove('_loading');

			new this.classes.Popover();

			// set card name to uppercase and Latin only
			const cardnameEl = document.querySelector('input[name="cardname"]');
			const formatName = function () {
				const reg = /[а-яА-ЯёЁ]/g;
				if (this.value.search(reg) !== -1) {
					this.value = this.value.replace(reg, '');
				}

				this.value = this.value.toUpperCase();
			};
			if (cardnameEl) {
				cardnameEl.addEventListener('keyup', formatName);
			}

			// logic for card number fields
			const cardNumberFields = document.querySelectorAll('input.i-cardnumber');
			const formatNumber = function () {
				const current = +this.id[this.id.length - 1] - 1;
				if (this.value.length >= 4) {
					this.value = this.value.slice(0, 4);
					this.blur();
					if (current + 1 < cardNumberFields.length) {
						cardNumberFields[current + 1].focus();
					}
				}
			};
			if (cardNumberFields.length) {
				cardNumberFields.forEach(input => {
					input.addEventListener('input', formatNumber);
				});
			}

			// set card date
			const cardDateField = document.querySelector('input[name="carddate"]');
			const formatDate = function (e) {
				if (e.key === 'Backspace' || e.keyCode === 8) return;
				if (this.value.length === 2) {
					this.value += '/';
				}
			};
			if (cardDateField) {
				cardDateField.addEventListener('keyup', formatDate);
			}

			const products = [
				{
					id: 0,
					title: 'Jacket',
					desc: 'Amet minim mollit non deserunt ullamco est sit',
					image: '/assets/images/jacket.png',
					price: 525,
					count: 1,
				},
				{
					id: 1,
					title: 'Boots',
					desc: 'Amet minim mollit non',
					image: '/assets/images/boot.png',
					price: 525,
					count: 1,
				},
			];
			const Cart = new this.classes.Cart(products);
			Cart.render();

			const stopBubble = e => {
				e.stopPropagation();
			};
			const resetBasketBtn = document.querySelector('.js-basket-reset');
			if (resetBasketBtn) {
				resetBasketBtn.addEventListener('click', function () {
					Cart.render(true);
				});
			}

			if (document.documentElement.clientWidth < 910) {
				const basketOpenBtn = document.querySelector('.iconBasket');
				const basket = document.querySelector('.wrapper__basket');
				const burger = document.querySelector('.burger');
				const menu = document.querySelector('.menu');
				const basketCancelBtn = document.querySelector('.cancelBasket');
				const menuCancelBtn = document.querySelector('.cancelMenu');
				const darkenBgEl = document.querySelector('.menu_darken');

				const openMobileSidebar = (elem, e) => {
					e.stopPropagation();
					elem.classList.add('active');
					darkenBgEl.classList.add('active');
				};

				const closeMobileSidebar = elem => {
					if (elem.length) {
						elem.forEach(el => {
							el.classList.remove('active');
						});
					} else {
						elem.classList.remove('active');
					}
					darkenBgEl.classList.remove('active');
				};

				if (basket) {
					basket.addEventListener('click', stopBubble);
					if (basketOpenBtn)
						basketOpenBtn.addEventListener('click', openMobileSidebar.bind(this, basket));
					if (basketCancelBtn)
						basketCancelBtn.addEventListener('click', closeMobileSidebar.bind(this, basket));
				}
				if (menu) {
					menu.addEventListener('click', stopBubble);
					if (burger) burger.addEventListener('click', openMobileSidebar.bind(this, menu));
					if (menuCancelBtn)
						menuCancelBtn.addEventListener('click', closeMobileSidebar.bind(this, menu));
				}

				document.addEventListener('click', closeMobileSidebar.bind(this, [basket, menu]));

				if (module.hot) {
					module.hot.dispose(() => {
						document.removeEventListener('click', closeMobileSidebar);
						if (menuCancelBtn) menuCancelBtn.removeEventListener('click', closeMobileSidebar);
						if (burger) burger.removeEventListener('click', openMobileSidebar);
						if (menu) menu.removeEventListener('click', stopBubble);
						if (basketCancelBtn) basketCancelBtn.removeEventListener('click', closeMobileSidebar);
						if (basketOpenBtn) basketOpenBtn.removeEventListener('click', openMobileSidebar);
						if (basket) basket.removeEventListener('click', stopBubble);
					});
				}
			}
			if (module.hot) {
				module.hot.dispose(() => {
					if (cardDateField) cardDateField.removeEventListener('keyup', formatDate);
					if (cardNumberFields.length) {
						cardNumberFields.forEach(input => {
							input.removeEventListener('input', formatNumber);
						});
					}
					if (cardnameEl) cardnameEl.removeEventListener('keyup', formatName);
				});
			}
		});
	}
}

global.ProjectApp = new ProjectApp();

if (module.hot) {
	module.hot.accept();
}
