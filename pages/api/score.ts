// pages/api/score.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma   from '@/lib/prisma'
import { calcStress, calcSupport } from '@/lib/score'
import tracks   from '@/data/opt_track_map.json'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
){
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error:'POST only' })
  }

  /* --------------------------------------------------
     1)  Decide where we get the raw intake from
  -------------------------------------------------- */
  let hc   = req.body.hc
  let life = req.body.life

  if (!hc || !life) {
    // if not passed inline, try DB
    const { submissionId } = req.body
    if (!submissionId)
      return res.status(400).json({ error:'missing intake data' })

    const sub = await prisma.intakeSubmission.findUnique({
        where: { id: submissionId }  
    })
    if (!sub) return res.status(404).json({ error:'not found' })

    hc   = sub.hc   as any
    life = sub.life as any
  }

  /* 2)  Calculate scores */
  const stress  = calcStress(hc)
  const support = calcSupport(life)

  const gap     = Object.fromEntries(
    Object.keys(stress).map(p => [p, stress[p]-support[p]])
  )

  const focus   = Object.entries(gap)
                    .sort((a,b)=>b[1]-a[1])
                    .slice(0,2)
                    .map(([p]) => tracks[p as keyof typeof tracks].primary)

  res.status(200).json({ stress, support, focus })
}