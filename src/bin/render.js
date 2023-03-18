const renderPosts = (feeds) => {
  const postsSelector = document.querySelector('.posts');
  const ulList = postsSelector.querySelector('.list-group');
  const listPosts = [];
  feeds.map((item) => {
    item.stream.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-starts', 'border-0', 'border-end-0');
      const link = document.createElement('a');
      link.setAttribute('href', post.link);
      link.classList.add('fw-bold');
      link.innerHTML = post.title;
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('data-id', '2');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.innerHTML = 'Просмотр';
      li.append(link);
      li.append(button);
      listPosts.push(li);

      button.addEventListener('click', (el) => {
        const { bsTarget } = el.target.dataset;
        const modal = document.querySelector(bsTarget);
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        const modalFullArticleBtn = document.querySelector('.modal-footer a.full-article');

        modalTitle.innerHTML = post.title;
        modalBody.innerHTML = post.description;
        modalFullArticleBtn.setAttribute('href', post.link);
        link.classList.replace('fw-bold', 'fw-normal');
        link.classList.add('link-secondary');
      });
    });
    ulList.replaceChildren(...listPosts);
    return item;
  });
};

const renderFeeds = (feeds) => {
  const feedSelector = document.querySelector('.feeds');
  const ulListForFeeds = feedSelector.querySelector('.list-group');
  const tempLi = [];
  feeds.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const titleForFeed = document.createElement('h3');
    titleForFeed.classList.add('h6', 'm-0');
    titleForFeed.innerHTML = item.feed;
    const descriptionForFeed = document.createElement('p');
    descriptionForFeed.classList.add('m-0', 'small', 'text-black-50');
    descriptionForFeed.innerHTML = item.description;
    li.append(titleForFeed, descriptionForFeed);
    tempLi.push(li);
  });
  ulListForFeeds.replaceChildren(...tempLi);
};

const render = (feeds) => {
  if (document.querySelector('.card') === null) {
    const postsSelector = document.querySelector('.posts');
    const divForUl = document.createElement('div');
    divForUl.classList.add('card', 'border-0');
    const divH2Posts = document.createElement('div');
    divH2Posts.classList.add('card-body');
    const h2InDiv = document.createElement('h2');
    h2InDiv.classList.add('card-title', 'h4');
    h2InDiv.innerHTML = 'Посты';
    const ulList = document.createElement('ul');
    ulList.classList.add('list-group', 'border-0', 'rounded-0');
    divH2Posts.append(h2InDiv);
    divForUl.append(divH2Posts);
    divForUl.append(ulList);
    postsSelector.append(divForUl);

    const feedsDiv = document.querySelector('.feeds');
    const divForFeeds = document.createElement('div');
    divForFeeds.classList.add('card', 'border-0');
    const divForHFeeds = document.createElement('div');
    divForHFeeds.classList.add('card-body');
    const h2InFeeds = document.createElement('h2');
    h2InFeeds.classList.add('card-title', 'h4');
    h2InFeeds.innerHTML = 'Фиды';
    const ulListFeeds = document.createElement('ul');
    ulListFeeds.classList.add('list-group', 'border-0', 'rounded-0');
    divForHFeeds.append(h2InFeeds);
    divForFeeds.append(divForHFeeds);
    feedsDiv.append(divForFeeds);
    feedsDiv.append(ulListFeeds);
  }
  renderPosts(feeds);
  renderFeeds(feeds);
};

export default render;
