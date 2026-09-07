function Home() {
  return (
    <div className="home-container">

      <div className="home-content">
        <h1>Inventory Management System</h1>

        <p>
          Manage vendors, materials and purchase details
          efficiently in one place.
        </p>

        <div className="home-cards">

          <div className="home-card">
            <h2>Purchase Entry</h2>
            <p>
              Add and manage new material purchase details.
            </p>
          </div>

          <div className="home-card">
            <h2>Purchase Report</h2>
            <p>
              Search and view existing purchase records.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;