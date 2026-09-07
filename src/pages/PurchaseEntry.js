import { useEffect, useState } from "react";
import { getVendors } from "../services/vendorService";
import {
  getMaterialCategories,
  getMaterialTypesByCategory,
  getUnitsByCategory,
} from "../services/materialService";
import { addPurchaseDetail } from "../services/inventoryService";

function PurchaseEntry() {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);

  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const [brandName, setBrandName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const [errors, setErrors] = useState({});
  const [successPurchase, setSuccessPurchase] = useState(null);

  const normalizeTypeOptions = (items = []) =>
    items.map((item) => ({
      typeId: item.typeId ?? item.materialTypeId ?? item.id,
      typeName: item.typeName ?? item.materialTypeName ?? item.name,
    }));

  const normalizeUnitOptions = (items = []) =>
    items.map((item) => ({
      unitId: item.unitId ?? item.id,
      unitName: item.unitName ?? item.name,
    }));

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
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;

    setSelectedCategory(categoryId);
    setSelectedType("");
    setSelectedUnit("");

    setTypes([]);
    setUnits([]);

    if (categoryId) {
      getMaterialTypesByCategory(categoryId)
        .then((response) => {
          setTypes(normalizeTypeOptions(response.data));
        })
        .catch((error) => {
          console.error("Error loading material types:", error);
        });

      getUnitsByCategory(categoryId)
        .then((response) => {
          setUnits(normalizeUnitOptions(response.data));
        })
        .catch((error) => {
          console.error("Error loading units:", error);
        });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedVendor) {
      newErrors.vendor = "Please select a vendor.";
    }

    if (!selectedCategory) {
      newErrors.category = "Please select a material category.";
    }

    if (!selectedType) {
      newErrors.type = "Please select a material type.";
    }

    if (!brandName.trim()) {
      newErrors.brandName = "Brand name is required.";
    }

    if (!selectedUnit) {
      newErrors.unit = "Please select a unit.";
    }

    if (!quantity) {
      newErrors.quantity = "Quantity is required.";
    } else if (Number(quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0.";
    }

    if (!purchaseAmount) {
      newErrors.purchaseAmount = "Purchase amount is required.";
    } else if (Number(purchaseAmount) <= 0) {
      newErrors.purchaseAmount =
        "Purchase amount must be greater than 0.";
    }

    if (!purchaseDate) {
      newErrors.purchaseDate = "Purchase date is required.";
    } else {
      const today = new Date().toISOString().split("T")[0];

      if (purchaseDate > today) {
        newErrors.purchaseDate =
          "Purchase date cannot be in the future.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedVendorObject = vendors.find(
      (vendor) => vendor.vendorId === selectedVendor
    );

    const selectedCategoryObject = categories.find(
      (category) => category.categoryId === selectedCategory
    );

    const selectedTypeObject = types.find(
      (type) => type.typeId === selectedType
    );

    const selectedUnitObject = units.find(
      (unit) => unit.unitId === selectedUnit
    );

    const purchaseData = {
      vendorName: selectedVendorObject
        ? selectedVendorObject.vendorName
        : "",

      materialCategoryId: selectedCategory,

      materialTypeId: selectedType,

      brandName: brandName.trim(),

      unitId: selectedUnit,

      quantity: Number(quantity),

      purchaseAmount: Number(purchaseAmount),

      purchaseDate: purchaseDate,
    };

    addPurchaseDetail(purchaseData)
      .then((response) => {
        const successfulPurchase = {
          vendorName: purchaseData.vendorName,

          categoryName: selectedCategoryObject
            ? selectedCategoryObject.categoryName
            : selectedCategory,

          typeName: selectedTypeObject
            ? selectedTypeObject.typeName
            : selectedType,

          brandName: purchaseData.brandName,

          unitName: selectedUnitObject
            ? selectedUnitObject.unitName
            : selectedUnit,

          quantity: purchaseData.quantity,

          purchaseAmount: purchaseData.purchaseAmount,

          purchaseDate: purchaseData.purchaseDate,

          // Transaction ID comes from response.data.purchase
          transactionId: response.data.purchase
            ? response.data.purchase.transactionId
            : "",

          message:
            response.data.message || "Purchase details added successfully",
        };

        setSuccessPurchase(successfulPurchase);

        // Clear form
        setSelectedVendor("");
        setSelectedCategory("");
        setSelectedType("");
        setSelectedUnit("");
        setTypes([]);
        setUnits([]);
        setBrandName("");
        setQuantity("");
        setPurchaseAmount("");
        setPurchaseDate("");
        setErrors({});
      })
      .catch((error) => {
        console.error("Error adding purchase:", error);
        alert("Failed to add purchase.");
      });
  };

  return (
    <div className="purchase-container">
      <h1>Purchase Entry</h1>

      <form onSubmit={handleSubmit} className="purchase-form">
        <div className="form-group">
          <label>Vendor</label>

          <select
            value={selectedVendor}
            onChange={(event) => {
              setSelectedVendor(event.target.value);
              setErrors((prev) => ({ ...prev, vendor: "" }));
            }}
          >
            <option value="">Select Vendor</option>

            {vendors.map((vendor) => (
              <option key={vendor.vendorId} value={vendor.vendorId}>
                {vendor.vendorName}
              </option>
            ))}
          </select>

          {errors.vendor && (
            <small className="error-message">
              {errors.vendor}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Material Category</label>

          <select
            value={selectedCategory}
            onChange={(event) => {
              setErrors((prev) => ({ ...prev, category: "" }));
              handleCategoryChange(event);
            }}
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category.categoryId}
                value={category.categoryId}
              >
                {category.categoryName}
              </option>
            ))}
          </select>

          {errors.category && (
            <small className="error-message">
              {errors.category}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Material Type</label>

          <select
            value={selectedType}
            onChange={(event) => {
              setSelectedType(event.target.value);
              setErrors((prev) => ({ ...prev, type: "" }));
            }}
          >
            <option value="">Select Type</option>

            {types.map((type) => (
              <option key={type.typeId} value={type.typeId}>
                {type.typeName}
              </option>
            ))}
          </select>

          {errors.type && (
            <small className="error-message">
              {errors.type}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Brand Name</label>

          <input
            type="text"
            placeholder="Enter brand name"
            value={brandName}
            onChange={(event) => {
              setBrandName(event.target.value);
              setErrors((prev) => ({ ...prev, brandName: "" }));
            }}
          />

          {errors.brandName && (
            <small className="error-message">
              {errors.brandName}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Unit</label>

          <select
            value={selectedUnit}
            onChange={(event) => {
              setSelectedUnit(event.target.value);
              setErrors((prev) => ({ ...prev, unit: "" }));
            }}
          >
            <option value="">Select Unit</option>

            {units.map((unit) => (
              <option key={unit.unitId} value={unit.unitId}>
                {unit.unitName}
              </option>
            ))}
          </select>

          {errors.unit && (
            <small className="error-message">
              {errors.unit}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Quantity</label>

          <input
            type="number"
            min="1"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value);
              setErrors((prev) => ({ ...prev, quantity: "" }));
            }}
          />

          {errors.quantity && (
            <small className="error-message">
              {errors.quantity}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Purchase Amount</label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter purchase amount"
            value={purchaseAmount}
            onChange={(event) => {
              setPurchaseAmount(event.target.value);
              setErrors((prev) => ({
                ...prev,
                purchaseAmount: "",
              }));
            }}
          />

          {errors.purchaseAmount && (
            <small className="error-message">
              {errors.purchaseAmount}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Purchase Date</label>

          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={purchaseDate}
            onChange={(event) => {
              setPurchaseDate(event.target.value);
              setErrors((prev) => ({
                ...prev,
                purchaseDate: "",
              }));
            }}
          />

          {errors.purchaseDate && (
            <small className="error-message">
              {errors.purchaseDate}
            </small>
          )}
        </div>

        <div className="form-submit">
          <button type="submit">
            Add Purchase
          </button>
        </div>
      </form>

      {successPurchase && (
        <div className="success-purchase">
          <h2>Material Purchase Details</h2>

          <div className="purchase-details">
            <div className="detail-row">
              <span>Vendor Name</span>
              <strong>{successPurchase.vendorName}</strong>
            </div>

            <div className="detail-row">
              <span>Material Category</span>
              <strong>{successPurchase.categoryName}</strong>
            </div>

            <div className="detail-row">
              <span>Material Type</span>
              <strong>{successPurchase.typeName}</strong>
            </div>

            <div className="detail-row">
              <span>Brand Name</span>
              <strong>{successPurchase.brandName}</strong>
            </div>

            <div className="detail-row">
              <span>Unit</span>
              <strong>{successPurchase.unitName}</strong>
            </div>

            <div className="detail-row">
              <span>Quantity</span>
              <strong>{successPurchase.quantity}</strong>
            </div>

            <div className="detail-row">
              <span>Purchase Amount</span>
              <strong>
                ₹{Number(successPurchase.purchaseAmount).toFixed(2)}
              </strong>
            </div>

            <div className="detail-row">
              <span>Purchase Date</span>
              <strong>{successPurchase.purchaseDate}</strong>
            </div>

            <div className="detail-row transaction-row">
              <span>Transaction ID</span>
              <strong>{successPurchase.transactionId}</strong>
            </div>
          </div>

          <p className="success-message">
            ✓ {successPurchase.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PurchaseEntry;