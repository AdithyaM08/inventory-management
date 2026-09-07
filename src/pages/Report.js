import { useEffect, useState } from "react";
import { getVendors } from "../services/vendorService";
import {
  getMaterialCategories,
  getMaterialTypes,
  getUnits,
} from "../services/materialService";
import { getPurchaseDetails } from "../services/inventoryService";

function Report() {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);

  const [vendorName, setVendorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [purchases, setPurchases] = useState([]);

  // Selected vendor details
  const [vendorDetails, setVendorDetails] = useState(null);

  useEffect(() => {
    getVendors()
      .then((response) => {
        setVendors(response.data);
      })
      .catch((error) => {
        console.error("Error loading vendors:", error);
      });

    getMaterialCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

    getMaterialTypes()
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Error loading types:", error);
      });

    getUnits()
      .then((response) => {
        setUnits(response.data);
      })
      .catch((error) => {
        console.error("Error loading units:", error);
      });
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const reportData = {
      fromDate: fromDate,
      toDate: toDate,
      vendorName: vendorName,
    };

    // Find selected vendor details
    const selectedVendor = vendors.find(
      (vendor) => vendor.vendorName === vendorName,
    );

    setVendorDetails(selectedVendor || null);

    getPurchaseDetails(reportData)
      .then((response) => {
        setPurchases(response.data);
      })
      .catch((error) => {
        console.error("Error loading purchase report:", error);
        alert("Failed to load purchase report.");
      });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (category) => category.categoryId === categoryId,
    );

    return category ? category.categoryName : categoryId;
  };

  const getTypeName = (typeId) => {
    const type = types.find((type) => type.typeId === typeId);

    return type ? type.typeName : typeId;
  };

  const getUnitName = (unitId) => {
    const unit = units.find((unit) => unit.unitId === unitId);

    return unit ? unit.unitName : unitId;
  };

  return (
    <div className="report-container">
      <h1>Purchase Report</h1>

      <form className="report-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label>From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>To Date</label>

          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Vendor</label>

          <select
            value={vendorName}
            onChange={(event) => {
              setVendorName(event.target.value);
              setVendorDetails(null);
              setPurchases([]);
            }}
          >
            <option value="">Select Vendor</option>

            {vendors.map((vendor) => (
              <option key={vendor.vendorId} value={vendor.vendorName}>
                {vendor.vendorName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Vendor Details */}

      {purchases.length > 0 && vendorDetails && (
        <div className="vendor-summary">
          <span>
            <strong>Vendor Address:</strong> {vendorDetails.vendorAddress}
          </span>

          <span>
            <strong>Contact Person:</strong> {vendorDetails.contactPerson}
          </span>

          <span>
            <strong>Contact Number:</strong> {vendorDetails.contactNumber}
          </span>
        </div>
      )}

      {/* Purchase Details */}

      {purchases.length > 0 && (
        <div className="report-results">
          <h2>Purchase Details</h2>

          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Brand</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.purchaseId}>
                    <td>{purchase.transactionId}</td>

                    <td>{purchase.vendorName}</td>

                    <td>{getCategoryName(purchase.materialCategoryId)}</td>

                    <td>{getTypeName(purchase.materialTypeId)}</td>

                    <td>{purchase.brandName}</td>

                    <td>{getUnitName(purchase.unitId)}</td>

                    <td>{purchase.quantity}</td>

                    <td>{purchase.purchaseAmount}</td>

                    <td>{purchase.purchaseDate}</td>

                    <td>{purchase.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {purchases.length === 0 && (
        <p className="no-results">No purchase records found.</p>
      )}
    </div>
  );
}

export default Report;
