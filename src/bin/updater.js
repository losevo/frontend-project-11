/* eslint-disable no-param-reassign */
import axios from 'axios';
import render from './render.js';

const update = (state, i18nextInstance) => {
  if (state.urlList.length === 0) {
    setTimeout(() => update(state, i18nextInstance), 5000);
    return;
  }

  const promises = state.urlList.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.status === 200) return response.data;
      throw console.log('net svyazi');
    })
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'application/xhtml+xml');
      if (doc.querySelector('parsererror')) {
        state.errors = 'notContainRSS';
        state.urlList.pop();
        throw new Error();
      }
      return doc;
    })
    .then((doc) => {
      console.log(doc);
      const feed = doc.querySelector('title').innerHTML;
      const description = doc.querySelector('description').innerHTML;
      if (!state.rss.some((e) => e.feed === feed)) {
        state.rss.push({ feed, description });
        const items = doc.querySelectorAll('item');
        state.rss.map((feedThisRSS) => {
          feedThisRSS.stream = [];
          items.forEach((item) => {
            if (!feedThisRSS.stream.some((e) => e.title === item.querySelector('title').textContent)) {
              const listOfPosts = {
                title: `${item.querySelector('title').innerHTML}`,
                link: `${item.querySelector('link').innerHTML}`,
                description: `${item.querySelector('description').innerHTML}`,
                status: 'ready',
              };
              feedThisRSS.stream.push(listOfPosts);
            }
          });
          return feedThisRSS;
        });
      }
      render(state, i18nextInstance);
    })
    .catch((e) => {
      console.log(e);
      if (e.message === 'Network Error') {
        state.errors = 'errorNetwork';
        state.urlList.pop();
      }
      render(state, i18nextInstance);
    }));

  const promise = Promise.all(promises);
  promise.then(() => setTimeout(() => update(state, i18nextInstance), 5000));
};

export default update;
