// pages/api/score.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import {
  calcLifestyleScore,
  calcSymptomsScore,
  calcSupport,
  normalizeScore
} from '@/lib/score'
import tracks from '@/data/opt_track_map.json'

const PILLAR_TO_CODE: Record<string, keyof typeof tracks> = {
  muscle: 'msk',
  organ: 'org',
  circulation: 'circ',
  emotion: 'ene',
  articular: 'art',
  nervous: 'nerv',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'POST only' })
  }

  let { hc, life, submissionId } = req.body

  if (!hc || !life) {
    if (!submissionId) return res.status(400).json({ error: 'missing intake data' })
    const sub = await prisma.intakeSubmission.findUnique({ where: { id: submissionId } })
    if (!sub) return res.status(404).json({ error: 'not found' })
    hc = sub.hc as any
    life = sub.life as any
  }

  const rawLifestyle = calcLifestyleScore(life)
    const lifestyle = normalizeScore(rawLifestyle)

    const rawSymptoms = calcSymptomsScore(hc)
    const normalized = normalizeScore(rawSymptoms)
    const symptoms = Object.fromEntries(
    Object.entries(normalized).map(([k, v]) => [k, v * 10])
    )

    const support = calcSupport()

    const gap = Object.fromEntries(
    Object.keys(symptoms).map((p) => [p, symptoms[p] - (support[p] ?? 0)])
    )

  const focus = Object.entries(gap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([p]) => {
      const code = PILLAR_TO_CODE[p] ?? ''
      return tracks[code]?.primary ?? `Focus on ${p}`
    })

  return res.status(200).json({ symptoms, lifestyle, support, focus })
}