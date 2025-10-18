import "./DonorDashboard.css";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";

const DonorDashboard = () => {
  return (
    <div>
      <Sidebar />
      <div className="dashboard-main-container">
        <Banner />
        <h1>Welcome to the Donor Dashboard</h1>
        
      </div>
    </div>
  );
};

export default DonorDashboard;
