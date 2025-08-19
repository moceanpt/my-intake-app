/* components/ResultView.jsx
   ------------------------------------------------------------ */
import SymptomResultSheet   from '@/components/ui/SymptomResultSheet';
import LifestyleResultSheet from '@/components/ui/LifestyleResultSheet';
import React from 'react';

const ResultView = ({ data, readOnly = false }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-secondary-500">
        No data available to display
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Health Snapshot - Subjective Radar */}
      {data.radarSubjective && Object.keys(data.radarSubjective).length > 0 && (
        <SymptomResultSheet
          radars={[
            {
              data: data.radarSubjective,
              label: 'Subjective Assessment',
              color: { bg: 'rgba(54,162,235,0.15)', bd: 'rgba(54,162,235,1)' }
            }
          ]}
        />
      )}

      {/* Lifestyle Results */}
      {data.lifestyle && Object.keys(data.lifestyle).length > 0 && (
        <LifestyleResultSheet data={data.lifestyle} />
      )}
    </div>
  );
};

export default ResultView;