import onChange from 'on-change';
import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import resourses from '../locales/index.js';

const { ru } = resourses;
const defaultLng = 'ru';

// TODO: #1 Сделать асинхронную валидацию
// TODO: #3 Подключить и разобраться с yup.setLocale()
const schema = yup.object().shape({
  url: yup.string().url().required().trim(),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const app = (i18nextInstance) => {
  const state = {
    fields: {
      url: '',
    },
    urlList: [],
    errors: [],
  };

  const form = document.querySelector('form');

  // TODO: #2 Добавить ошибки в state
  const watchedState = onChange(state, () => {
    const valid = validate(state.fields);
    const input = document.querySelector('input');
    const feedbackParagraph = document.querySelector('.feedback');
    if (Object.keys(valid).length > 0) {
      input.classList.add('is-invalid');
      feedbackParagraph.textContent = `${i18nextInstance.t('errorValidURL')}`;
    }
    if (Object.keys(valid).length === 0) {
      input.classList.remove('is-invalid');
      feedbackParagraph.textContent = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.fields.url = e.target.url.value.trim();
    const valid = validate(state.fields);
    if (Object.keys(valid).length === 0) {
      watchedState.urlList.push(watchedState.fields.url);
    }
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
