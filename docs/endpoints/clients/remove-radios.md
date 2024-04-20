# Remove Radios

## Role allowed
`admin`, `user`

## URL
`/clients/:code/radios`

## Method
`DELETE`

## URL Params
| Name | Type | Description |
| --- | --- | --- |
| code | string | Client code |

## Data Params
| Name | Type |
| --- | --- |
| radios_codes | string[] |

```json
{
    "radios_codes": "..."
}
```