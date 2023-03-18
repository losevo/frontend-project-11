import onChange from 'on-change';
import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import resourses from '../locales/index.js';
import getRSSExample from './getRSS.js';
import updateRSS from './updateRSS.js';

// TODO: #1 Сделать асинхронную валидацию
// TODO: #7 Добавить ошибки парсинга потоков

const { ru } = resourses;
const defaultLng = 'ru';

yup.setLocale({
  mixed: {
    default: 'Error',
  },
  string: {
    url: 'errorValidURL',
  },
});

const schema = yup.object().shape({
  url: yup.string().url().required().trim(),
});

const state = {
  fields: {
    url: '',
  },
  urlList: [],
  errors: '',
};

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const app = (i18nextInstance) => {
  const form = document.querySelector('form');
  const watchedState = onChange(state, (path) => {
    const input = document.querySelector('input');
    if (path === 'errors') {
      const feedbackParagraph = document.querySelector('.feedback');
      if (watchedState.errors.length > 0) {
        input.classList.add('is-invalid');
        feedbackParagraph.textContent = `${i18nextInstance.t(state.errors)}`;
      }
      if (watchedState.errors.length === 0) {
        input.classList.remove('is-invalid');
        feedbackParagraph.textContent = '';
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.fields.url = e.target.url.value.trim();
    const valid = validate(state.fields);
    if (_.has(valid, 'url')) {
      watchedState.errors = valid.url.errors;
    } else {
      watchedState.errors = '';
      watchedState.urlList.push(watchedState.fields.url);
      getRSSExample(watchedState.fields.url);
    }
    updateRSS(state.urlList);
    console.log(state, e.target.url.value);
    form.focus();
    form.reset();
  });
};

const runApp = async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: defaultLng,
    debug: true,
    resources: {
      ru,
    },
  });

  app(i18nextInstance);
};

export default runApp();
