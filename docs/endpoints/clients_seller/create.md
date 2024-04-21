# Create Seller

## Role allowed
`admin`

## URL
`/clients-seller`

## Method
`POST`

## URL Params
None

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

## Success Response
See [Seller Model](../../response/seller.md)