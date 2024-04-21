# Update Seller

## Role allowed
`admin`

## URL
`/clients-seller/:code`

## Method
`PUT`

## URL Params
| Name | Type |
| --- | --- |
| code | string |

## Data Params
| Name | Type | Rule |
| --- | --- | --- |
| name | string | Required |
| user_id | string | Optional |

```json
{
    "name": "Seller name",
    "user_code": "CODE"
}
```