'use strict';
'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');

class Conveyance extends Model {}

Conveyance.init(
  {
    loadPort: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    portTransShip: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    portDischarge: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    inlandDestination: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    finalDelivery: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    airlineName: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    billMasterAirway: {
      type: DataTypes.STRING,
    },
    billHouseAirway: {
      type: DataTypes.STRING,
    },
    flightNum1: {
      type: DataTypes.STRING,
    },
    flightDate1: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    flightNum2: {
      type: DataTypes.STRING,
    },
    flightDate2: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    etd: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    eta: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    shippingLineName: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    vesselName: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    voyageNum: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    oceanBoLnum: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    houseBoLnum: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    containerNum: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    sealNum: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    shippedOnboardDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    etaFinalPort: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    truckRegNo: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    truckType: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isIn: [['12 tonner', 'tri-axle', 'super-link']], // ETC.....
      },
    },
  },
  {
    sequelize,
    modelName: 'Conveyance',
    timestamps: true,
  },
);

Conveyance.sync();

module.exports = Conveyance;
