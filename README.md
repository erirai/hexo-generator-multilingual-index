# hexo-generator-multilingual-index

[![Build Status](https://travis-ci.org/ahaasler/hexo-generator-multilingual-index.svg?branch=master)](https://travis-ci.org/ahaasler/hexo-generator-multilingual-index)
[![NPM version](https://badge.fury.io/js/hexo-generator-multilingual-index.svg)](http://badge.fury.io/js/hexo-generator-multilingual-index)
[![Coverage Status](https://img.shields.io/coveralls/ahaasler/hexo-generator-multilingual-index.svg)](https://coveralls.io/r/ahaasler/hexo-generator-multilingual-index?branch=master)
[![Dependency Status](https://gemnasium.com/ahaasler/hexo-generator-multilingual-index.svg)](https://gemnasium.com/ahaasler/hexo-generator-multilingual-index)
[![License](https://img.shields.io/badge/license-MIT%20License-blue.svg)](LICENSE)

Multilingual index generator for [Hexo](http://hexo.io/).

## Installation

``` bash
$ npm install hexo-generator-multilingual-index --save
```

## Options

You can configure this plugin in `_config.yml`.

``` yaml
index_generator:
  per_page: 10
  order_by: -date
```

- **per_page**: Posts displayed per page. (0 = disable pagination).
- **order_by**: Posts order. (Order by date descending by default).

### Localizable configuration

These are the values that this generator uses and can be [localized](https://github.com/ahaasler/hexo-multilingual#_c-configuration-locales "Configuring locales"):

- index_generator
  - per_page
  - order_by
- pagination_dir

## License

MIT
