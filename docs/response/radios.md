| Field | Type | Description |
| --- | --- | --- |
| code | string | Radio's code |
| name | string | Radio's name |
| imei | string | Radio's IMEI |
| serial | string | Radio's serial |
| model | string | Radio's model |
| model.code | string | Model's code |
| model.name | string | Model's name |
| model.color | string | Model's color |
| sim | object | Radio's SIM |
| sim.code | string | SIM's code |
| sim.number | string | SIM's number |
| sim.provider | object | SIM's provider |
| sim.provider.code | string | Provider's code |
| sim.provider.name | string | Provider's name |
| sim.provider.color | string | Provider's color |
| client | object | Radio's client |
| client.code | string | Client's code |
| client.name | string | Client's name |
| client.color | string | Client's color |
| status | string | Radio's status |

```json
{
    "code": "...",
    "name": "...",
    "imei": "...",
    "serial": "...",
    "model": {
        "code": "...",
        "name": "...",
        "color": "#..."
    },
    "sim": {
        "code": "...",
        "number": "...",
        "provider": {
            "code": "...",
            "name": "...",
            "color": "#..."
        }
    },
    "client": {
        "code": "...",
        "name": "...",
        "color": "#..."
    },
    "status": null
}
```