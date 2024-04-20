# Create Radio

## Role allowed
`admin`, `user`

# URL
`/radios`

# Method
`POST`

# Data Params
| Name | Type | Rules |
| --- | --- | --- |
| name | string | Optional |
| imei | string | Required |
| serial | string | Optional |
| model_code | string | Required |
| status_code | string | Optional |
| sim_code | string | Optional |
| client_code | string | Optional |

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
