import React from 'react';
import { InBodyResultSection } from './objective/InBodyResultSection';
import ExBodyResultSection from './objective/ExBodyResultSection';
import ROMResultSection from './objective/ROMResultSection';

const ObjectiveResultSheet = ({ 
  inbodyData, 
  inbodyHistory, 
  exbodyData,
  exbodyHistory,
  romData,
  romHistory,
  sex, 
  age 
}) => {
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
      
      {/* ExBody Section */}
      {exbodyData && (
        <ExBodyResultSection
          data={exbodyData}
          history={exbodyHistory}
        />
      )}
      
      {/* Range of Motion Section */}
      {romData && (
        <ROMResultSection
          data={romData}
          history={romHistory}
        />
      )}
    </div>
  );
};

export default ObjectiveResultSheet; 