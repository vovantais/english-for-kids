
const burger = document.querySelector('.header__toggle'),
	menu = document.querySelector('.header__menu');

function toggleMenu() {
	burger.addEventListener('click', (e) => {
		e.stopPropagation();
		menu.classList.toggle('active');
		burger.classList.toggle('active')
		document.body.classList.toggle('lock')
	});
	document.addEventListener('click', (e) => {
		const target = e.target;
		const its_menu = target == menu || menu.contains(target);
		const its_btnMenu = target == burger;
		const menu_is_active = menu.classList.contains('active');
		if (!its_menu && !its_btnMenu && menu_is_active) {
			menu.classList.toggle('active');
			burger.classList.toggle('active');
			document.body.classList.toggle('lock');
		}
	});
}
toggleMenu();
;
const rotate = document.querySelectorAll('.card__rotate'),
	flip = document.querySelectorAll('.flip'),
	cardMainPage = document.querySelectorAll('.content__card'),
	switchPlayTrain = document.querySelector('.switch__mode'),
	textHidden = document.querySelectorAll('.uppercase'),
	englishWords = document.querySelectorAll('.en'),
	hiddenBtn = document.querySelector('.footer__row'),
	startGame = document.querySelector('.item__btn'),
	flip_body = document.querySelectorAll('.flip__body'),
	icon = document.querySelector('.fa-undo'),
	victory = document.querySelector('.victory'),
	fail = document.querySelector('.fail'),
	cardsImg = document.querySelectorAll('.card__img'),
	starWin = document.querySelector('.content__star-win'),
	starFail = document.querySelector('.content__star-fail'),
	fail_mistake = document.querySelector('.fail__mistake');

let switchState = true;
let arrTextContent = [];
let time = null;
let text = '';
let random = '';
let countWin = 0;
let countFail = 0;

(function () {
	for (let i = 0; i < flip.length; i++) {
		addAndRemoveClassActive(flip[i]);
	}
})();

(function () {
	for (let i = 0; i < cardMainPage.length; i++) {
		addLinlToMainPage(cardMainPage[i]);
	}
})();

function addAndRemoveClassActive(DomElment) {
	DomElment.addEventListener('click', (e) => {
		let currentTarget = e.currentTarget;
		let target = e.target;
		let str = currentTarget.textContent;
		str = str.replace(/[^A-Z]/gi, '').trim();
		if (target.classList.contains('fa-sync')) {
			switchState = false;
			target.classList.add('active');
			currentTarget.classList.add('active');
		}
		if (switchPlayTrain.classList.contains('active')) {
			switchState = false;
		}
		currentTarget.addEventListener('mouseleave', () => {
			switchState = true;
			target.classList.remove('active');
			currentTarget.classList.remove('active');
		});
		currentTarget.addEventListener('touchend', () => {
			if ((target.classList.contains('active'))) {
				target.classList.remove('active');
				currentTarget.classList.remove('active');
			}
			switchState = true;
		});
		if (switchState) {
			clickSound = new Audio(`../audio/${str}.mp3`);
			clickSound.play();
		}
	});
}
function addLinlToMainPage(DomElment) {
	DomElment.addEventListener('click', (e) => {
		let attrLink = e.currentTarget.getAttribute('data-link');
		if (attrLink !== null) {
			document.location.href = `./pages/${attrLink}.html`
		}
	});
}

function switchModeTrainAndPlay() {
	switchPlayTrain.addEventListener('click', () => {
		switchPlayTrain.classList.toggle('active');
		for (let i = 0; i < textHidden.length; i++) {
			if (switchPlayTrain.classList.contains('active')) {
				textHidden[i].classList.add('hidden');
				hiddenBtn.classList.remove('hidden');
			} else {
				textHidden[i].classList.remove('hidden');
				hiddenBtn.classList.add('hidden');
			}
		}
		for (let i = 0; i < rotate.length; i++) {
			if (switchPlayTrain.classList.contains('active')) {
				rotate[i].classList.add('hidden')
			} else {
				rotate[i].classList.remove('hidden')
			}
		}
		for (let i = 0; i < rotate.length; i++) {
			if (switchPlayTrain.classList.contains('active')) {
				rotate[i].classList.add('hidden')
			} else {
				rotate[i].classList.remove('hidden')
			}
		}
		for (let i = 0; i < cardsImg.length; i++) {
			if (switchPlayTrain.classList.contains('active')) {
				cardsImg[i].classList.add('active');
			} else {
				cardsImg[i].classList.remove('active');
			}
		}
		GameLogic();
	})
}
switchModeTrainAndPlay();

function GameLogic() {
	if (arrTextContent.length === 0) {
		for (let i = 0; i < englishWords.length; i++) {
			arrTextContent.push(englishWords[i].textContent);
		}
	}
	random = arrTextContent[Math.floor(Math.random() * (arrTextContent.length))];
	if (switchPlayTrain.classList.contains('active')) {
		startGame.addEventListener('click', () => {
			startGame.classList.add('active');
			icon.classList.add('active');
			if (switchState) {
				clickSound = new Audio(`../audio/${random}.mp3`);
				clickSound.play();
			}
			for (let i = 0; i < flip_body.length; i++) {
				flip_body[i].addEventListener('click', (e) => {
					text = e.currentTarget.textContent.replace(/[^A-Z]/gi, '').trim()
					if (text === random) {
						for (let j = 0; j < arrTextContent.length; j++) {
							if (arrTextContent[j] === random) {
								arrTextContent.splice(j, 1);
							}
						}
						if (switchState) {
							random = arrTextContent[Math.floor(Math.random() * (arrTextContent.length))];
							e.currentTarget.classList.add('success');
							clickSound = new Audio(`../audio/correct.mp3`);
							clickSound.play();
							countWin++;
							const starWinImg = document.createElement('img');
							starWinImg.src = '../img/star-win.svg';
							starWin.append(starWinImg);
							if (random !== undefined) {
								time = setTimeout(() => {
									clickSound = new Audio(`../audio/${random}.mp3`);
									clickSound.play();
								}, 1500)
							}
						}
					} else {
						if (random !== "") {
							if (switchState && (!e.currentTarget.classList.contains('success'))) {
								clickSound = new Audio(`../audio/error.mp3`);
								clickSound.play();
								countWin--;
								const starFailImg = document.createElement('img');
								starFailImg.src = '../img/star.svg';
								starFail.append(starFailImg);
								countFail++;
							}
						}
					}
					if (arrTextContent.length === 0 && countWin === 8) {
						if (switchState) {
							clickSound = new Audio(`../audio/success.mp3`);
							clickSound.play();
							setTimeout(() => {
								victory.classList.remove('overlay');
							}, 800);
							victory.addEventListener('click', () => {
								document.location.href = '../index.html';
							})
						}
					}
					if ((arrTextContent.length === 0 && countWin !== 8) || countFail === 8) {
						if (switchState) {
							clickSound = new Audio(`../audio/failure.mp3`);
							clickSound.play();
							setTimeout(() => {
								fail.classList.remove('overlay');
								fail_mistake.textContent = `You lose ${countFail} wrong answers!`;
							}, 800);
							fail.addEventListener('click', () => {
								document.location.href = '../index.html';
							})
						}
					}
				})
			}
		})
	}
	if (!(switchPlayTrain.classList.contains('active'))) {
		random = '';
		text = '';
		clearTimeout(time);
		arrTextContent = [];
		switchState = false;
		setTimeout(() => {
			document.location.href = '';
		}, 500)
		startGame.classList.remove('active');
		icon.classList.remove('active')
		for (let i = 0; i < flip_body.length; i++) {
			if (flip_body[i].classList.contains('success')) {
				flip_body[i].classList.remove('success');
			}
		}
	}
}
;
