import './styles.css';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import apiService from './modules/apiService';
import notify from './modules/notifier';
import gallery from './templates/gallery.hbs';
const debounce = require('lodash.debounce');
const basicLightbox = require('basiclightbox');

const refs = {
  pageNuber: 1,
  searchContainer: document.querySelector('.search-container'),
  input: document.querySelector('.input-box'),
  result: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.loadBtn'),
  searchIcon: document.querySelector('.search-icon'),
};

const handleInput = event => {
  refs.result.innerHTML = '';
  refs.pageNuber = 1;
  apiService(event.target.value, 1, 12).then(items => {
    renderResult(gallery(items.hits));
  });
};

const handleLoadButton = () => {
  refs.pageNuber += 1;
  apiService(refs.input.value, refs.pageNuber, 12).then(items => {
    if (items.hits.length === 0) {
      notify('isNotFound');
      return;
    }
    renderResult(gallery(items.hits));
    notify('isEmpty', false);
    refs.loadBtn.blur();
    window.scrollBy({
      top: window.innerHeight - 70,
      left: 0,
      behavior: 'smooth',
    });
  });
};

const handleClick = event => {
  if (event.target.nodeName === 'IMG') {
    basicLightbox
      .create(
        `<img src="${event.target.dataset.src}" alt="${event.target.alt}" />`,
      )
      .show();
  }
};

const handlePressButton = event => {
  if (event.key === 'Enter' && event.target.value === '') {
    event.preventDefault();
    notify('isEmpty', true);
  }
  if (event.key === 'Enter' && event.target.value != '') {
    event.preventDefault();
  }
};

const renderResult = string => {
  refs.result.insertAdjacentHTML('beforeend', string);
};

refs.result.addEventListener('click', handleClick);
refs.loadBtn.addEventListener('click', handleLoadButton);
refs.input.addEventListener('input', debounce(handleInput, 500));
refs.input.addEventListener('keypress', handlePressButton);
window.addEventListener('scroll', () => {
  if (
    window.scrollY > 240 &&
    !refs.searchIcon.classList.contains('search-icon--visible')
  ) {
    refs.searchIcon.classList.add('search-icon--visible');
    refs.searchIcon.style.visibility = 'visible';
    refs.searchContainer.style.position = 'static';
  } else if (window.scrollY < 240) {
    refs.searchIcon.classList.remove('search-icon--visible');
    refs.searchIcon.style.visibility = 'hidden';
    refs.searchContainer.style.position = 'sticky';
  }
});

refs.searchIcon.addEventListener('click', () => {
  if (refs.searchContainer.style.position === 'sticky') {
    refs.searchContainer.style.position = 'static';
    return;
  } else if (refs.searchContainer.style.position === 'static')
    refs.searchContainer.style.position = 'sticky';
  refs.input.focus();
  refs.input.setSelectionRange(0, -1);
});
