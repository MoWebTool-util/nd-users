'use strict'

var $ = require('nd-jquery')
var chai = require('chai')
var expect = chai.expect
var Users = require('../index')


/*globals describe,before,after*/
describe('Cascade', function() {
  var users
  before(function() {
    users = new Users().render()
  })

  after(function() {
    users && users.destroy()
  })

})
