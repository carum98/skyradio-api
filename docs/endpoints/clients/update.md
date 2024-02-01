# Update Create

## URL
`/clients/:code`

## Method
`PUT`

## URL Params
| Name | Type | Description |
| --- | --- | --- |
| code | string | Client code |

## Data Params
| Name | Type |
| --- | --- |
| name | string |
| color | string |
| modality_code | string |
| seller_code | string |

```json
{
    "name": "Client Name",
    "color": "#FF0000",
    "modality_code": "MODALITY_CODE",
    "seller_code": "SELLER_CODE"
}
```