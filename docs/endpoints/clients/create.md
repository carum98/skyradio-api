## Create client

## Role allowed
`admin`, `user`

## URL
`/clients`

## Method
`POST`

## Data Params
| Name | Type | Rules |
| --- | --- | --- |
| name | string | Required |
| color | string | Required, Format: `#RRGGBB` |
| modality_code | string | Required |
| seller_code | string | Optional |

```json
{
    "name": "Client Name",
    "color": "#FF0000",
    "modality_code": "MODALITY_CODE",
    "seller_code": "SELLER_CODE"
}
```

## Success Response
See [Client Model](../../response/clients.md)
