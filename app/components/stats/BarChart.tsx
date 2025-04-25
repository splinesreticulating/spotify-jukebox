"use client"

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
    data: Array<{ level: number; count: number }>
}

export function BarChart({ data }: BarChartProps) {
    const chartData = {
        labels: data.map((item) => `${item.level}`),
        datasets: [
            {
                label: "Available Songs",
                data: data.map((item) => item.count),
                backgroundColor: "rgba(99, 102, 241, 0.5)",
                borderColor: "rgb(99, 102, 241)",
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }

    return <Bar data={chartData} options={options} />
}
