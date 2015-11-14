'use strict';

var _ = require('lodash');
var multilingual = require('hexo-multilingual');
var pagination = require('hexo-pagination');

module.exports = function(locals) {
  var config = this.config;
  var result = [];

  function _c(value, lang) {
    return multilingual.util._c(value, lang, config, locals);
  }
  
  _.forEach(config.language, function(lang) {
    if (lang != 'default') {
      var posts = locals.posts.sort(_c('index_generator.order_by', lang)).filter(function(post) {
        return post.lang == lang;
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
