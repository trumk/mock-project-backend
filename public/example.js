export const createCategory = {
    name: "Sach tieng viet",
    image: "image.jpg",
    parent: "67ed7d7260d26963e1b3489f",
}

export const createCategory1 = {
    name: "Sach tieng viet",
    image: "image.jpg",
    parent: null,
}

export const register = {
    email : "TrungNXT@gmail.com",
    password : "@Trung123456"
}

export const getALl = [
    {
        "_id": "67ed7b937f27eda30c90dc04",
        "name": "Sach tieng viet",
        "image": "image",
        "parent": null,
        "layer": 0,
        "__v": 0
    },
    {
        "_id": "67ed7d7260d26963e1b3489f",
        "name": "vv",
        "image": "vvv",
        "parent": null,
        "layer": 0,
        "__v": 0
    },
    {
        "_id": "67ed7d935dded92049e9c228",
        "name": "Sach tieng viet",
        "image": "image",
        "parent": "67ed7b937f27eda30c90dc04",
        "layer": 1,
        "__v": 0
    },
    {
        "_id": "67ed7de1a8df7ca5373c0e88",
        "name": "Sach tieng anh",
        "image": "image",
        "parent": "67ed7d7260d26963e1b3489f",
        "layer": 1,
        "__v": 0
    }
]

export const getByLayer = [
    {
        "_id": "67ed7d935dded92049e9c228",
        "name": "Sach tieng viet",
        "image": "image",
        "parent": "67ed7b937f27eda30c90dc04",
        "layer": 1,
        "__v": 0
    },
    {
        "_id": "67ed7de1a8df7ca5373c0e88",
        "name": "Sach tieng anh",
        "image": "image",
        "parent": "67ed7d7260d26963e1b3489f",
        "layer": 1,
        "__v": 0
    }
]

export const getAllChild = {
    "category": {
        "_id": "67ed7de1a8df7ca5373c0e88",
        "name": "Sach tieng anh",
        "image": "image",
        "parent": "67ed7d7260d26963e1b3489f",
        "layer": 1,
        "ancestors": [
            {
                "_id": "67ed7d7260d26963e1b3489f",
                "name": "vv",
                "image": "vvv",
                "parent": null,
                "layer": 0,
                "__v": 0
            }
        ]
    },
    "children": [],
    "bookChildren": [
        {
            "_id": "67ee7f12c13ae0ecad0e0c01",
            "author": [
                {
                    "name": "gg",
                    "_id": "67ee7f12c13ae0ecad0e0c02"
                },
                {
                    "name": "gga",
                    "_id": "67ee7f12c13ae0ecad0e0c03"
                }
            ],
            "category": "67ed7de1a8df7ca5373c0e88",
            "name": "Harry Potter and the Philosopher's Stone",
            "description": "A young wizard's first year at Hogwarts School of Witchcraft and Wizardry.",
            "image": [
                "https://example.com/images/hp1.jpg",
                "https://example.com/images/hp1_2.jpg"
            ],
            "list_price": 199.99,
            "original_price": 249.99,
            "rating_average": 3.9,
            "short_description": "The first book in the Harry Potter series.",
            "quantity_sold": 206,
            "specifications": [
                {
                    "name": "Thông tin chung",
                    "attributes": [
                        {
                            "name": "Page count",
                            "value": "320",
                            "_id": "67ee7f12c13ae0ecad0e0c05"
                        },
                        {
                            "name": "Publisher",
                            "value": "Bloomsbury",
                            "_id": "67ee7f12c13ae0ecad0e0c06"
                        }
                    ],
                    "_id": "67ee7f12c13ae0ecad0e0c04"
                }
            ],
            "__v": 0
        }
    ]
}

export const deleteCategory = {
    "success": true,
    "message": "Category and its hierarchy deleted successfully.",
    "categoryDeleted": {
        "_id": "67ed7d7260d26963e1b3489f",
        "name": "vv",
        "image": "vvv",
        "parent": null,
        "layer": 0,
        "__v": 0
    },
    "deletedCategoriesCount": 2,
    "deletedBooksCount": 1
}

export const createBook = {
    "author": [
        {
            "name": "J.K. Rowling"
        },
        {
            "name": "Author 2"
        }
    ],
    "category": "67ed7d935dded92049e9c228",
    "name": "Harry Potter and the Philosopher's Stone",
    "description": "A young wizard's journey to uncover the mysteries surrounding his first year at Hogwarts.",
    "image": [
        "https://example.com/harry-potter-1.jpg",
        "https://example.com/harry-potter-2.jpg"
    ],
    "list_price": 20.99,
    "original_price": 25.00,
    "short_description": "The first book in the Harry Potter series.",
    "specifications": [
        {
            "name": "Thông tin chung",
            "attributes": [
                {
                    "name": "Publisher",
                    "value": "Bloomsbury"
                },
                {
                    "name": "Year of Publication",
                    "value": "1997"
                },
                {
                    "name": "Pages",
                    "value": "223"
                }
            ]
        }
    ]
}

export const getBooks = [
    {
        "_id": "67eeb7556785963b869ae220",
        "author": [
            {
                "name": "J.K. Rowling",
                "_id": "67eeb7556785963b869ae221"
            },
            {
                "name": "Author 2",
                "_id": "67eeb7556785963b869ae222"
            }
        ],
        "category": "67ed7d935dded92049e9c228",
        "name": "Harry Potter and the Philosopher's Stone",
        "description": "A young wizard's journey to uncover the mysteries surrounding his first year at Hogwarts.",
        "image": [
            "https://example.com/harry-potter-1.jpg",
            "https://example.com/harry-potter-2.jpg"
        ],
        "list_price": 20.99,
        "original_price": 25,
        "rating_average": 2.1,
        "short_description": "The first book in the Harry Potter series.",
        "quantity_sold": 188,
        "specifications": [
            {
                "name": "Thông tin chung",
                "attributes": [
                    {
                        "name": "Publisher",
                        "value": "Bloomsbury",
                        "_id": "67eeb7556785963b869ae224"
                    },
                    {
                        "name": "Year of Publication",
                        "value": "1997",
                        "_id": "67eeb7556785963b869ae225"
                    },
                    {
                        "name": "Pages",
                        "value": "223",
                        "_id": "67eeb7556785963b869ae226"
                    }
                ],
                "_id": "67eeb7556785963b869ae223"
            }
        ],
        "__v": 0
    }
]