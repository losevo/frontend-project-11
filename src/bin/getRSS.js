/* eslint-disable no-param-reassign */
import axios from 'axios';
import render from './render.js';

const feeds = [];

const getRSSExample = (state, i18nextInstance) => {
  state.urlList.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      console.log(response);
      if (response.status === 200) return response.data;
      throw console.log('network!');
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
      const feed = doc.querySelector('title').innerHTML;
      const description = doc.querySelector('description').innerHTML;
      if (!feeds.some((e) => e.feed === feed)) {
        feeds.push({ feed, description });
        const items = doc.querySelectorAll('item');
        feeds.map((feedThisRSS) => {
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
        state.rss = feeds;
      }
      render(state, i18nextInstance);
    })
    .catch((e) => {
      if (e.message === 'Network Error') {
        state.errors = 'errorNetwork';
        state.urlList.pop();
      }
      render(state, i18nextInstance);
    }));
};

export default getRSSExample;
