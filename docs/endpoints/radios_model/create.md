# Create Radio Model

## Role allowed
`admin`

## URL
`/radios-model`

## Method
`POST`

## Data Params
| Name | Type | Rule |
| --- | --- | --- |
| name | string | Required |
| color | string | Required, Format: `#RRGGBB` |

```json
{
    "name": "Radio model name",
    "color": "#000000"
}
```