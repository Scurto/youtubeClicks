import { YoutubeClicksPage } from './app.po';

describe('youtube-clicks App', () => {
  let page: YoutubeClicksPage;

  beforeEach(() => {
    page = new YoutubeClicksPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
