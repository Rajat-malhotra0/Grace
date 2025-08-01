import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement,
    Filler,
} from "chart.js";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement,
    Filler
);

const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12,
                },
            },
        },
        tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#666",
            borderWidth: 1,
        },
    },
};

export const BarChart = ({
    data,
    title,
    color = "#3b82f6",
    height = 300,
    horizontal = false,
}) => {
    const chartData = {
        labels: data.map((item) => item.name || item.label),
        datasets: [
            {
                label: title || "Data",
                data: data.map((item) => item.count || item.value),
                backgroundColor: color,
                borderColor: Array.isArray(color)
                    ? color.map((c) => c + "80")
                    : color + "80",
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        ...defaultOptions,
        indexAxis: horizontal ? "y" : "x",
        plugins: {
            ...defaultOptions.plugins,
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: "bold",
                },
                padding: 20,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ height, width: "100%" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export const LineChart = ({
    data,
    title,
    color = "#10b981",
    height = 300,
    curved = true,
}) => {
    const chartData = {
        labels: data.map((item) => item.label),
        datasets: [
            {
                label: title || "Data",
                data: data.map((item) => item.value),
                borderColor: color,
                backgroundColor: color + "20",
                borderWidth: 3,
                fill: true,
                tension: curved ? 0.2 : 0,
                pointBackgroundColor: color,
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        ...defaultOptions,
        plugins: {
            ...defaultOptions.plugins,
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: "bold",
                },
                padding: 20,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ height, width: "100%" }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export const DonutChart = ({
    data,
    title,
    colors = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#f97316"],
    height = 300,
}) => {
    const chartData = {
        labels: data.map((item) => item.name || item.range),
        datasets: [
            {
                data: data.map((item) => parseFloat(item.percentage || 0)),
                backgroundColor: colors,
                borderColor: colors.map((color) => color + "80"),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        ...defaultOptions,
        plugins: {
            ...defaultOptions.plugins,
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: "bold",
                },
                padding: 20,
            },
        },
        cutout: "60%",
    };

    return (
        <div style={{ height, width: "100%" }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};


export const PieChart = ({
    data,
    title,
    colors = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#f97316"],
    height = 300,
}) => {
    const chartData = {
        labels: data.map((item) => item.name || item.type),
        datasets: [
            {
                data: data.map((item) => item.count || item.value),
                backgroundColor: colors,
                borderColor: colors.map((color) => color + "80"),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        ...defaultOptions,
        plugins: {
            ...defaultOptions.plugins,
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: "bold",
                },
                padding: 20,
            },
        },
    };

    return (
        <div style={{ height, width: "100%" }}>
            <Pie data={chartData} options={options} />
        </div>
    );
};

const Charts = {
    BarChart,
    LineChart,
    DonutChart,
    PieChart,
};

export default Charts;
