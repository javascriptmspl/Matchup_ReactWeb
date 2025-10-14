import React, { useState } from 'react';
import { TimePicker } from 'react-ios-time-picker';

function App({ value, onChange }) {
   const [internalValue, setInternalValue] = useState(value || '10:00');

   const handleChange = (val) => {
      setInternalValue(val);
      if (onChange) {
         onChange(val);
      }
   };

   return (
      <div className="Apps">
    
         <TimePicker onChange={handleChange} value={value || internalValue} />
        
      </div>
   );
}

export default App;