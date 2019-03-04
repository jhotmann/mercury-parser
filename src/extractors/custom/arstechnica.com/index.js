const $ = require('cheerio');

export const ArstechnicaComExtractor = {
  domain: 'arstechnica.com',

  title: {
    selectors: ['title'],
  },

  author: {
    selectors: ['span[itemprop="name"]', '.author-name'],
  },

  date_published: {
    selectors: ['time.date', ['time.date', 'datetime']],
  },

  dek: null,

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.article-guts'],

    // Is there anything in the content you selected that needs transformed
    // before it's consumable content? E.g., unusual lazy loaded images
    transforms: {
      '.image': $node => {
        const style = $node.attr('style');
        const results = /background-image:url\('(.+)'\);/.exec(style);
        if (results && results[1]) {
          const $img = $('<img>').attr('src', results[1]);
          $node.empty().append($img);
        }
      },
      li: 'div',
    },

    // Is there anything that is in the result that shouldn't be?
    // The clean selectors will remove anything that matches from
    // the result
    clean: [
      '.comment-count-number',
      '.visually-hidden',
      '#social-left',
      '.story-sidebar',
      '.sidebar',
    ],
  },
};
