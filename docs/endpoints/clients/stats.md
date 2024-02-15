# Clients Stats

## URL
`/clients/stats/all`

## Method
`GET`

## Success Response

### Sellers
| Name | Type | Description |
| --- | --- | --- |
| code | string | Seller code |
| name | string | Seller name |
| count | integer | Total clients |

### Modality
| Name | Type | Description |
| --- | --- | --- |
| code | string | Modality code |
| name | string | Modality name |
| color | string | Modality color |
| count | integer | Total clients |

### Models
| Name | Type | Description |
| --- | --- | --- |
| code | string | Model code |
| name | string | Model name |
| color | string | Model color |
| count | integer | Total clients |

### Providers
| Name | Type | Description |
| --- | --- | --- |
| code | string | Provider code |
| name | string | Provider name |
| color | string | Provider color |
| count | integer | Total clients |

### Clients
| Name | Type | Description |
| --- | --- | --- |
| code | string | Client code |
| name | string | Client name |
| color | string | Client color |
| count | integer | Total clients |
| models | array | Array of [models](#models) |
| providers | array | Array of [providers](#providers) |

## Response
| Name | Type | Description |
| --- | --- | --- |
| sellers | array | Array of [sellers](#sellers) |
| modalities | array | Array of [modalities](#modalities) |
| clients | array | Array of [clients](#clients) |

```json
{
    "sellers": [
        {
            "code": "b0w64z",
            "name": "Seller 1",
            "count": 10
        }
    ],
    "modalities": [
        {
            "code": "djs07s",
            "name": "Modality 1",
            "color": "#FF0000",
            "count": 30
        }
    ],
    "clients": [
        {
            "code": "djs07s",
            "name": "Client 1",
            "color": "#FF0000",
            "count": 30,
            "models": [
                {
                    "code": "djs07s",
                    "name": "Model 1",
                    "color": "#FF0000",
                    "count": 30
                }
            ],
            "providers": [
                {
                    "code": "djs07s",
                    "name": "Provider 1",
                    "color": "#FF0000",
                    "count": 30
                }
            ]
        }
    ]
}
```