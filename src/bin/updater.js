/* eslint-disable no-param-reassign */
import render from './render.js';

const update = (state, i18nextInstance) => {
  if (state.urlList.length === 0) {
    setTimeout(() => update(state, i18nextInstance), 5000);
    return;
  }

  const promises = state.urlList.map((url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw console.log('net svyazi');
    })
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'application/xhtml+xml');
      return doc;
    })
    .then((doc) => {
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
    .catch((e) => console.error(e.message)));

  const promise = Promise.all(promises);
  promise.then(() => setTimeout(() => update(state, i18nextInstance), 5000));
};

export default update;
