# LiveChat Analytics script

Log embedded LiveChat events to a custom domain.

## Documentation

You can adjust the target domain at the top of the script:

```JavaScript
var ANALYTICS_DOMAIN = 'https://example.com'
var CHAT_OPENED_ENDPOINT = '/chat_opened'
var PAGE_VIEW_ENDPOINT = '/page_view'
```

The script does the following two kinds of requests.

#### `/chat_opened`

Whenever the user opens a LiveChat instance, the script sends this request:

```
GET https://yourdomain.com/chat_opened?visitor_id=<id>
```

When handling this request, you can tell the browser to add `visitor_id` to a cookie by adding this header to the HTTP response:

```
Set-Cookie: visitor_id=<id>; Expires=<date>
```

Please see examples and docs here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

#### `/page_view`

Whenever the user opens a new page (including HTML5 history changes without full page reload), the script sends this request:

```
GET https://yourdomain.com/page_view?page_url=http://currentdomain.com/foo/bar
```

When handling this request, check that `visitor_id` cookie is set.
If it's not, this is a page load before the user has opened a chat, and you should ignore this request.
