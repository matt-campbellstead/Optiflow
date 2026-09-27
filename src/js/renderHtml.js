const timeObject = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const renderCustomerHtml = (data) => {
  return `<div class="shipment-box-detail">
      Customer
      <table>
        <thead></thead>
        <tbody>
          <tr>
            <th>ID:</th>
            <td>${data.id}</td>
          </tr>
          <tr>
            <th>Customer's user ID:</th>
            <td>${data.userId}</td>
          </tr>
          <tr>
            <th>Company Name:</th>
            <td>${data.companyName}</td>
          </tr>
          <tr>
            <th>Phone (landline):</th>
            <td>${data.phoneLandline}</td>
          </tr>
          <tr>
            <th>Phone (mobile):</th>
            <td>${data.phoneMobile}</td>
          </tr>
          <tr>
            <th>Primary Email:</th>
            <td>${data.emailPri}</td>
          </tr>
          <tr>
            <th>Secondary Email:</th>
            <td>${data.emailSec}</td>
          </tr>
          <tr>
            <th>Street:</th>
            <td>${data.addressLine1}</td>
          </tr>
          <tr>
            <th>Suburb:</th>
            <td>${data.addressLine2}</td>
          </tr>
          <tr>
            <th>City &amp; Province/State:</th>
            <td>${data.addressLine3}</td>
          </tr>
          <tr>
            <th>Country:</th>
            <td>${data.country}</td>
          </tr>
          <tr>
            <th>Created:</th>
            <td>${data.createdAt.toLocaleString('en-ZA', timeObject)}</td>
          </tr>
          <tr>
            <th>Updated:</th>
            <td>${data.updatedAt.toLocaleString('en-ZA', timeObject)}</td>
          </tr>
        </tbody>
      </table>
    </div>`;
};

const renderDetailHtml = (data) => {
  return `<div class="shipment-box-detail">
      Shipment Details
      <table>
        <thead></thead>
        <tbody>
          <tr>
            <th>ID:</th>
            <td>${data.id}</td>
          </tr>
          <tr>
            <th>Incoterms:</th>
            <td>${data.incoterms}</td>
          </tr>
          <tr>
            <th>Routing:</th>
            <td>${data.routing}</td>
          </tr>
          <tr>
            <th>Goods:</th>
            <td>${data.goodsDescriptions}</td>
          </tr>
          <tr>
            <th>Type of packaging:</th>
            <td>${data.packagingType}</td>
          </tr>
          <tr>
            <th>Container specifications:</th>
            <td>${data.containerSpecs}</td>
          </tr>
          <tr>
            <th>Container quantity:</th>
            <td>${data.containerQty}</td>
          </tr>
          <tr>
            <th>Number of items:</th>
            <td>${data.numItems}</td>
          </tr>
          <tr>
            <th>Gross weight:</th>
            <td>${data.grossWeightKg}</td>
          </tr>
          <tr>
            <th>Net weight:</th>
            <td>${data.netWeightKg}</td>
          </tr>
          <tr>
            <th>Volumetric weight:</th>
            <td>${data.cbm}</td>
          </tr>
          <tr>
            <th>Handling requirements:</th>
            <td>${data.handlingRequirements}</td>
          </tr>
          <tr>
            <th>Dangerous goods?</th>
            <td>${data.dangerousGoods}</td>
          </tr>
          <tr>
            <th>Dangerous goods code:</th>
            <td>${data.codeDrg}</td>
          </tr>
          <tr>
            <th>Created At:</th>
            <td>${data.createdAt.toLocaleString('en-ZA', timeObject)}</td>
          </tr>
          <tr>
            <th>Updated at:</th>
            <td>${data.updatedAt.toLocaleString('en-ZA', timeObject)}</td>
          </tr>
        </tbody>
      </table>
    </div>`;
};

const renderShipperHtml = (data) => {
  return `<div class="shipment-box-detail">
      Shipper
      <table>
        <thead></thead>
        <tbody>
          <tr><th>ID:</th><td>${data.id}</td></tr>
          <tr><th>Company:</th><td>${data.companyName}</td></tr>
          <tr><th>Phone (landline):</th><td>${data.phoneLandline}</td></tr>
          <tr><th>Phone (mobile):</th><td>${data.phoneMobile}</td></tr>
          <tr><th>Primary Email:</th><td>${data.emailPrimary}</td></tr>
          <tr><th>Secondary Email:</th><td>${data.emailSecondary}</td></tr>
          <tr><th>Street:</th><td>${data.addressLine1}</td></tr>
          <tr><th>Suburb:</th><td>${data.addressLine2}</td></tr>
          <tr><th>City &amp; Province/State:</th><td>${data.addressLine3}</td></tr>
          <tr><th>Country:</th><td>${data.country}</td></tr>
        </tbody>
      </table>
    </div>`;
};

const renderConsigneeHtml = (data) => {
  return `<div class="shipment-box-detail">
      Consignee
      <table>
        <thead></thead>
        <tbody>
          <tr><th>ID:</th><td>${data.id}</td></tr>
          <tr><th>Company:</th><td>${data.companyName}</td></tr>
          <tr><th>Phone (landline):</th><td>${data.phoneLandline}</td></tr>
          <tr><th>Phone (mobile):</th><td>${data.phoneMobile}</td></tr>
          <tr><th>Primary Email:</th><td>${data.emailPri}</td></tr>
          <tr><th>Secondary Email:</th><td>${data.emailSec}</td></tr>
          <tr><th>Street:</th><td>${data.addressLine1}</td></tr>
          <tr><th>Suburb:</th><td>${data.addressLine2}</td></tr>
          <tr><th>City &amp; Province/State:</th><td>${data.addressLine3}</td></tr>
          <tr><th>Country:</th><td>${data.country}</td></tr>
        </tbody>
      </table>
    </div>`;
};

const renderFinancialHtml = (data) => {
  return `<div class="shipment-box-detail">
      Financial
      <table>
        <thead></thead>
        <tbody>
          <tr><th>ID:</th><td>${data.id}</td></tr>
          <tr><th>Shipper Invoice #:</th><td>${data.shipperInvoiceNum}</td></tr>
          <tr><th>Invoice Date:</th><td>${data.invoiceDate.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Invoice Amount:</th><td>${data.invoiceAmount}</td></tr>
          <tr><th>Currency:</th><td>${data.currency}</td></tr>
          <tr><th>Trade Reference:</th><td>${data.tradeRef}</td></tr>
          <tr><th>APN Number:</th><td>${data.apnNum}</td></tr>
          <tr><th>Bank:</th><td>${data.bank}</td></tr>
          <tr><th>APN Date:</th><td>${data.apnDate.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Created:</th><td>${data.createdAt.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Updated:</th><td>${data.updatedAt.toLocaleString('en-ZA', timeObject)}</td></tr>
        </tbody>
      </table>
    </div>`;
};

const renderConveyanceHtml = (data) => {
  return `<div class="shipment-box-detail">
      Conveyance
      <table>
        <thead></thead>
        <tbody>
          <tr><th>ID:</th><td>${data.id}</td></tr>
          <tr><th>Load Port:</th><td>${data.loadPort}</td></tr>
          <tr><th>Port Trans-shipment:</th><td>${data.portTransShip}</td></tr>
          <tr><th>Port Discharge:</th><td>${data.portDischarge}</td></tr>
          <tr><th>Inland Destination:</th><td>${data.inlandDestination}</td></tr>
          <tr><th>Final Delivery:</th><td>${data.finalDelivery}</td></tr>
          <tr><th>Airline Name:</th><td>${data.airlineName}</td></tr>
          <tr><th>Master Airway Bill:</th><td>${data.billMasterAirway}</td></tr>
          <tr><th>House Airway Bill:</th><td>${data.billHouseAirway}</td></tr>
          <tr><th>Flight Number 1:</th><td>${data.flightNum1}</td></tr>
          <tr><th>Flight Date 1:</th><td>${data.flightDate1.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Flight Number 2:</th><td>${data.flightNum2}</td></tr>
          <tr><th>Flight Date 2:</th><td>${data.flightDate2.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>ETD:</th><td>${data.etd.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>ETA:</th><td>${data.eta.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Shipping Line Name:</th><td>${data.shippingLineName}</td></tr>
          <tr><th>Vessel Name:</th><td>${data.vesselName}</td></tr>
          <tr><th>Voyage Number:</th><td>${data.voyageNum}</td></tr>
          <tr><th>Ocean Bill of Lading:</th><td>${data.oceanBoLnum}</td></tr>
          <tr><th>House Bill of Lading:</th><td>${data.houseBoLnum}</td></tr>
          <tr><th>Container Number:</th><td>${data.containerNum}</td></tr>
          <tr><th>Seal Number:</th><td>${data.sealNum}</td></tr>
          <tr><th>Shipped Onboard Date:</th><td>${data.shippedOnboardDate.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>ETA Final Port:</th><td>${data.etaFinalPort.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Truck Registration:</th><td>${data.truckRegNo}</td></tr>
          <tr><th>Truck Type:</th><td>${data.truckType}</td></tr>
          <tr><th>Created:</th><td>${data.createdAt.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Updated:</th><td>${data.updatedAt.toLocaleString('en-ZA', timeObject)}</td></tr>
        </tbody>
      </table>
    </div>`;
};

const renderCustomsHtml = (data) => {
  return `<div class="shipment-box-detail">
      Customs
      <table>
        <thead></thead>
        <tbody>
          <tr><th>ID:</th><td>${data.id}</td></tr>
          <tr><th>Agent:</th><td>${data.agent}</td></tr>
          <tr><th>Agent Code:</th><td>${data.agentCode}</td></tr>
          <tr><th>BOE Number:</th><td>${data.bOeNum}</td></tr>
          <tr><th>BOE Release Date:</th><td>${data.bOeReleaseDate.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>BOE Assessment Date:</th><td>${data.bOeAssessDate.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Release Depot:</th><td>${data.releaseDepot}</td></tr>
          <tr><th>LRN Number:</th><td>${data.lrnNum}</td></tr>
          <tr><th>MRN Number:</th><td>${data.mrnNum}</td></tr>
          <tr><th>Created:</th><td>${data.createdAt.toLocaleString('en-ZA', timeObject)}</td></tr>
          <tr><th>Updated:</th><td>${data.updatedAt.toLocaleString('en-ZA', timeObject)}</td></tr>
        </tbody>
      </table>
    </div>`;
};

export const renderFileHtml = (data) => {
  let html = '';

  const navHtml = `<div class="file__container">
  <h2 class="heading-secondary">Master ID: ${data.id}</h2>
  <p class="shipment-box_label">File number: ${data.shipment_file_id}</p>
  <span class="shipment-box_label">🛳️🛳️🛳️ Voilà! 🛳️🛳️🛳️</span>
  <div class="table-nav-box">
    <button class="file-editor-btn">Customer</button
    ><button class="file-editor-btn">Shipment Details</button
    ><button class="file-editor-btn">Shipper</button
    ><button class="file-editor-btn">Consignee</button
    ><button class="file-editor-btn">Financial</button
    ><button class="file-editor-btn">Conveyance</button
    ><button class="file-editor-btn">Customs</button>
  </div>
  <div class="shipment-box">`;

  html += navHtml;

  Object.keys(data).forEach((key) => {
    switch (key) {
      case 'Customer':
        if (data.Customer) {
          // call another rendering function
          html += renderCustomerHtml(data.Customer);
        }
        break;

      case 'Detail':
        if (data.Detail) {
          html += renderDetailHtml(data.Detail);
        }
        break;

      case 'Shipper':
        if (data.Shipper) html += renderShipperHtml(data.Shipper);
        break;

      case 'Consignee':
        if (data.Consignee) html += renderConsigneeHtml(data.Consignee);
        break;

      case 'Financial':
        if (data.Financial) html += renderFinancialHtml(data.Financial);
        break;

      case 'Conveyance':
        if (data.Conveyance) html += renderConveyanceHtml(data.Conveyance);
        break;

      case 'Customs':
        if (data.Customs) html += renderCustomsHtml(data.Customs);
        break;
    }
  });

  html += '</div></div>';
  return html;
};

export const renderUpdateTableHtml = (data) => {
  let html = `<div class="file__container">
  <div class="shipment-box">
  <div class="shipment-box-detail">
      <table>
        <thead></thead>
        <tbody>`;

  for (const [key, val] of Object.entries(data)) {
    if (key === 'id' || key === 'createdAt' || key === 'updatedAt') continue;

    html += `<tr>
            <th>${key}</th>
            <td>${val}</td>
            <td><button type='button'>Edit</button></td>
            </tr>`;
  }

  html += '</table></div></div></div>';
  return html;
};
