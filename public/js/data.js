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
  'MasterId',
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
  'MasterId',
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
  'MasterId',
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
  'MasterId',
];

export const shipperArray = [
  'MasterId',
  'companyName',
  'contactName',
  'phoneLandline',
  ' phoneMobile',
  'emailPrimary',
  'emailSecondary',
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'country',
];
export const iterator = (obj, str) => {
  for (let x of Object.keys(obj)) {
    if (x === str) return x;
  }
  return undefined;
};
