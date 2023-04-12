import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import resourses from '../locales/index.js';
import update from './updater.js';
import getRSSExample from './getRSS.js';
import render from './render.js';

// TODO: #1 Сделать асинхронную валидацию
// TODO: #7 Добавить ошибки парсинга потоков

const { ru } = resourses;
const defaultLng = 'ru';

const validate = (url, urlList) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'rssExists',
    },
    string: {
      url: 'errorValidURL',
      required: 'notEmpty',
    },
  });
  const schema = yup.string().required('notEmpty').url().notOneOf(urlList);
  return schema.validate(url);
};

const app = (i18nextInstance) => {
  const form = document.querySelector('form');
  const state = {
    fields: {
      url: '',
    },
    urlList: [],
    errors: '',
    rss: [],
  };

  update(state, i18nextInstance);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.fields.url = e.target.url.value.trim();
    validate(state.fields.url, state.urlList)
      .then((url) => {
        state.fields.url = url;
        state.errors = '';
        state.urlList.push(url);
        getRSSExample(state, i18nextInstance);
      })
      .catch((err) => {
        console.log(err);
        if (!(_.has(err, 'errors'))) {
          const errors = 'errorNetwork';
          state.errors = errors;
        } else {
          const errors = err.errors[0];
          state.errors = errors;
        }
        render(state, i18nextInstance);
      });
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
