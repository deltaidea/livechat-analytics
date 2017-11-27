var ANALYTICS_DOMAIN = 'https://example.com'
var CHAT_OPENED_ENDPOINT = '/chat_opened'
var PAGE_VIEW_ENDPOINT = '/page_view'

function noop() {}

function request(path, params) {
  var img = document.createElement('img');
  img.src = ANALYTICS_DOMAIN + path;
  img.onerror = img.onload = function() {
    img.parentElement.removeChild(img);
  }
  document.querySelector('body').appendChild(img);
}

function callBoth(f1, f2) {
  return function(data) {
    (f1 || noop)(data);
    (f2 || noop)(data);
  }
}

var LC_API = LC_API || {}

var addLivechatCallback = function(event, callback) {
  LC_API[event] = callBoth(LC_API[event], callback)
}

// The server sets a cookie when a chat is opened.

addLivechatCallback('on_chat_window_opened', function() {
  request(CHAT_OPENED_ENDPOINT + '?visitor_id=' + LC_API.get_visitor_id())
})

// Log page views. If the `visitor_id` cookie is not set, these requests should be ignored.

// Track initial page load.
request(PAGE_VIEW_ENDPOINT + '?page_url=' + encodeURIComponent(window.location.toString()))

// Track HTML5 History API page changes.
window.addEventListener('popstate', function(event) {
  request(PAGE_VIEW_ENDPOINT + '?page_url=' + encodeURIComponent(window.location.toString()))
})
