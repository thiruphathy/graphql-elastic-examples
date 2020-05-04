OrderLine - OrderHeaderKey,[ItemId and lineSeqNo]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
GET orderline_pqa_v1/_search

{
    "query": {
      "bool": {
        "filter": [
          {
            "bool": {
              "should": [
                {
                  "match": {
                    "orderHeaderKey": "20200327095118652084402"
                  }
                }
              ],
              "minimum_should_match": 1
            }
          },
          {
            "bool": {
              "should": [
                {
                  "bool": {
                    "filter": [
                      {
                        "bool": {
                          "should": [
                            {
                              "match": {
                                "itemId": "00000000004961"
                              }
                            }
                          ],
                          "minimum_should_match": 1
                        }
                      },
                      {
                        "bool": {
                          "should": [
                            {
                              "match": {
                                "lineSeqNo": "14.1"
                              }
                            }
                          ],
                          "minimum_should_match": 1
                        }
                      }
                    ]
                  }
                },
                {
                  "bool": {
                    "filter": [
                      {
                        "bool": {
                          "should": [
                            {
                              "match": {
                                "itemId": "00750100310839"
                              }
                            }
                          ],
                          "minimum_should_match": 1
                        }
                      },
                      {
                        "bool": {
                          "should": [
                            {
                              "match": {
                                "lineSeqNo": "25.1"
                              }
                            }
                          ],
                          "minimum_should_match": 1
                        }
                      }
                    ]
                  }
                }
              ],
              "minimum_should_match": 1
            }
          }
        ]
      }
    },
    "sort": [
      {
        "orderCreateTS": {
          "order": "asc"
        }
      }
    ]
  }











Order - enterpriseKey,DocumentType,
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
GET order_pqa_v1/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "bool": {
            "filter": [
              {
                "bool": {
                  "should": [
                    {
                      "match": {
                        "enterpriseKey": "WM_GM"
                      }
                    }
                  ],
                  "minimum_should_match": 1
                }
              },
              {
                "bool": {
                  "should": [
                    {
                      "match": {
                        "documentType":"0001"
                      }
                    }
                  ],
                  "minimum_should_match": 1
                }
              },
              {
                "bool": {
                  "should": [
                    {
                      "match": {
                        "entryType" :"MobileWeb"
                      }
                    }
                  ],
                  "minimum_should_match": 1
                }
              },
              {
                "bool": {
                  "should": [
                    {
                      "match": {
                        "customerEmailId" :"endinvoive@end.com"
                      }
                    }
                  ],
                  "minimum_should_match": 1
                }
              }
            ]
          }
        }
      ]
    }
  },
  "sort": [
    {
      "orderCreateTS": {
        "order": "asc"
      }
    }
  ]
}