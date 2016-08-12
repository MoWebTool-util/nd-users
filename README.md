# nd-users

[![Travis](https://img.shields.io/travis/ndfront/nd-users.svg?style=flat-square)](https://github.com/ndfront/nd-users)
[![Coveralls](https://img.shields.io/coveralls/ndfront/nd-users.svg?style=flat-square)](https://github.com/ndfront/nd-users)
[![NPM version](https://img.shields.io/npm/v/nd-users.svg?style=flat-square)](https://npmjs.org/package/nd-users)

> 搜索选人删人组件

## 安装

```bash
$ npm install nd-users --save
```

## 使用

```js
var UsersModel = require('model/uc/users')
var user = require('misc/user')
var Users = require('nd-users')

function makeGranters(uids) {
  return new Users($.extend(true, {
    uids: uids,
    source: user.getUsers,
    proxy: new UsersModel()
  }, plugin.getOptions('view'))).before('render', function() {
    this.confirm.on('confirm', function() {
      plugin.trigger('submit')
    }).on('cancel', function() {
      plugin.trigger('hide', this)
    })
  })
}
// use nd-users
```
## 在表单里面使用
```js
function makeGranters(uids) {
  return new FormExtra($.extend(true, {
    fields: [
      {
        name: 'uids',
        attrs: {
          'x-type': 'users',
          required: 'required',
          uids: JSON.stringify(uids)
        }
      }
    ],
    pluginCfg: {
      'Users': [function(){
        this.setOptions('config',{
          proxy: new UsersModel(),
          source: user.getUsers
        })
      }]
    }
  }, plugin.getOptions('view')))
}

```
- 样式可以引入src中的users.css的默认样式
