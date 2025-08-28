// import React, { useState } from 'react';
// import { Modal } from 'react-bootstrap';
// import SelectGender from '../select/selectgender';
// import SelectAge from '../select/selectage';
// import SelectCountry from '../select/selectcountry';
// import { useNavigate } from 'react-router-dom';

// const SearchFilterModal = ({ showModal, hideModal }) => {
//   const navigate = useNavigate();
//   const [selectedGender, setSelectedGender] = useState('male');
//   const [selectedLookingFor, setSelectedLookingFor] = useState('female');
//   const [selectAge, setSelectAge] = useState({
//     minAge: '20',
//     maxAge: '25',
//   });
//   const [selectedCountry, setSelectedCountry] = useState('Bangladesh');

//   const startAge = 18;
//   const endAge = 40;

//   const generateAgeOptions = () => {
//     const ageOptions = [];
//     for (let age = startAge; age <= endAge; age++) {
//       ageOptions.push(
//         <option key={age} value={age}>
//           {age}
//         </option>
//       );
//     }
//     return ageOptions;
//   };

//   const startAge1 = 19;
//   const endAge1 = 40;
//   const generateAgeOptionsNew = () => {
//     const ageOptions1 = [];
//     for (let age = startAge1; age <= endAge1; age++) {
//       ageOptions1.push(
//         <option key={age} value={age}>
//           {age}
//         </option>
//       );
//     }
//     return ageOptions1;
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   const handleFilterPartner = async () => {
//     try {
//       let queryParams = `/dating/members`;

//       // Add minAge and maxAge parameters if selected
//       if (selectAge.minAge && selectAge.maxAge) {
//         queryParams += `?minAge=${selectAge.minAge}&maxAge=${selectAge.maxAge}`;
//       }

//       // Add gender parameter if selected
//       if (selectedGender) {
//         queryParams += `${queryParams.includes('?') ? '&' : '?'}gender=${selectedGender}`;
//       }

//       // Add other parameters as needed (e.g., selectedLookingFor, selectedCountry)

//       navigate(queryParams);
//     } catch (error) {
//       console.error('Error filtering partners:', error);
//     }
//     hideModal();
//   };

//   const handleChangeData = (e) => {
//     setSelectAge({ ...selectAge, [e.target.name]: e.target.value });
//   };

//     const labelchangeone = "I am a";
//     const labelchangetwo = "Looking for";
//     const labelchangethree = "Age";
//     const labelchangefour = "Cities";
//     const searchBtnText = "Find Your Partner";
//     return (
//         <>
//         <Modal show={showModal} onHide={hideModal} centered>
//             <span onClick={hideModal}><i className="fa fa-times fs-3" aria-hidden="true" style={{
//                 cursor: "pointer",
//                 float: 'right',
//                 padding: '15px 25px 0 0',
//             }}></i>
//             </span>
//             <div className="modal-content border-0 mb-4">
//                 <div className="modal-header">
//                     <h5 className="modal-title" id="exampleModalLabel1">Filter your search</h5>
//                 </div>
//                 <div className="modal-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="banner__list">
//                             <div className="row align-items-center row-cols-1">
//                                 <div className="col">
//                                     <label>{labelchangeone}</label>
//                                     <div className="banner__inputlist">
//                                         <SelectGender
//                                             select={selectedGender}
//                                             onSelect={(value) => setSelectedGender(value)}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <label>{labelchangetwo}</label>
//                                     <div className="banner__inputlist">
//                                         <SelectGender
//                                             select={selectedLookingFor}
//                                             onSelect={(value) => setSelectedGender(value)}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <label>{labelchangethree}</label>
//                                     <div className="row g-3">
//                                     <div className="col-6">
//                         <div className="banner__inputlist">
//                           <select
//                           name="minAge"
//                             value={selectAge.minAge}
//                             onChange={handleChangeData}
//                           >
//                             {generateAgeOptions()}
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-6">
//                         <div className="banner__inputlist">
//                           <select
//                           name="maxAge"
//                             value={selectAge.maxAge}
//                             onChange={handleChangeData}
                            
//                           >
//                             {generateAgeOptionsNew()}
//                           </select>
//                         </div>
//                       </div>
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <label>{labelchangefour}</label>
//                                     <div className="banner__inputlist">
//                                         <SelectCountry
//                                             select={selectedCountry}
//                                             onSelect={(value) => setSelectedCountry(value)}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <button
//                                      type="submit"
//                                      className="default-btn d-block w-100" 
//                                      onClick={handleFilterPartner}
//                                     >
//                                         <span>{searchBtnText} </span>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </Modal>
//         </>
//     );
// };

// export default SearchFilterModal;



import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import SelectGender from '../select/selectgender';
import SelectCountry from '../select/selectcountry';

const SearchFilterModal = ({ showModal, hideModal, onSubmit }) => {
  const [selectedGender, setSelectedGender] = useState('male');
  const [selectedLookingFor, setSelectedLookingFor] = useState('female');
  const [selectAge, setSelectAge] = useState({
    minAge: '20',
    maxAge: '25',
  });
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');

  const startAge = 18;
  const endAge = 40;
  const generateAgeOptions = () => {
    const ageOptions = [];
    for (let age = startAge; age <= endAge; age++) {
      ageOptions.push(
        <option key={age} value={age}>
          {age}
        </option>
      );
    }
    return ageOptions;
  };

  const generateAgeOptionsNew = () => {
    const ageOptions1 = [];
    for (let age = 19; age <= 40; age++) {
      ageOptions1.push(
        <option key={age} value={age}>
          {age}
        </option>
      );
    }
    return ageOptions1;
  };

  const handleChangeData = (e) => {
    setSelectAge({ ...selectAge, [e.target.name]: e.target.value });
  };

  const handleFilterPartner = (e) => {
    e.preventDefault();
    const filters = {
      gender: selectedLookingFor,     // Looking for gender
      address: selectedCountry,
      minAge: selectAge.minAge,
      maxAge: selectAge.maxAge,
      name: "",                      // optional search name
    };
    onSubmit(filters);
    hideModal();
  };

  return (
    <Modal show={showModal} onHide={hideModal} centered>
      <span
        onClick={hideModal}
      >
        <i
          className="fa fa-times fs-3"
          aria-hidden="true"
          style={{
            cursor: "pointer",
            float: 'right',
            padding: '15px 25px 0 0',
          }}
        ></i>
      </span>
      <div className="modal-content border-0 mb-4">
        <div className="modal-header">
          <h5 className="modal-title">Filter your search</h5>
        </div>
        <div className="modal-body">
          <form onSubmit={handleFilterPartner}>
            <div className="banner__list">
              <div className="row align-items-center row-cols-1">
                <div className="col">
                  <label>I am a</label>
                  <div className="banner__inputlist">
                    <SelectGender
                      select={selectedGender}
                      onSelect={(value) => setSelectedGender(value)}
                    />
                  </div>
                </div>
                <div className="col">
                  <label>Looking for</label>
                  <div className="banner__inputlist">
                    <SelectGender
                      select={selectedLookingFor}
                      onSelect={(value) => setSelectedLookingFor(value)}
                    />
                  </div>
                </div>
                <div className="col">
                  <label>Age</label>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="banner__inputlist">
                        <select
                          name="minAge"
                          value={selectAge.minAge}
                          onChange={handleChangeData}
                        >
                          {generateAgeOptions()}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="banner__inputlist">
                        <select
                          name="maxAge"
                          value={selectAge.maxAge}
                          onChange={handleChangeData}
                        >
                          {generateAgeOptionsNew()}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <label>Cities</label>
                  <div className="banner__inputlist">
                    <SelectCountry
                      select={selectedCountry}
                      onSelect={(value) => setSelectedCountry(value)}
                    />
                  </div>
                </div>
                <div className="col">
                  <button
                    type="submit"
                    className="default-btn d-block w-100"
                  >
                    <span>Find Your Partner</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default SearchFilterModal;
