/* eslint-disable no-param-reassign */
import render from './render.js';

const feeds = [];

const getRSSExample = (urlFromState) => {
  const url = new URL(urlFromState);
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'application/xhtml+xml');
      console.log(doc);
      console.log(data.contents);
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
            console.log(feedThisRSS.stream.some((e) => e.title === item.querySelector('title').textContent));
            if (!feedThisRSS.stream.some((e) => e.title === item.querySelector('title').textContent)) {
              const listOfPosts = {
                title: `${item.querySelector('title').innerHTML}`,
                link: `${item.querySelector('link').innerHTML}`,
                description: `${item.querySelector('description').innerHTML}`,
              };
              feedThisRSS.stream.push(listOfPosts);
            }
          });
          return feedThisRSS;
        });
      }
      console.log(feeds);
      render(feeds);
    });
};

export default getRSSExample;
