"use client"

import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Title, Tooltip, Legend)

interface TagChartProps {
    data: Array<{ tag: string; count: bigint | number }>
}

export function TagChart({ data }: TagChartProps) {
    // Generate an array of colors for the pie slices
    const colors = [
        "rgba(16, 185, 129, 0.7)", // emerald
        "rgba(14, 165, 233, 0.7)", // sky
        "rgba(99, 102, 241, 0.7)", // indigo
        "rgba(168, 85, 247, 0.7)", // purple
        "rgba(236, 72, 153, 0.7)", // pink
        "rgba(239, 68, 68, 0.7)", // red
        "rgba(249, 115, 22, 0.7)", // orange
        "rgba(234, 179, 8, 0.7)", // yellow
        "rgba(34, 197, 94, 0.7)", // green
        "rgba(20, 184, 166, 0.7)", // teal
    ]

    const chartData = {
        labels: data.map((item) => item.tag),
        datasets: [
            {
                data: data.map((item) => Number(item.count)),
                backgroundColor: colors,
                borderColor: colors.map((color) => color.replace("0.7", "1")),
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "right" as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || ""
                        const value = context.raw
                        const total = context.dataset.data.reduce(
                            (a: number, b: number) => a + b,
                            0,
                        )
                        const percentage = ((value * 100) / total).toFixed(1)
                        return `${label}: ${value} (${percentage}%)`
                    },
                },
            },
        },
    }

    return <Pie data={chartData} options={options} />
}
