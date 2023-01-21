// bank

const bankBCA = {
  status_code: '201',
  status_message: 'Success, Bank Transfer transaction is created',
  transaction_id: 'c417d749-76e8-471b-be46-750492dab093',
  order_id: '123456789',
  merchant_id: 'G083725240',
  gross_amount: '10000.00',
  currency: 'IDR',
  payment_type: 'bank_transfer',
  transaction_time: '2023-01-20 07:41:59',
  transaction_status: 'pending',
  fraud_status: 'accept',
  va_numbers: [ { bank: 'bca', va_number: '25240541834' } ]
}

const bankBRI = {
  status_code: '201',
  status_message: 'Success, Bank Transfer transaction is created',
  transaction_id: '9de0ff36-be9c-4d8e-bdf2-6e029c310f00',
  order_id: 'INV202312119450301',
  merchant_id: 'G083725240',
  gross_amount: '100000.00',
  currency: 'IDR',
  payment_type: 'bank_transfer',
  transaction_time: '2023-01-21 19:04:52',
  transaction_status: 'pending',
  va_numbers: [ { bank: 'bri', va_number: '252400556431079567' } ],
  fraud_status: 'accept',
  expiry_time: '2023-01-22 19:04:52'
}

const bankMandiri ={
  status_code: '201',
  status_message: 'Success, PERMATA VA transaction is successful',
  transaction_id: 'a841b2cd-f887-4a59-b1bf-177efec0a9a9',
  order_id: 'INV202312119545438',
  gross_amount: '100000.00',
  currency: 'IDR',
  payment_type: 'bank_transfer',
  transaction_time: '2023-01-21 19:05:47',
  transaction_status: 'pending',
  fraud_status: 'accept',
  permata_va_number: '252003243893913',
  merchant_id: 'G083725240'
}

const bankPermata = {
  status_code: '201',
  status_message: 'Success, PERMATA VA transaction is successful',
  transaction_id: '85d478c7-e4f9-446d-b054-da0412241c00',
  order_id: 'INV202312119616427',
  gross_amount: '100000.00',
  currency: 'IDR',
  payment_type: 'bank_transfer',
  transaction_time: '2023-01-21 19:06:18',
  transaction_status: 'pending',
  fraud_status: 'accept',
  permata_va_number: '252001753789850',
  merchant_id: 'G083725240'
}