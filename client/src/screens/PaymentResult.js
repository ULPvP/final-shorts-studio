export default function result() {
    return {
    "id": "8NN10499MG466503V",
    "intent": "CAPTURE",
    "status": "COMPLETED",
    "purchase_units": [
      {
        "reference_id": "default",
        "amount": {
          "currency_code": "USD",
          "value": "203.49"
        },
        "payee": {
          "email_address": "null",
          "merchant_id": "EVH5DGXR7346G"
        },
        "shipping": {
          "name": {
            "full_name": ""
          },
          "address": {
            "address_line_1": "1 Main St",
            "admin_area_2": "San Jose",
            "admin_area_1": "CA",
            "postal_code": "95131",
            "country_code": "US"
          }
        },
        "payments": {
          "captures": [
            {
              "id": "5FN01251BB685954Y",
              "status": "COMPLETED",
              "amount": {
                "currency_code": "USD",
                "value": "203.49"
              },
              "final_capture": true,
              "seller_protection": {
                "status": "ELIGIBLE",
                "dispute_categories": [
                  "ITEM_NOT_RECEIVED",
                  "UNAUTHORIZED_TRANSACTION"
                ]
              },
              "create_time": "2021-06-02T11:45:26Z",
              "update_time": "2021-06-02T11:45:26Z"
            }
          ]
        }
      }
    ],
    "payer": {
      "name": {
        "given_name": "John",
        "surname": "Doe"
      },
      "email_address": "sb-egt476401983@personal.example.com",
      "payer_id": "GZSPEJZVEUKQS",
      "address": {
        "country_code": "US"
      }
    },
    "create_time": "2021-06-02T11:44:29Z",
    "update_time": "2021-06-02T11:45:26Z",
    "links": [
      {
        "href": "https://api.sandbox.paypal.com/v2/checkout/orders/8NN10499MG466503V",
        "rel": "self",
        "method": "GET"
      }
    ]
}}