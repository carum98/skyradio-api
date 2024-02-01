| Field | Type | Description |
| --- | --- | --- |
| code | string | SIM's code |
| number | string | SIM's number |
| serial | string | SIM's serial |
| provider | object | SIM's provider |
| provider.code | string | Provider's code |
| provider.name | string | Provider's name |
| provider.color | string | Provider's color |
| radio | object | SIM's radio |
| radio.code | string | Radio's code |
| radio.name | string | Radio's name |
| radio.imei | string | Radio's IMEI |
| radio.client | object | Radio's client |
| radio.client.code | string | Client's code |
| radio.client.name | string | Client's name |
| radio.client.color | string | Client's color |

```json
{
    "code": "...",
    "number": "...",
    "serial": null,
    "provider": {
        "code": "...",
        "name": "...",
        "color": "#..."
    },
    "radio": {
        "code": "...",
        "name": "...",
        "imei": "...",
        "client": {
            "code": "...",
            "name": "...",
            "color": "#..."
        }
    }
}
