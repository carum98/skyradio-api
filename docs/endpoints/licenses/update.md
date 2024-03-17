# Update License

## URL
`/licenses/:code`

## Method
`PUT`

## URL Params
| Name | Type | Description |
| --- | --- | --- |
| code | string | License code |

## Data Params
| Name | Type | Rule |
| --- | --- | --- |
| key | string | Required, Min 5, Max 50 |

```json
{
    "key": "..."
}
```