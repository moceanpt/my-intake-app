import React from 'react';
import InBodyResultSection from './objective/InBodyResultSection';

const ObjectiveResultSheet = ({ inbodyData, inbodyHistory, sex, age }) => {
  return (
    <div>
      <h2>Objective Results</h2>
      {/* InBody Section */}
      {inbodyData && (
        <InBodyResultSection
          data={inbodyData}
          history={inbodyHistory}
          sex={sex}
          age={age}
        />
      )}
      {/* Future: Add ExBodyResultSection, OmniFitResultSection, etc. */}
    </div>
  );
};

export default ObjectiveResultSheet; 