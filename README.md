# hexo-generator-multilingual-index

[![Build Status](https://travis-ci.org/ahaasler/hexo-generator-multilingual-index.svg?branch=master)](https://travis-ci.org/ahaasler/hexo-generator-multilingual-index)
[![NPM version](https://badge.fury.io/js/hexo-generator-multilingual-index.svg)](http://badge.fury.io/js/hexo-generator-multilingual-index)
[![Coverage Status](https://img.shields.io/coveralls/ahaasler/hexo-generator-multilingual-index.svg)](https://coveralls.io/r/ahaasler/hexo-generator-multilingual-index?branch=master)
[![Dependency Status](https://gemnasium.com/ahaasler/hexo-generator-multilingual-index.svg)](https://gemnasium.com/ahaasler/hexo-generator-multilingual-index)

Multilingual index generator for [Hexo](http://hexo.io/).

## Installation

``` bash
$ npm install hexo-generator-multilingual-index --save
```

## Options

``` yaml
index_generator:
  per_page: 10
  order_by: -date
```

- **per_page**: Posts displayed per page. (0 = disable pagination).
- **order_by**: Posts order. (Order by date descending by default).

## License

MIT
