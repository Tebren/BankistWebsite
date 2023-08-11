'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navBtnsParent = document.querySelector('.nav__links');
//Tab component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
//nav
const nav = document.querySelector('.nav');
const navBnt = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
//slider
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
////////////////////////////////////////////////////////////////////
// Modal window

const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

/////////////////////////////////////////////////////////////////////////
//scrolling

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});
////////////////////////////////////////////////////////////////////
//Button scrolling
btnScrollTo.addEventListener('click', function (e) {
	const s1coords = section1.getBoundingClientRect();
	console.log(s1coords);

	console.log(`Current scroll (x/Y)`, window.pageXOffset, window.pageYOffset);

	console.log(e.target.getBoundingClientRect());

	console.log(
		`height/width viewport`,
		document.documentElement.clientHeight,
		document.documentElement.clientWidth
	);

	//Scrolling
	// window.scrollTo(
	// 	s1coords.left + window.pageXOffset,
	// 	s1coords.top + window.pageYOffset,
	// );

	section1.scrollIntoView({ behavior: 'smooth' });
});
//////////////////////////////////////////////////////////////////
//Page navigation
/*
navBtns.forEach(function (el) {
	el.addEventListener('click', function (e) {
		e.preventDefault();
		const id = this.getAttribute('href');
		console.log(id);
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	});
});
*/

//1.Add event listener to common parent element
//2.Determine what element originated the element

navBtnsParent.addEventListener('click', function (e) {
	console.log(e.target);
	e.preventDefault();

	//Matching strategy
	if (e.target.classList.contains('nav__link')) {
		const id = e.target.getAttribute('href');
		console.log(id);
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
});

tabsContainer.addEventListener('click', function (e) {
	const clicked = e.target.closest('.operations__tab');

	//Guard clause
	if (!clicked) return;

	//Remove active classes
	tabs.forEach((t) => t.classList.remove('operations__tab--active'));
	tabsContent.forEach((c) => c.classList.remove(`operations__content--active`));

	//Active tab
	clicked.classList.add('operations__tab--active');

	//Activate content area
	document
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add('operations__content--active');
});

//Menu fade animation
const handleHover = function (e) {
	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = link.closest('.nav').querySelectorAll('.nav__link');
		const logo = link.closest('.nav').querySelector('img');

		siblings.forEach((el) => {
			if (el !== link) el.style.opacity = this;
		});
		logo.style.opacity = this;
	}
};
/*
//Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation OLD WAY
const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {


	if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
});
*/
/*
//Sticky navigation : Intersection Observer API
const obsCallback = function (entries, observer) {
	entries.forEach((entry) => {
		console.log(entry);
	});
};

const obsOptions = {
	root: null,
	threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
	const [entry] = entries;

	if (!entry.isIntersecting) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
};

const obsOption = {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, obsOption);

headerObserver.observe(header);

//Reveals sections
const revealsSections = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;
	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
};

const optionsSectionsObserver = {
	root: null,
	threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
	revealsSections,
	optionsSectionsObserver
);
allSections.forEach(function (section) {
	sectionObserver.observe(section);
	// section.classList.add('section--hidden');
});

//Lazy loading images
const loadImg = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	//Replace src with data-src
	entry.target.src = entry.target.dataset.src;
	entry.target.addEventListener('load', function () {
		entry.target.classList.remove('lazy-img');

		observer.unobserve(entry.target);
	});
};
const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: '200px',
});
imgTargets.forEach((img) => imgObserver.observe(img));

//Slider
const sliderCon = function () {
	let currSlide = 0;
	const maxSlide = slides.length;

	//Dots
	const createDots = function () {
		slides.forEach(function (_, i) {
			dotContainer.insertAdjacentHTML(
				'beforeend',
				`<button class="dots__dot" data-slide="${i}"></button>`
			);
		});
	};
	const goToSlide = function (slide) {
		slides.forEach(
			(s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
		);
	};

	//Activated dots
	const activateDots = function (slide) {
		document
			.querySelectorAll('.dots__dot')
			.forEach((dot) => dot.classList.remove('dots__dot--active'));
		document
			.querySelector(`.dots__dot[data-slide="${slide}"]`)
			.classList.add('dots__dot--active');
	};
	//Next SLide
	const nextSlide = function () {
		if (currSlide === maxSlide - 1) {
			currSlide = 0;
		} else currSlide++;

		goToSlide(currSlide);
		activateDots(currSlide);
	};
	//Previous slide
	const prevSlide = function () {
		if (currSlide === 0) {
			currSlide = maxSlide - 1;
		} else currSlide--;
		goToSlide(currSlide);
		activateDots(currSlide);
	};

	const init = function () {
		goToSlide(0);
		createDots();
		activateDots(0);
	};
	init();
	//Event handler
	btnRight.addEventListener('click', nextSlide);
	btnLeft.addEventListener('click', prevSlide);

	//Key push naex previous slide
	document.addEventListener('keydown', function (e) {
		console.log(e);
		if (e.key === 'ArrowLeft') {
			prevSlide();
		} else if (e.key === 'ArrowRight') {
			nextSlide();
		}
	});
	//Dots
	dotContainer.addEventListener('click', function (e) {
		if (e.target.classList.contains('dots__dot')) {
			const { slide } = e.target.dataset;
			goToSlide(slide);
			activateDots(slide);
		}
	});
};
sliderCon();
//////////////////////////////////////////////////////////////////////////
/////////////////////////////Lecture////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
/*
//Selecting elements
console.log(document.documentElement);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');

const allButons = document.getElementsByTagName('button');
console.log(allButons);

console.log(document.getElementsByClassName('btn'));

//Creating a inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
	'We use cokkies for improved functionality and analytics.<button class="btn btn--close--cockie">Got it!<button>';
// header.prepend(message);
header.append(message);

//header.append(message.cloneNode(true));

//Delete elements
document
	.querySelector('.btn--close--cockie')
	.addEventListener('click', function () {
		message.remove();
		// message.parentElement.removeChild(message);
	});

//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.hight);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);

message.style.height =
	Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

//Atributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

console.log(logo.getAttribute('designer'));

logo.setAttribute('company', 'Bankist');

console.log(logo.getAttribute('src'));

//Data atributes
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
console.log(logo.classList.contains('c'));
*/

//Event
/*
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
	alert('addEventListener: Great! You are reading the heading :D');

	h1.removeEventListener('mouseenter', alertH1);
};
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
/*

// h1.onmouseenter = function (e) {
// 	alert('onmouseenter: Great! You are reading the heading :D');
// };
/*
const randomInt = (min, max) =>
	Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
	`rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
	this.style.backgroundColor = randomColor();
	console.log('LINK', e.target, e.currentTarget);
	console.log(e.currentTarget === this);
	e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
	this.style.backgroundColor = randomColor();
	console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
	this.style.backgroundColor = randomColor();
	console.log('NAV', e.target, e.currentTarget);
});
*/
/*
const h1 = document.querySelector('h1');

//going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'royalblue';

//Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

//Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
	if (el !== h1) el.style.transform = 'Scale(0.5)';
});
*/

// document.addEventListener('DOMContentLoaded', function (e) {
// 	console.log('HTML parsed and DOM tree built!', e);
// });
// window.addEventListener('load', function (e) {
// 	console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
// 	e.preventDefault();
// 	console.log(e);
// 	e.returnValue = '';
// });
