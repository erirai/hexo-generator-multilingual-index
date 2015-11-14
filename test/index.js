'use strict';

var should = require('chai').should(); // eslint-disable-line
var fs = require('hexo-fs');
var pathFn = require('path');
var Hexo = require('hexo');

describe('Index generator', function() {
  var hexo = new Hexo(__dirname, {silent: true});
  var baseDir = pathFn.join(__dirname, 'data_test');
  var Post = hexo.model('Post');
  var generator = require('../lib/generator').bind(hexo);
  var posts;
  var enPosts;
  var esPosts;
  var locals;
  var processor = require('../node_modules/hexo/lib/plugins/processor/data');
  var process = processor.process.bind(hexo);
  var source = hexo.source;
  var File = source.File;
  var Data = hexo.model('Data');

  function newFile(options) {
    var path = options.path;
    options.params = {
      path: path
    };
    options.path = '_data/' + path;
    options.source = pathFn.join(source.base, options.path);
    return new File(options);
  }

  before(function() {
    return fs.mkdirs(baseDir).then(function() {
      hexo.init();
      process(newFile({
        path: 'config_en.yml',
        type: 'create',
        content: new Buffer('category_dir: categories\npagination_dir: page')
      }));
      process(newFile({
        path: 'config_es.yml',
        type: 'create',
        content: new Buffer('category_dir: categorias\npagination_dir: pagina')
      }));
    });
  });

  after(function() {
    return fs.rmdir(baseDir);
  });

  // Default config
  hexo.config.index_generator = {
    per_page: 10,
    order_by: '-date'
  };

  before(function() {
    hexo.config.language = ['en', 'es', 'default'];
  });

  before(function() {
    return Post.insert([
      {source: 'one', slug: 'one', lang: 'en', date: 1e8, order: 0},
      {source: 'uno', slug: 'uno', lang: 'es', date: 1e8, order: 0},
      {source: 'two', slug: 'two', lang: 'en', date: 1e8 + 1, order: 10},
      {source: 'dos', slug: 'dos', lang: 'es', date: 1e8 + 1, order: 10},
      {source: 'three', slug: 'three', lang: 'en', date: 1e8 + 2, order: 1},
      {source: 'tres', slug: 'tres', lang: 'es', date: 1e8 + 2, order: 1}
    ]).then(function(data) {
      posts = Post.sort('-date');
      function filterPosts(lang) {
        return posts.filter(function (post) {
          return post.lang === lang;
        });
      }
      enPosts = filterPosts('en');
      esPosts = filterPosts('es');
      locals = hexo.locals.toObject();
    });
  });

  it('pagination enabled', function() {
    hexo.config.index_generator.per_page = 2;

    var result = generator(locals);

    result.length.should.eql(4);

    for (var i = 0, len = result.length; i < len; i++) {
      result[i].layout.should.eql(['index', 'archive']);
      result[i].data.total.should.eql(2);
    }

    result[0].path.should.eql('en/');
    result[0].data.current_url.should.eql('en/');
    result[0].data.posts.should.eql(enPosts.limit(2));
    result[0].data.prev.should.eql(0);
    result[0].data.prev_link.should.eql('');
    result[0].data.next.should.eql(2);
    result[0].data.next_link.should.eql('en/page/2/');
    result[0].data.__index.should.be.true;
    result[0].data.lang.should.eql('en');

    result[1].path.should.eql('en/page/2/');
    result[1].data.current_url.should.eql('en/page/2/');
    result[1].data.posts.should.eql(enPosts.skip(2));
    result[1].data.prev.should.eql(1);
    result[1].data.prev_link.should.eql('en/');
    result[1].data.next.should.eql(0);
    result[1].data.next_link.should.eql('');
    result[1].data.__index.should.be.true;
    result[1].data.lang.should.eql('en');

    result[2].path.should.eql('es/');
    result[2].data.current_url.should.eql('es/');
    result[2].data.posts.should.eql(esPosts.limit(2));
    result[2].data.prev.should.eql(0);
    result[2].data.prev_link.should.eql('');
    result[2].data.next.should.eql(2);
    result[2].data.next_link.should.eql('es/pagina/2/');
    result[2].data.__index.should.be.true;
    result[2].data.lang.should.eql('es');

    result[3].path.should.eql('es/pagina/2/');
    result[3].data.current_url.should.eql('es/pagina/2/');
    result[3].data.posts.should.eql(esPosts.skip(2));
    result[3].data.prev.should.eql(1);
    result[3].data.prev_link.should.eql('es/');
    result[3].data.next.should.eql(0);
    result[3].data.next_link.should.eql('');
    result[3].data.__index.should.be.true;
    result[3].data.lang.should.eql('es');

    // Restore config
    hexo.config.index_generator.per_page = 10;
  });

  it('pagination disabled', function() {
    hexo.config.index_generator.per_page = 0;

    var result = generator(locals);

    result.length.should.eql(2);

    result[0].path.should.eql('en/');
    result[0].layout.should.eql(['index', 'archive']);
    result[0].data.base.should.eql('en/');
    result[0].data.total.should.eql(1);
    result[0].data.current.should.eql(1);
    result[0].data.current_url.should.eql('en/');
    result[0].data.posts.should.eql(enPosts);
    result[0].data.prev.should.eql(0);
    result[0].data.prev_link.should.eql('');
    result[0].data.next.should.eql(0);
    result[0].data.next_link.should.eql('');
    result[0].data.__index.should.be.true;
    result[0].data.lang.should.eql('en');

    result[1].path.should.eql('es/');
    result[1].layout.should.eql(['index', 'archive']);
    result[1].data.base.should.eql('es/');
    result[1].data.total.should.eql(1);
    result[1].data.current.should.eql(1);
    result[1].data.current_url.should.eql('es/');
    result[1].data.posts.should.eql(esPosts);
    result[1].data.prev.should.eql(0);
    result[1].data.prev_link.should.eql('');
    result[1].data.next.should.eql(0);
    result[1].data.next_link.should.eql('');
    result[1].data.__index.should.be.true;
    result[1].data.lang.should.eql('es');

    // Restore config
    hexo.config.index_generator.per_page = 10;
  });

  describe('order', function() {
    it('default order', function() {
      var result = generator(locals);

      result[0].data.posts.should.eql(enPosts);
      result[1].data.posts.should.eql(esPosts);
    });

    it('custom order', function() {
      hexo.config.index_generator.order_by = '-order';

      var result = generator(locals);

      result[0].data.posts.eq(0).source.should.eql('two');
      result[0].data.posts.eq(1).source.should.eql('three');
      result[0].data.posts.eq(2).source.should.eql('one');

      result[1].data.posts.eq(0).source.should.eql('dos');
      result[1].data.posts.eq(1).source.should.eql('tres');
      result[1].data.posts.eq(2).source.should.eql('uno');

      hexo.config.index_generator.order_by = 'order';

      result = generator(locals);

      result[0].data.posts.eq(0).source.should.eql('one');
      result[0].data.posts.eq(1).source.should.eql('three');
      result[0].data.posts.eq(2).source.should.eql('two');

      result[1].data.posts.eq(0).source.should.eql('uno');
      result[1].data.posts.eq(1).source.should.eql('tres');
      result[1].data.posts.eq(2).source.should.eql('dos');

      // Restore config
      hexo.config.index_generator.order_by = '-date';
    });

    it('custom order - invalid order key', function() {
      hexo.config.index_generator.order_by = '-something';

      var result = generator(locals);

      result[0].data.posts.eq(0).source.should.eql('one');
      result[0].data.posts.eq(1).source.should.eql('two');
      result[0].data.posts.eq(2).source.should.eql('three');

      result[1].data.posts.eq(0).source.should.eql('uno');
      result[1].data.posts.eq(1).source.should.eql('dos');
      result[1].data.posts.eq(2).source.should.eql('tres');

      // Restore config
      hexo.config.index_generator.order_by = '-date';
    });
  });
});
