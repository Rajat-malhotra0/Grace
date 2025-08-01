import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import "./VolunteerAnalytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const VolunteerAnalytics = () => {
  // Mock data - replace with real data from your API
  const monthlyHours = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Hours Volunteered",
        data: [12, 18, 15, 25, 22, 30],
        borderColor: "#2e2e2e",
        backgroundColor: "rgba(46, 46, 46, 0.1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const tasksCompleted = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [5, 8, 6, 12, 9, 15],
        backgroundColor: [
          "#2e2e2e",
          "#4a4a4a",
          "#666666",
          "#808080",
          "#999999",
          "#b3b3b3",
        ],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const eventsAttended = {
    labels: [
      "Community Events",
      "Training Sessions",
      "Fundraisers",
      "Awareness Campaigns",
    ],
    datasets: [
      {
        data: [8, 5, 3, 4],
        backgroundColor: ["#2e2e2e", "#4a4a4a", "#666666", "#808080"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const peopleImpacted = {
    labels: ["Direct Impact", "Indirect Impact"],
    datasets: [
      {
        data: [150, 450],
        backgroundColor: ["#2e2e2e", "#666666"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const causesContributed = {
    labels: [
      "Education",
      "Healthcare",
      "Environment",
      "Women Empowerment",
      "Child Welfare",
    ],
    datasets: [
      {
        data: [25, 20, 30, 15, 10],
        backgroundColor: [
          "#2e2e2e",
          "#4a4a4a",
          "#666666",
          "#808080",
          "#999999",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const timePerCause = {
    labels: [
      "Education",
      "Healthcare",
      "Environment",
      "Women Empowerment",
      "Child Welfare",
    ],
    datasets: [
      {
        label: "Hours Spent",
        data: [35, 28, 42, 20, 15],
        backgroundColor: "#2e2e2e",
        borderColor: "#2e2e2e",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "Playfair Display",
            size: 12,
          },
          color: "#2e2e2e",
          padding: 15,
        },
      },
      tooltip: {
        titleFont: {
          family: "Playfair Display",
        },
        bodyFont: {
          family: "Playfair Display",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: "Playfair Display",
            size: 11,
          },
          color: "#666",
        },
        grid: {
          color: "#f0f0f0",
        },
      },
      y: {
        ticks: {
          font: {
            family: "Playfair Display",
            size: 11,
          },
          color: "#666",
        },
        grid: {
          color: "#f0f0f0",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "Playfair Display",
            size: 11,
          },
          color: "#2e2e2e",
          padding: 10,
        },
      },
      tooltip: {
        titleFont: {
          family: "Playfair Display",
        },
        bodyFont: {
          family: "Playfair Display",
        },
      },
    },
  };

  return (
    <div className="volunteer-analytics-container">
      <div className="analytics-header">
        <h2>Your Impact Analytics</h2>
        <p>
          Track your volunteering journey and see the difference you're making
        </p>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Total Hours Volunteered</h3>
            <span className="chart-value">140 hours</span>
          </div>
          <div className="chart-container">
            <Line data={monthlyHours} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Tasks Completed</h3>
            <span className="chart-value">55 tasks</span>
          </div>
          <div className="chart-container">
            <Bar data={tasksCompleted} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Events Attended</h3>
            <span className="chart-value">20 events</span>
          </div>
          <div className="chart-container">
            <Pie data={eventsAttended} options={pieOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>People Impacted</h3>
            <span className="chart-value">600 people</span>
          </div>
          <div className="chart-container">
            <Doughnut data={peopleImpacted} options={pieOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Causes Contributed To</h3>
            <span className="chart-value">5 causes</span>
          </div>
          <div className="chart-container">
            <Doughnut data={causesContributed} options={pieOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Time Per Cause</h3>
            <span className="chart-value">140 hours total</span>
          </div>
          <div className="chart-container">
            <Bar data={timePerCause} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerAnalytics;
