'use strict';
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var DB_PATH = path.join(process.cwd(), 'data.json');

var DEFAULT = {
  users: [],
  posts: [],
  tags: [],
  post_tags: [],
  comments: [],
  likes: [],
  friends: [],
  chatter: [],
  projects: [],
  music: [],
  settings: []
};

var _cache = null;
var _lastLoad = 0;

function load() {
  var now = Date.now();
  if (_cache && (now - _lastLoad < 1000)) return JSON.parse(JSON.stringify(_cache));
  try {
    var raw = fs.readFileSync(DB_PATH, 'utf8');
    _cache = JSON.parse(raw);
  } catch (e) {
    _cache = JSON.parse(JSON.stringify(DEFAULT));
  }
  for (var k in DEFAULT) {
    if (!_cache[k]) _cache[k] = [];
  }
  _lastLoad = now;
  return JSON.parse(JSON.stringify(_cache));
}

function save(data) {
  _cache = JSON.parse(JSON.stringify(data));
  _lastLoad = Date.now();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save db:', e.message);
  }
}

function uid() {
  return crypto.randomBytes(8).toString('hex');
}

var db = {
  all: function(collection) { return (load()[collection] || []).slice(); },
  get: function(collection, id) {
    return (load()[collection] || []).find(function(item) { return item.id == id; }) || null;
  },
  findBy: function(collection, key, value) {
    return (load()[collection] || []).find(function(item) { return item[key] == value; }) || null;
  },
  filter: function(collection, fn) {
    return (load()[collection] || []).filter(fn);
  },
  insert: function(collection, item) {
    var data = load();
    if (!item.id) item.id = uid();
    if (!item.created_at) item.created_at = new Date().toISOString();
    data[collection].push(item);
    save(data);
    return item;
  },
  update: function(collection, id, updates) {
    var data = load();
    var items = data[collection];
    var idx = items.findIndex(function(item) { return item.id == id; });
    if (idx === -1) return null;
    updates.updated_at = new Date().toISOString();
    Object.assign(items[idx], updates);
    save(data);
    return items[idx];
  },
  delete: function(collection, id) {
    var data = load();
    var len = data[collection].length;
    data[collection] = data[collection].filter(function(item) { return item.id != id; });
    if (data[collection].length === len) return false;
    save(data);
    return true;
  },
  count: function(collection, fn) {
    if (fn) return this.filter(collection, fn).length;
    return (load()[collection] || []).length;
  },
  raw: function() { return load(); },
  persist: function(data) { save(data); }
};

// Initialize admin synchronously on first load
var data = load();
if (!data.users || data.users.length === 0) {
  var bcrypt = require('bcryptjs');
  var initPwd = process.env.ADMIN_INIT_PASSWORD || crypto.randomBytes(6).toString('hex');
  var hash = bcrypt.hashSync(initPwd, 10);
  data.users.push({ id: 'admin-001', username: 'admin', password: hash, created_at: new Date().toISOString() });
  save(data);
  console.log('Admin created: admin / ' + initPwd);
}

module.exports = db;
