# Clients Radios

## URL
`/clients/:code/radios`

## Method
`GET`

## URL Params
| Name | Type | Description |
| --- | --- | --- |
| code | string | Client code |

## URL Params
See [List URL Parameters](../../params/list.md)

## Success Response
| Name | Type | Description |
| --- | --- | --- |
| data | array | Array of [radios](../../response/radios.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

```json
{
    "data": [...],
    "pagination": {...}
}
```