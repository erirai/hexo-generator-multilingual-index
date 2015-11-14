'use strict';

var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');
var _ = require('lodash');
var multilingual = require('hexo-multilingual');
var pagination = require('hexo-pagination');

nunjucks.configure({
  autoescape: false,
  watch: false
});

env.addFilter('uriencode', function(str) {
  return encodeURI(str);
});

var tmplSrc = pathFn.join(__dirname, '../redirect.html');
var tmpl = nunjucks.compile(fs.readFileSync(tmplSrc, 'utf8'), env);

module.exports = function(locals) {
  var config = this.config;
  var result = [];

  function _c(value, lang) {
    return multilingual.util._c(value, lang, config, locals);
  }

  _.forEach(config.language, function(lang, n) {
    if (lang !== 'default') {
      // If first language (default) redirect from index
      if (n === 0) {
        result.push({
          path: '',
          data: tmpl.render({
            config: config,
            redirect: lang + '/'
          })
        });
      }

      var posts = locals.posts.sort(_c('index_generator.order_by', lang)).filter(function(post) {
        return post.lang === lang;
      });

      var paginationDir = _c('pagination_dir', lang) || 'page';

      result = result.concat(pagination(lang, posts, {
        perPage: _c('index_generator.per_page', lang),
        layout: ['index', 'archive'],
        format: paginationDir + '/%d/',
        data: {
          __index: true,
          lang: lang
        }
      }));
    }
  });

  return result;
};
