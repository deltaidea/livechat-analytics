// See https://docs.livechatinc.com/js-api/#using-chat-window-api
var LC_API = LC_API || {}

function getChatOpenedUrl() {
  return 'https://example.com/chat_opened?visitor_id=' + LC_API.get_visitor_id()
}

function getPageViewUrl() {
  return 'https://example.com/page_view?page_url=' + encodeURIComponent(window.location.toString())
}

function request(url, params) {
  var img = document.createElement('img');
  img.src = url;
  img.onerror = img.onload = function() {
    img.parentElement.removeChild(img);
  }
  document.querySelector('body').appendChild(img);
}

function callBoth(f1, f2, context) {
  return function() {
    if (f1) f1.apply(context || window, arguments)
    if (f2) f2.apply(context || window, arguments)
  }
}

var addLivechatCallback = function(event, callback) {
  LC_API[event] = callBoth(LC_API[event], callback, LC_API)
}

// The server sets a cookie when a chat is opened.

addLivechatCallback('on_chat_window_opened', function() {
  request(getChatOpenedUrl())
})

// Log page views. If the `visitor_id` cookie is not set, these requests should be ignored.

// Track initial page load.
request(getPageViewUrl())

// Track HTML5 History API page changes.
window.addEventListener('popstate', function(event) {
  request(getPageViewUrl())
})

// There's no event for `pushState`, workaround:
window.history.pushState = callBoth(window.history.pushState, function() {
  request(getPageViewUrl())
}, window.history)
