// Categories and subcategories for financial records

//Records configurations
const CAT = Object.freeze({
  E: { // expense categories
    LABOUR: "LABOUR",
    RAW_MATERIAL: "RAW_MATERIAL",
    MAINTENANCE: "MAINTENANCE",
    PRODUCTION: "PRODUCTION_COST",
    TRAVEL: "EXPOSURE_VISIT"
  },
  I: { // income categories
    SALES: "PRODUCT_SALES",
    SERVICE: "SERVICE_FEES",
    CONSULTING: "CONSULTING_FEES"
  }
});

module.exports = CAT;