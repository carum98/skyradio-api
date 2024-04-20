# Swap Radios

## Role allowed
`admin`, `user`

## URL
`/clients/:code/radios`

## Method
`PUT`

## URL Params
| Name | Type | Description |
| --- | --- | --- |
| code | string | Client code |

## Data Params
| Name | Type |
| --- | --- |
| radio_code_from | string |
| radio_code_to | string |

```json
{
    "radio_code_from": "...",
    "radio_code_to": "..."
}
