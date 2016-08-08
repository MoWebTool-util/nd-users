/**
 * @module selectUser
 * @author lzhengms <lzhengms@gmail.com>
 */

'use strict'
var $ = require('nd-jquery')
var Widget = require('nd-widget')
var Template = require('nd-template')
var handlehtml = require('nd-handlehtml')
var AutoComplete = require('nd-autocomplete')

require('theme/default/app/pack/granters.css')

var Granters = Widget.extend({
  Implements: [Template],
  templatePartials: {
    users: require('./src/partial.handlebars')
  },
  attrs: {
    classPrefix: 'ui-granters',
    template: require('./src/tmp.handlebars'),
    proxy: null, // 批量获取用户信息的proxy
    source: [], //自动补全的数据源
    uids: [], // 已选的发放人员uid
    data: null
  },
  events: {
    'click [data-role="del"]': 'delUid'
  },
  initProps: function() {
    var uids = this.get('uids')
    if (uids.length) {
      this.set('selectUids', uids.slice(0))
    }
  },
  setup: function() {
    Granters.superclass.setup.call(this)
    var that = this
    var uids = this.get('uids')
    if (uids.length) {
      var userIds = uids.map(function(uid) {
        return {
          'user_id': uid
        }
      })
      this.get('proxy').POST({
        data: userIds
      })
        .then(function(result) {
          var users = result.items.map(function(user) {
            return {
              value: user['org_exinfo']['org_user_code'],
              label: that.getUserLabel(user)
            }
          })
          that.set('data', users)
        })
    }
    // 初始化自动补全
    this.after('render', function() {
      var autoComplete = that.autoComplete(that.$('[data-role="user-id"]'))
      autoComplete.on('itemSelected', function(data) {
        var value = this.input.getValue()
        if (/\D/.test(value)) {
          value = data.value + ''
        }
        var flag = that.addUid(value)
        if (!flag) {
          return
        }
        var list = that.get('data') || []
        list.push({
          value: value,
          label: data.label
        })
        this.set('selectedIndex', -1, {
          silent: true
        })
        that.set('data', list.slice())

      })
      this.before('destroy', function() {
        autoComplete.destroy()
      })
    })
  },
  _onRenderData: function(data) {
    this.set('model', {
      items: data,
      classPrefix: this.get('classPrefix')
    })
    this._renderPartial()
  },
  _renderPartial: function() {
    this.renderPartialTemplate('users', this.get('model'))
  },
  autoComplete: function(trigger) {
    var ac = new AutoComplete({
      trigger: trigger,
      dataSource: this.get('source'),
      strict: true,
      inFilter: function(data) {
        if (/\((\d+|admin)\)/.test(data)) {
          return data.match(/\((\d+|admin)\)/)[0].slice(1, -1)
        }
        return data
      },
      outFilter: function(data) {
        if (/\D/.test(data.value)) {
          return ''
        }
        return data.value
      }
    }).render()
    return ac
  },
  getUserLabel: function(user) {
    return handlehtml.encode((user['org_exinfo']['real_name'] || user['nick_name']) + ' (' + (user['user_name'] ? user['user_name'].replace(/@.+$/, '') : user['org_exinfo']['org_user_code']) + ')')
  },
  getUids: function() {
    return this.get('selectUids') || []
  },
  delUid: function(e) {
    var uids = this.get('selectUids') || []
    var uid = $(e.currentTarget).attr('data-uid')
    uids.splice(uids.indexOf(uid), 1)
    this.set('selectUids', uids)
    this.set('data', this.get('data').filter(function(item) {
      return item.value !== uid
    }))
  },
  addUid: function(uid) {
    var uids = this.get('selectUids') || []
    if (uids.indexOf(uid) === -1) {
      uids.push(uid)
      this.set('selectUids', uids)
      return true
    }
    return false
  }

})
module.exports = Granters
