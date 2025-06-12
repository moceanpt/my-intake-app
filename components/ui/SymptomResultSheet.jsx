// components/ui/SymptomResultSheet.jsx

import React from 'react'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const PILLAR_LABEL = {
  muscle: 'Musculoskeletal',
  organ: 'Organ',
  circulation: 'Circulatory',
  emotion: 'Energy & Emotional',
  articular: 'Articular',
  nervous: 'Nervous',
}

function getTier(percentage) {
  if (percentage >= 50) return '🔴 High strain'
  if (percentage >= 25) return '🟠 Moderate'
  if (percentage >= 10) return '🟡 Mild strain'
  return '🟢 Optimal'
}

export default function SymptomResultSheet({ symptoms = {}, support = {} }) {
  // Early return if missing data
  if (
    !symptoms ||
    !support ||
    Object.keys(symptoms).length === 0 ||
    Object.keys(support).length === 0
  ) {
    return null
  }

  const labels = Object.keys(symptoms).map((p) => PILLAR_LABEL[p] ?? p)
  const scores = Object.keys(symptoms).map((p) => symptoms[p])
  const supportVals = Object.keys(symptoms).map((p) => support[p] ?? 0)

  const data = {
    labels,
    datasets: [
      {
        label: 'Body‑Strain',
        data: scores,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      },
      {
        label: 'Support',
        data: supportVals,
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: 'rgba(54,162,235,1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">Health Snapshot</h2>
      <div className="max-w-md mx-auto">
        <Radar data={data} options={{ maintainAspectRatio: false, aspectRatio: 1 }} />
      </div>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-1 text-left">Pillar</th>
            <th className="p-1 text-center">Body-Strain %</th>
            <th className="p-1 text-center">Tier</th>
            <th className="p-1 text-center">Support (0–10)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(symptoms).map(([pillar, val]) => (
            <tr key={pillar} className="even:bg-gray-50">
              <td className="p-1">{PILLAR_LABEL[pillar]}</td>
              <td className="p-1 text-center">{val}%</td>
              <td className="p-1 text-center">{getTier(val)}</td>
              <td className="p-1 text-center">{support[pillar]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}