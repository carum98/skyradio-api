# Update Radio

## Role allowed
`admin`, `user`

## URL
`/radios/:code`

## Method
`PUT`

## URL Params
| Name | Type | Description |
| --- | --- | --- |
| code | string | Radio code |

## Data Params
| Name | Type |
| --- | --- |
| name | string |
| imei | string |
| serial | string |
| model_code | string |
| status_code | string |
| sim_code | string |
| client_code | string |

```json
{
    "name": "Radio Name",
    "imei": "IMEI",
    "serial": "SERIAL",
    "model_code": "MODEL_CODE",
    "status_code": "STATUS_CODE",
    "sim_code": "SIM_CODE",
    "client_code": "CLIENT_CODE"
}
```