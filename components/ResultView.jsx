// components/ResultView.jsx (or wherever you're rendering)
import SymptomResultSheet from '@/components/ui/SymptomResultSheet'
import LifestyleResultSheet from '@/components/ui/LifestyleResultSheet'
import { calcLifestyleScore } from '@/lib/score'

export default function ResultView({ data }) {
  const { symptoms, lifestyle, support } = data || {}

  return (
    <main className="p-6 max-w-xl mx-auto space-y-10">
      {symptoms && support && (
        <SymptomResultSheet symptoms={symptoms} support={support} />
      )}
      {lifestyle &&
        Object.keys(lifestyle).length > 0 &&
        support && (
          <LifestyleResultSheet
            life={data.life}
            score={lifestyle}
          />
        )}
    </main>
  )
}