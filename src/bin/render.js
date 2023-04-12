const renderPosts = (state, i18nextInstance) => {
  const postsSelector = document.querySelector('.posts');
  const ulList = postsSelector.querySelector('.list-group');
  const listPosts = [];
  if (state.urlList.length > 0) {
    state.rss.map((item) => {
      item.stream.forEach((post) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-starts', 'border-0', 'border-end-0');
        const link = document.createElement('a');
        link.setAttribute('href', post.link);
        link.innerHTML = post.title;
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        button.setAttribute('data-id', '2');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#modal');
        button.innerHTML = i18nextInstance.t('look');
        li.append(link);
        li.append(button);
        listPosts.push(li);
        if (post.status === 'ready') {
          link.classList.add('fw-bold');
        }
        if (post.status === 'visited') {
          link.classList.replace('fw-bold', 'fw-normal');
          link.classList.add('link-secondary');
        }

        button.addEventListener('click', (el) => {
          // eslint-disable-next-line no-param-reassign
          post.status = 'visited';

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
  }
};

const renderFeeds = (state) => {
  const feedSelector = document.querySelector('.feeds');
  const ulListForFeeds = feedSelector.querySelector('.list-group');
  const tempLi = [];
  if (state.urlList.length > 0) {
    state.rss.forEach((item) => {
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
  }
};

const render = (state, i18nextInstance) => {
  const input = document.querySelector('input');
  const feedbackParagraph = document.querySelector('.feedback');
  if (state.errors.length > 0) {
    input.classList.add('is-invalid');
    feedbackParagraph.classList.replace('text-success', 'text-danger');
    feedbackParagraph.textContent = i18nextInstance.t(`${state.errors}`);
  }
  if (state.errors.length === 0) {
    input.classList.remove('is-invalid');
    feedbackParagraph.classList.replace('text-danger', 'text-success');
    feedbackParagraph.textContent = i18nextInstance.t('rssSuccessLoad');
  }

  if (document.querySelector('.card') === null && state.urlList.length > 0 && state.errors.length === 0) {
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
  renderPosts(state, i18nextInstance);
  renderFeeds(state);
};

export default render;
