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

interface PeriodChartProps {
    data: Array<{ period: string; count: number }>
}

export function PeriodChart({ data }: PeriodChartProps) {
    const chartData = {
        labels: data.map((item) => item.period),
        datasets: [
            {
                label: "Available Nuts",
                data: data.map((item) => item.count),
                backgroundColor: "rgba(234, 88, 12, 0.5)",
                borderColor: "rgb(234, 88, 12)",
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
