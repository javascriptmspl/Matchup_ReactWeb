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
  const [selectedCountry, setSelectedCountry] = useState('');

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
