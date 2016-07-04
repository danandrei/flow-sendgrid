# flow-sendgrid
Send emails using sendgrid from flow
### Docs

* * *

### send(options, data, next) 

Send email using sendgrid API

**Parameters**

**options**: `Object`, Object containig the mail options (can also be added in the data object)

 - `template` (String):  The template name (required).
 - `to` (String):  The receiver information (required).
 - `from` (String):  The sender information (required).
 - `subject` (String):  The email subject (optional).

**data**: `Object`, Object containig the mail data
 - `mergeVars` (Object):  The object containing template substitutions (optional).

**next**: `function`, The next function.

**Example**

```JSON
{
    "flow": {

        "event": [
            ...
            [":flow_sendgrid/send", {
                "template": "someTemplateId",
                "to": "toSomeEmail@gmail.com",
                "from": "fromSomeEmail@gmail.com",
                "subject": "someEmailSubject"
            }],
            ...
        ]
    }
}
```

`options` can also be added to the data object

***Data object example***

```javascript
{
    template: "someTemplateId",
    to: "toSomeEmail@gmail.com",
    from: "fromSomeEmail@gmail.com",
    subject: "someEmailSubject"
    mergeVars: {
        "someVar": "someValue"
    }
}
```

* * *