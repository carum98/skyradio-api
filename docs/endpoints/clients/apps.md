# Clients Apps

## Role allowed
All

## URL
`/clients/:code/apps`

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
| data | array | Array of [apps](../../response/apps.md) |
| pagination | object | Pagination data ([pagination](../../response/pagination.md)) |

```json
{
    "data": [...],
    "pagination": {...}
}
```