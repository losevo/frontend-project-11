import getRSSExample from './getRSS';

const updateRSS = (urlList) => {
  urlList.forEach((url) => {
    getRSSExample(url);
  });
  setTimeout(() => updateRSS(urlList), 5000);
};

export default updateRSS;
