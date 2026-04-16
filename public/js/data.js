export const detailsArray = [
  'incoterms',
  'mode',
  'routing',
  'goodsDescriptions',
  'packagingType',
  'containerSpecs',
  'containerQty',
  'numItems',
  'grossWeightKg',
  'netWeightKg',
  'cbm',
  'handlingRequirements',
  'dangerousGoods',
  'codeDrg',
  'detailsMasterId',
];

export const conveyanceArray = [
  'loadPort',
  'portTransShip',
  'portDischarge',
  'inlandDestination',
  'finalDelivery',
  'airlineName',
  'billMasterAirway',
  'billHouseAirway',
  'flightNum1',
  'flightDate1',
  'flightNum2',
  'flightDate2',
  'etd',
  'eta',
  'shippingLineName',
  'vesselName',
  'voyageNum',
  'oceanBoLnum',
  'houseBoLnum',
  'containerNum',
  'sealNum',
  'shippedOnboardDate',
  'etaFinalPort',
  'truckRegNo',
  'truckType',
  'conveyanceMasterId',
];

export const customsArray = [
  'agent',
  'agentCode',
  'bOeNum',
  'bOeReleaseDate',
  'bOeAssessDate',
  'releaseDepot',
  'lrnNum',
  'mrnNum',
  'customsMasterId',
];

export const financialsArray = [
  'shipperInvoiceNum',
  'invoiceDate',
  'invoiceAmount',
  'currency',
  'tradeRef',
  'apnNum',
  'bank',
  'apnDate',
  'financialsMasterId',
];

export const shipperArray = [
  'shippersMasterId',
  'companyName',
  'contactName',
  'phoneLandline',
  'phoneMobile',
  'emailPrimary',
  'emailSecondary',
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'country',
];

export const customerKeyArray = [
  'userId',
  'companyName',
  'phoneLandline',
  'phoneMobile',
  'emailPri',
  'emailSec',
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'country',
];

export const customerIdArray = [
  'userId',
  'companyName_1',
  'phoneLandline_1',
  'phoneMobile_1',
  'emailPri',
  'emailSec',
  'addressLine1_1',
  'addressLine2_1',
  'addressLine3_1',
  'country_1',
];

export const consigneesKeyArray = [
  'consigneesMasterId',
  'companyName',
  'phoneLandline',
  'phoneMobile',
  'emailPri',
  'emailSec',
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'country',
];

export const consigneesIdArray = [
  'consigneesMasterId',
  'companyName_2',
  'phoneLandline_2',
  'phoneMobile_2',
  'emailPri_1',
  'emailSec_1',
  'addressLine1_2',
  'addressLine2_2',
  'addressLine3_2',
  'country_2',
];

export const iterator = (obj, str) => {
  for (let x of Object.keys(obj)) {
    if (x === str) return x;
  }
  return undefined;
};

// export const iterator = (obj, str, type) => {
//   if (type === 'submit') {
//     for (let x of Object.keys(obj)) {
//       if (x === str) return x;
//     }
//     return undefined;
//   } else if (type === 'update') {
//     //for (let y of Objec)
//   }
// };

export const toggleHidden = (el) => {
  const [a, b, c, d] = el;
  a.classList.add('hidden');
  b.classList.add('hidden');
  c.classList.remove('hidden');
  d.classList.remove('hidden');
};

export const initialize = (el) => {
  el.classList.add('hidden');
};

export const setObject = (arr) => {
  const object = {};
  for (const key of arr) {
    object[key] = null;
  }
  arr.forEach((el) => {
    const node = document.getElementById(el);
    if (!node) return;
    let key = iterator(object, el);
    object[key] = node.value;
  });
  return object;
};
export const timelineKeysArr = [
  'cargo_collected',
  'received',
  'cargo_packed',
  'depot_lrd',
  'cargo_loaded',
  'cargo_departed',
  'obl_awb',
  'anf_pre',
  'customer',
  'payment',
  'line',
  'clearing',
  'delivery',
  'signed',
  'sars',
  'cargo_arrived',
  'cargo_released',
  'cargo_unpacked',
  'cargo_delivered',
  'doc',
];

export const metaArray = [
  {
    name: 'Shipment-details',
    array: [
      'incoterms',
      'mode',
      'routing',
      'goodsDescriptions',
      'packagingType',
      'containerSpecs',
      'containerQty',
      'numItems',
      'grossWeightKg',
      'netWeightKg',
      'cbm',
      'handlingRequirements',
      'dangerousGoods',
      'codeDrg',
      'detailsMasterId',
    ],
  },
  {
    name: 'Conveyance',
    array: [
      'loadPort',
      'portTransShip',
      'portDischarge',
      'inlandDestination',
      'finalDelivery',
      'airlineName',
      'billMasterAirway',
      'billHouseAirway',
      'flightNum1',
      'flightDate1',
      'flightNum2',
      'flightDate2',
      'etd',
      'eta',
      'shippingLineName',
      'vesselName',
      'voyageNum',
      'oceanBoLnum',
      'houseBoLnum',
      'containerNum',
      'sealNum',
      'shippedOnboardDate',
      'etaFinalPort',
      'truckRegNo',
      'truckType',
      'conveyanceMasterId',
    ],
  },
  {
    name: 'Customs',
    array: [
      'agent',
      'agentCode',
      'bOeNum',
      'bOeReleaseDate',
      'bOeAssessDate',
      'releaseDepot',
      'lrnNum',
      'mrnNum',
      'customsMasterId',
    ],
  },
  {
    name: 'Financials',
    array: [
      'shipperInvoiceNum',
      'invoiceDate',
      'invoiceAmount',
      'currency',
      'tradeRef',
      'apnNum',
      'bank',
      'apnDate',
      'financialsMasterId',
    ],
  },
  {
    name: 'Shippers',
    array: [
      'shippersMasterId',
      'companyName',
      'contactName',
      'phoneLandline',
      'phoneMobile',
      'emailPrimary',
      'emailSecondary',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'country',
    ],
  },
  {
    name: 'Timelines',
    array: [
      'cargo_collected',
      'received',
      'cargo_packed',
      'depot_lrd',
      'cargo_loaded',
      'cargo_departed',
      'obl_awb',
      'anf_pre',
      'customer',
      'payment',
      'line',
      'clearing',
      'delivery',
      'signed',
      'sars',
      'cargo_arrived',
      'cargo_released',
      'cargo_unpacked',
      'cargo_delivered',
      'doc',
    ],
  },
  {
    name: 'Customers',
    array: [
      'userId',
      'companyName',
      'phoneLandline',
      'phoneMobile',
      'emailPri',
      'emailSec',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'country',
    ],
  },

  {
    name: 'Consignees',
    array: [
      'consigneesMasterId',
      'companyName',
      'phoneLandline',
      'phoneMobile',
      'emailPri',
      'emailSec',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'country',
    ],
  },
];
