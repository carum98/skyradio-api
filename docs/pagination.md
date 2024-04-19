# Pagination

## Introduction
The pagination is used in endpoints that return a list of items, to provide a way to get a subset of the data. The pagination 
is passed as query parameters in the URL.

## Syntax
The pagination is passed as query parameters in the URL. The syntax is `?page=number&per_page=number`. Where `page` is the number of the page to get, and `per_page` is the number of items per page.

## Parameters
The following parameters are available:
- **page**: The number of the page to get. The first page is 1. If the page is not provided, the default value is 1.
- **per_page**: The number of items per page. If the per_page is not provided, the default value is 10.

## Response
The response with pagination will have the following structure:
```json
{
    "data": [],
    "pagination": {
        "page": 1,
        "per_page": 10,
        "total": 7,
        "total_pages": 1
    }
}
```
Where:
- **data**: The list of items in the current page.
- **pagination**: The pagination information.
    - **page**: The number of the current page.
    - **per_page**: The number of items per page.
    - **total**: The total number of items.
    - **total_pages**: The total number of pages.


## Examples
- Get the first page with 10 items per page: `?page=1&per_page=10`.
- Get the second page with 20 items per page: `?page=2&per_page=20`.