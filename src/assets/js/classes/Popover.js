export default class Popover {
	constructor() {
		this.text = '';
		this.container = document.querySelector('.popover-target');
		this.triggers = document.querySelectorAll('.popover');
		this.coords = { x: 0, y: 0 };
		if (this.container && this.triggers.length) {
			this.addEvent();
		}
	}
	addEvent() {
		this.triggers.forEach(trigger => {
			trigger.addEventListener('mouseenter', this.mouseEnter.bind(this));
			trigger.addEventListener('mouseleave', this.mouseLeave.bind(this));
		});
		if (module.hot) {
			module.hot.dispose(() => {
				this.triggers.forEach(trigger => {
					trigger.removeEventListener('mouseenter', this.mouseEnter);
					trigger.removeEventListener('mouseleave', this.mouseLeave);
				});
			});
		}
	}
	mouseEnter(el) {
		if (!el.path[0].dataset.text) return;
		this.text = el.path[0].dataset.text;
		this.coords = {
			x: el.path[0].getBoundingClientRect().left + el.path[0].clientWidth / 2,
			y: el.path[0].getBoundingClientRect().top + window.scrollY,
		};
		this.show();
	}
	mouseLeave() {
		this.text = '';
		this.hide();
	}
	show() {
		this.container.classList.add('active');
		this.container.style.left = this.coords.x + 'px';
		this.container.style.top = this.coords.y + 'px';
		this.container.innerHTML = this.text;
	}
	hide() {
		this.container.classList.remove('active');
		this.container.style.left = -999 + 'px';
		this.container.style.top = -999 + 'px';
		this.container.innerHTML = '';
	}
}
