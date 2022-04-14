const BASE_URL = 'https://pokeapi.co/api/v2/'
const LIMIT = 20
const ALL_POKEMONS = 1126
const ALL_PAGES = Math.floor(ALL_POKEMONS / LIMIT)
let offsetCounter = 0
let currentPages = 1
const $container = document.querySelector('.container')
const $prev = document.querySelector('.prev')
const $next = document.querySelector('.next')
const $currentPage = document.querySelector('.currentPage')
const $allPages = document.querySelector('.allPages')
const $pageInput = document.querySelector('.pageInput')
const $submitBtn = document.querySelector('.submit')
const $selectSort = document.querySelector('#select')
let selectPage = 1

window.addEventListener('load', () => {
	getData(
		`${BASE_URL}pokemon`,
		`limit=${LIMIT}&offset=${offsetCounter}`,
		(cb) => {
			cardTemplate(cb.results)
		}
	)
})
function getData(url, query, callBack) {
	fetch(`${url}?${query}`)
		.then((response) => response.json())
		.then((response) => callBack(response))
}

function cardTemplate(base) {
	const markUp = base
		.map(({ name, url }) => {
			return `
			<div class="card" onclick="getSingleData('${url}')">
				<h4>${name}</h4>
				</div>
	`
		})
		.join('')
	$container.innerHTML = markUp
}

function getSingleData(url) {
	getData(url, '', (cb) => {
		console.log(cb)
		$container.innerHTML = `
			<div class="single">
				<div class="singleContainer">
					<div class="sigleContainerInfo">
						<h1>${cb.name}</h1>
						<img src="${cb.sprites.other.dream_world.front_default}" alt="pokemonImage">
						<ul>
							<li><span>Number №: </span>${cb.order}</li>
							<li><span>Experience: </span>${cb.base_experience}</li>
							<li><span>Height: </span>${cb.height}</li>
							<li><span>Weight: </span>${cb.weight}</li>
						</ul>
					</div>
					<div class="singleContainerParameters">
						<ul>
							${Renderstats(cb.stats)}
						</ul>
					</div>
				</div>
				<button class="backBtn" onclick="backFn()">Go back</button>
			</div>
		`
	})
}

function Renderstats(stats) {
	const template = stats
		.map((item) => {
			console.log(item.base_stat, item.stat.name)
			return `
					<li><span class="key">${item.stat.name}: </span><span class="value">${item.base_stat}</span></li>
			`
		})
		.join('')
	return template
}

function backFn() {
	location.reload()
}

window.addEventListener('load', () => {
	$allPages.innerHTML = ALL_PAGES
	$currentPage.innerHTML = currentPages
	$prev.setAttribute('disabled', true)
})

$next.addEventListener('click', (e) => {
	e.preventDefault()
	if (currentPages === ALL_PAGES) {
		$next.setAttribute('disabled', true)
	}
	$prev.removeAttribute('disabled')

	offsetCounter += LIMIT
	currentPages++
	changePage()
	if (currentPages === ALL_PAGES) {
		$next.setAttribute('disabled', true)
	}
	getData(
		`${BASE_URL}pokemon`,
		`limit=${LIMIT}&offset=${offsetCounter}`,
		(cb) => {
			cardTemplate(cb.results)
		}
	)
})

$prev.addEventListener('click', (e) => {
	e.preventDefault()

	offsetCounter -= LIMIT
	currentPages--
	changePage()
	if (currentPages === 1) {
		$prev.setAttribute('disabled', true)
	}
	$next.removeAttribute('disabled')
	getData(
		`${BASE_URL}pokemon`,
		`limit=${LIMIT}&offset=${offsetCounter}`,
		(cb) => {
			cardTemplate(cb.results)
		}
	)
})

function changePage() {
	$currentPage.innerHTML = currentPages
}

let valueOfSearching

$selectSort.addEventListener('change', (e) => {
	valueOfSearching = e.target.value
})

$pageInput.addEventListener('input', (e) => {
	selectPage = e.target.value
})

$submitBtn.addEventListener('click', (e) => {
	e.preventDefault()
	console.log(valueOfSearching)
	if (valueOfSearching === 'page') {
		if (
			selectPage.trim() > ALL_PAGES &&
			selectPage.trim() < 1 &&
			selectPage.trim() === currentPages
		) {
			alert('Write correct page!')
		} else {
			const selectedOffset = selectPage.trim() * LIMIT - LIMIT
			currentPages = selectPage.trim()
			$currentPage.innerHTML = selectPage.trim()
			offsetCounter = selectedOffset
			if (selectPage.trim() !== 1) {
				$prev.removeAttribute('disabled')
			} else {
				$prev.setAttribute('disabled', true)
			}

			if (selectPage.trim() !== ALL_PAGES) {
				$next.removeAttribute('disabled')
			} else {
				$next.setAttribute('disabled', true)
			}
			$pageInput.value = ''
			getData(
				`${BASE_URL}pokemon`,
				`limit=${LIMIT}&offset=${selectedOffset}`,
				(cb) => {
					cardTemplate(cb.results)
				}
			)
		}
	} else {
		getSingleData(`${BASE_URL}pokemon/${selectPage}`)
	}
})
