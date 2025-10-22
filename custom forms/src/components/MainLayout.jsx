     // src/components/MainLayout.jsx

import React, { useState, useEffect } from "react";
// FIX: Change OlistSection to OrderListSection to match usage in renderSection

import Dashboard from "./Dashboard";
import InventorySection from "./InventorySection";
import MenuManagement from "./MenuManagement";
import SalesReport from "./SalesReport";
import NewOrderSection from "./NewOrderSection";
import OrderListSection from "./OrderListSection";
import LocationManagement from "./LocationManagement";
import EmployeeManagement from "./EmployeeManagement";
import SupplierManagement from "./SupplierManagement";
import BranchInsights from "./BranchInsights";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import TenantManagement from "./TenantManagement";
import SystemAnalytics from "./SystemAnalytics";
import LicenseManagement from "./LicenseManagement";
import SystemSettings from "./SystemSettings";
import TrialStatus from "./TrialStatus";
import ChangePassword from "./ChangePassword";
import EmployeeManagementNew from "./EmployeeManagementNew";
import KitchenOrderQueue from "./KitchenOrderQueue";
import DataImportExport from "./DataImportExport";
import VATCalculator from "./VATCalculator";
import UserProfile from "./UserProfile";
import Contact from "./Contact";


// Helper component for the theme logic
function useTheme() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      const theme = newMode ? "dark" : "light";
      document.body.classList.toggle("dark-mode", newMode);
      localStorage.setItem("theme", theme);
      return newMode;
    });
  };

  return { darkMode, toggleTheme };
}

function MainLayout(props) {
  // Destructure props
  const {
    currentUser,
    onLogout,
    inventory,
    orders,
    menuItems,
    locations,
    employees,
    suppliers,
    currentLocation,
    setCurrentLocation,
    onAddMenuItem,
    onEditMenuItem,
    onDeleteMenuItem,
    onRecordPurchase,
    onDeleteInventoryBatch,
    onNewOrder,
    onCompleteOrder,
    onCancelOrder,
    onDeleteOrder,
    onAddLocation,
    onDeleteLocation,
    onAddEmployee,
    onDeleteEmployee,
    onAddSupplier,
    onDeleteSupplier,
    userAccounts,
    onCreateUserAccount,
    onDeleteUserAccount,
    onEditUserAccount,
    activeSection: propActiveSection,
    setActiveSection: propSetActiveSection,
    showToast,
    onImportData
  } = props;

  const [activeSection, setActiveSection] = useState(
    propActiveSection || (currentUser?.role === "admin" ? "TenantManagement" : "Dashboard")
  );
  


  const { darkMode, toggleTheme } = useTheme();

  const handleNavigation = (sectionName) => {
    if (propSetActiveSection) {
      propSetActiveSection(sectionName);
    } else {
      setActiveSection(sectionName);
    }
  };
  


  // Check license restrictions
  const checkLicenseAccess = (feature) => {
    // Admin, Super Manager, and Trial users get full access
    if (currentUser?.role === "admin" || currentUser?.role === "super_manager" || currentUser?.licenseType === 'trial') return true;

    const licenseType = currentUser?.licenseType || 'trial';
    const featureAccess = {
      trial: {
        maxMenuItems: -1, // Unlimited
        maxOrders: -1, // Unlimited
        features: ['Dashboard', 'Orders', 'NewOrder', 'Inventory', 'Menu', 'Sales', 'Employees', 'Locations', 'Suppliers', 'Insights', 'Kitchen', 'VATCalculator', 'DataImportExport']
      },
      professional: {
        maxMenuItems: 100,
        maxOrders: 500,
        features: ['Dashboard', 'Orders', 'NewOrder', 'Inventory', 'Menu', 'Sales', 'Employees', 'Locations', 'Suppliers']
      },
      enterprise: {
        maxMenuItems: -1, // Unlimited
        maxOrders: -1, // Unlimited
        features: ['Dashboard', 'Orders', 'NewOrder', 'Inventory', 'Menu', 'Sales', 'Employees', 'Locations', 'Suppliers', 'Insights', 'Kitchen', 'VATCalculator', 'DataImportExport']
      }
    };

    return featureAccess[licenseType]?.features.includes(feature) || false;
  };
  
  const getLicenseLimits = () => {
    const licenseType = currentUser?.licenseType || 'trial';
    const limits = {
      trial: { maxMenuItems: -1, maxOrders: -1 }, // Unlimited for trial
      professional: { maxMenuItems: 100, maxOrders: 500 },
      enterprise: { maxMenuItems: -1, maxOrders: -1 }
    };
    return limits[licenseType];
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <Dashboard
            inventory={inventory}
            orders={orders}
            menuItems={menuItems}
          />
        );
      case "Orders":
        return (
          <OrderListSection
            orders={orders}
            onCompleteOrder={onCompleteOrder}
            onCancelOrder={onCancelOrder}
            onDeleteOrder={onDeleteOrder}
            currentUser={currentUser}
          />
        );
      case "NewOrder":
        return (
          <NewOrderSection menuItems={menuItems} onNewOrder={onNewOrder} />
        );
      case "Inventory":
        return (
          <InventorySection
            inventory={inventory}
            onRecordPurchase={onRecordPurchase}
            onDeleteInventoryBatch={onDeleteInventoryBatch}
            menuItems={menuItems}
          />
        );
      case "Menu":
        return (
          <MenuManagement
            menuItems={menuItems}
            onAddMenuItem={onAddMenuItem}
            onEditMenuItem={onEditMenuItem}
            onDeleteMenuItem={onDeleteMenuItem}
          />
        );
      case "Sales":
        if (currentUser?.role !== "manager" && currentUser?.role !== "super_manager") {
          return <div className="access-denied">Access Denied: Manager privileges required</div>;
        }
        return <SalesReport orders={orders} />;
      case "Insights":
        if (currentUser?.role !== "super_manager") {
          return <div className="access-denied">Access Denied: Super Manager privileges required</div>;
        }
        return (
          <BranchInsights
            locations={locations}
            employees={employees}
            suppliers={suppliers}
            userAccounts={userAccounts}
          />
        );
      case "TenantManagement":
        if (currentUser?.role !== "admin") {
          return <div className="access-denied">Access Denied: Admin privileges required</div>;
        }
        return (
          <TenantManagement
            userAccounts={userAccounts}
            onCreateUserAccount={onCreateUserAccount}
            onDeleteUserAccount={onDeleteUserAccount}
            onEditUserAccount={onEditUserAccount}
          />
        );
      case "UserManagement":
        if (currentUser?.role !== "admin") {
          return <div className="access-denied">Access Denied: Admin privileges required</div>;
        }
        return (
          <UserManagement
            userAccounts={userAccounts}
            onCreateUserAccount={onCreateUserAccount}
            onDeleteUserAccount={onDeleteUserAccount}
            onEditUserAccount={onEditUserAccount}
          />
        );
      case "Subscriptions":
        if (currentUser?.role !== "admin") {
          return <div className="access-denied">Access Denied: Admin privileges required</div>;
        }
        return (
          <SubscriptionManagement
            locations={locations}
            onAddLocation={onAddLocation}
            onDeleteLocation={onDeleteLocation}
          />
        );
      case "SystemAnalytics":
        if (currentUser?.role !== "admin") {
          return <div className="access-denied">Access Denied: Admin privileges required</div>;
        }
        return (
          <SystemAnalytics
            userAccounts={userAccounts}
          />
        );
      case "LicenseManagement":
        if (currentUser?.role !== "admin") {
          return <div className="access-denied">Access Denied: Admin privileges required</div>;
        }
        return (
          <LicenseManagement
            userAccounts={userAccounts}
          />
        );
      case "SystemSettings":
        if (currentUser?.role !== "admin") {
          return <div className="access-denied">Access Denied: Admin privileges required</div>;
        }
        return (
          <SystemSettings />
        );
      case "Change Password":
        return (
          <ChangePassword 
            currentUser={currentUser}
            onPasswordChange={props.onPasswordChange}
            showToast={showToast}
          />
        );
      case "Locations":
        if (currentUser?.role !== "manager" && currentUser?.role !== "super_manager") {
          return <div className="access-denied">Access Denied: Manager privileges required</div>;
        }
        return (
          <LocationManagement
            locations={locations}
            onAddLocation={onAddLocation}
            onDeleteLocation={onDeleteLocation}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
          />
        );
      case "Employees":
        if (currentUser?.role !== "manager" && currentUser?.role !== "super_manager") {
          return <div className="access-denied">Access Denied: Manager privileges required</div>;
        }
        return (
          <EmployeeManagement
            employees={employees}
            onAddEmployee={onAddEmployee}
            onDeleteEmployee={onDeleteEmployee}
            locations={locations}
            currentUser={currentUser}
            userAccounts={userAccounts}
            onCreateUserAccount={onCreateUserAccount}
            onDeleteUserAccount={onDeleteUserAccount}
          />
        );
      case "Suppliers":
        if (currentUser?.role !== "manager" && currentUser?.role !== "super_manager") {
          return <div className="access-denied">Access Denied: Manager privileges required</div>;
        }
        return (
          <SupplierManagement
            suppliers={suppliers}
            onAddSupplier={onAddSupplier}
            onDeleteSupplier={onDeleteSupplier}
          />
        );
      case "Kitchen":
        return (
          <KitchenOrderQueue
            orders={orders}
            onCompleteOrder={onCompleteOrder}
            onKitchenStatusChange={props.onKitchenStatusChange}
            currentUser={currentUser}
          />
        );
      case "DataImportExport":
        return (
          <DataImportExport
            inventory={inventory}
            orders={orders}
            menuItems={menuItems}
            employees={employees}
            suppliers={suppliers}
            locations={locations}
            onImportData={onImportData}
            currentUser={currentUser}
          />
        );
      case "VATCalculator":
        return <VATCalculator />;
      case "UserProfile":
        return (
          <UserProfile
            currentUser={currentUser}
            onEditUserAccount={onEditUserAccount}
            showToast={showToast}
          />
        );
      case "Contact":
        return <Contact />;

      default:
        if (currentUser?.role === "admin") {
          return (
            <TenantManagement
              userAccounts={userAccounts}
              onCreateUserAccount={onCreateUserAccount}
              onDeleteUserAccount={onDeleteUserAccount}
              onEditUserAccount={onEditUserAccount}
            />
          );
        }
        return (
          <Dashboard
            inventory={inventory}
            orders={orders}
            menuItems={menuItems}
          />
        );
    }
  };

  const isLinkActive = (section) => ((propActiveSection || activeSection) === section ? "active" : "");
  
  // Update activeSection when prop changes
  React.useEffect(() => {
    if (propActiveSection && propActiveSection !== activeSection) {
      setActiveSection(propActiveSection);
    }
  }, [propActiveSection]);

  return (
    <div id="main-app-container">
      <header className="crm-header">
        <h1 
          id="appTitle" 
          className="crm-title"
          onClick={() => handleNavigation("Dashboard")}
          style={{ cursor: "pointer" }}
        >
          Emporos Nexus
        </h1>
        <nav className="crm-nav">
          {/* CASHIER ROLE */}
          {currentUser?.role === "cashier" && (
            <div className="nav-section">
              <span className="nav-section-title">Cashier</span>
              <div className="nav-dropdown">
                <a href="#" onClick={() => handleNavigation("Dashboard")} className={isLinkActive("Dashboard")}>Dashboard</a>
                <a href="#" onClick={() => handleNavigation("NewOrder")} className={isLinkActive("NewOrder")}>New Order</a>
                <a href="#" onClick={() => handleNavigation("Orders")} className={isLinkActive("Orders")}>Orders</a>
                <a href="#" onClick={() => handleNavigation("VATCalculator")} className={isLinkActive("VATCalculator")}>VAT Calculator</a>
              </div>
            </div>
          )}

          {/* CHEF ROLE */}
          {currentUser?.role === "chef" && (
            <div className="nav-section">
              <span className="nav-section-title">Kitchen</span>
              <div className="nav-dropdown">
                <a href="#" onClick={() => handleNavigation("Kitchen")} className={isLinkActive("Kitchen")}>Kitchen Orders</a>
                <a href="#" onClick={() => handleNavigation("Menu")} className={isLinkActive("Menu")}>Menu Items</a>
              </div>
            </div>
          )}

          {/* WAITER ROLE */}
          {currentUser?.role === "waiter" && (
            <div className="nav-section">
              <span className="nav-section-title">Service</span>
              <div className="nav-dropdown">
                <a href="#" onClick={() => handleNavigation("Dashboard")} className={isLinkActive("Dashboard")}>Dashboard</a>
                <a href="#" onClick={() => handleNavigation("NewOrder")} className={isLinkActive("NewOrder")}>Take Order</a>
                <a href="#" onClick={() => handleNavigation("Orders")} className={isLinkActive("Orders")}>Order Status</a>
                <a href="#" onClick={() => handleNavigation("Kitchen")} className={isLinkActive("Kitchen")}>Kitchen Status</a>
              </div>
            </div>
          )}

          {/* MANAGER ROLE */}
          {currentUser?.role === "manager" && (
            <>
              <div className="nav-section">
                <span className="nav-section-title">Operations</span>
                <div className="nav-dropdown">
                  <a href="#" onClick={() => handleNavigation("Dashboard")} className={isLinkActive("Dashboard")}>Dashboard</a>
                  <a href="#" onClick={() => handleNavigation("NewOrder")} className={isLinkActive("NewOrder")}>New Order</a>
                  <a href="#" onClick={() => handleNavigation("Orders")} className={isLinkActive("Orders")}>Orders</a>
                  <a href="#" onClick={() => handleNavigation("Kitchen")} className={isLinkActive("Kitchen")}>Kitchen</a>
                </div>
              </div>
              <div className="nav-section">
                <span className="nav-section-title">Management</span>
                <div className="nav-dropdown">
                  <a href="#" onClick={() => handleNavigation("Menu")} className={isLinkActive("Menu")}>Menu</a>
                  <a href="#" onClick={() => handleNavigation("Inventory")} className={isLinkActive("Inventory")}>Inventory</a>
                  <a href="#" onClick={() => handleNavigation("Employees")} className={isLinkActive("Employees")}>Staff</a>
                  <a href="#" onClick={() => handleNavigation("Sales")} className={isLinkActive("Sales")}>Sales Report</a>
                </div>
              </div>
            </>
          )}

          {/* SUPER MANAGER ROLE */}
          {currentUser?.role === "super_manager" && (
            <>
              <div className="nav-section">
                <span className="nav-section-title">Operations</span>
                <div className="nav-dropdown">
                  <a href="#" onClick={() => handleNavigation("Dashboard")} className={isLinkActive("Dashboard")}>Dashboard</a>
                  <a href="#" onClick={() => handleNavigation("NewOrder")} className={isLinkActive("NewOrder")}>New Order</a>
                  <a href="#" onClick={() => handleNavigation("Orders")} className={isLinkActive("Orders")}>Orders</a>
                  <a href="#" onClick={() => handleNavigation("Kitchen")} className={isLinkActive("Kitchen")}>Kitchen</a>
                </div>
              </div>
              <div className="nav-section">
                <span className="nav-section-title">Management</span>
                <div className="nav-dropdown">
                  <a href="#" onClick={() => handleNavigation("Menu")} className={isLinkActive("Menu")}>Menu</a>
                  <a href="#" onClick={() => handleNavigation("Inventory")} className={isLinkActive("Inventory")}>Inventory</a>
                  <a href="#" onClick={() => handleNavigation("Employees")} className={isLinkActive("Employees")}>Staff</a>
                  <a href="#" onClick={() => handleNavigation("Locations")} className={isLinkActive("Locations")}>Locations</a>
                  <a href="#" onClick={() => handleNavigation("Suppliers")} className={isLinkActive("Suppliers")}>Suppliers</a>
                </div>
              </div>
              <div className="nav-section">
                <span className="nav-section-title">Analytics</span>
                <div className="nav-dropdown">
                  <a href="#" onClick={() => handleNavigation("Sales")} className={isLinkActive("Sales")}>Sales Report</a>
                  <a href="#" onClick={() => handleNavigation("Insights")} className={isLinkActive("Insights")}>Business Insights</a>
                  <a href="#" onClick={() => handleNavigation("DataImportExport")} className={isLinkActive("DataImportExport")}>Data Export</a>
                </div>
              </div>
            </>
          )}

          {/* Admin Only Sections */}
          {currentUser?.role === "admin" && (
            <>
              {/* Tenant Management */}
              <div className="nav-section">
                <span className="nav-section-title">Tenants</span>
                <div className="nav-dropdown">
                  <a href="#" onClick={() => handleNavigation("TenantManagement")} className={isLinkActive("TenantManagement")}>Restaurants</a>
                  <a href="#" onClick={() => handleNavigation("UserManagement")} className={isLinkActive("UserManagement")}>User Accounts</a>
                </div>
              </div>

              {/* Business Management */}
              <div className="nav-section">
                <span className="nav-section-title">Business</span>
                <div className="nav-dropdown">
                  <a href="#" onClick={() => handleNavigation("Subscriptions")} className={isLinkActive("Subscriptions")}>Subscriptions</a>
                  <a href="#" onClick={() => handleNavigation("LicenseManagement")} className={isLinkActive("LicenseManagement")}>Licenses</a>
                </div>
              </div>

              {/* System Management */}
              <div className="nav-section">
                <span className="nav-section-title">System</span>
                <div className="nav-dropdown">
                  <a href="#" onClick={() => handleNavigation("SystemAnalytics")} className={isLinkActive("SystemAnalytics")}>Analytics</a>
                  <a href="#" onClick={() => handleNavigation("SystemSettings")} className={isLinkActive("SystemSettings")}>Settings</a>
                  <a href="#" onClick={() => handleNavigation("DataImportExport")} className={isLinkActive("DataImportExport")}>Data Import/Export</a>
                </div>
              </div>
            </>
          )}


        </nav>

        <div className="user-container">
          <TrialStatus user={currentUser} />
          <button
            onClick={toggleTheme}
            className="mode-toggle"
            title={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <a
            href="#"
            onClick={() => handleNavigation("UserProfile")}
            className={isLinkActive("UserProfile")}
            style={{
              color: "var(--clr-text-primary)",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "0.9em"
            }}
          >
            👤 Profile
          </a>
          <a
            href="#"
            onClick={() => handleNavigation("Contact")}
            className={isLinkActive("Contact")}
            style={{
              color: "var(--clr-text-primary)",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "0.9em"
            }}
          >
            📞 Contact
          </a>
          <button onClick={onLogout} className="logout-button">
            LOGOUT
          </button>
        </div>
      </header>
      <section className="main-section" style={{ minHeight: "90vh" }}>
        {renderSection()}
      </section>
    </div>
  );
}

export default MainLayout;
