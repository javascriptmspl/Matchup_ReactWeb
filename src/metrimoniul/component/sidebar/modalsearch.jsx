import React, { useState } from "react";
import SelectAge from "../select/selectage";
import SelectCountry from "../select/selectcountry";
import SelectGender from "../select/selectgender";

const title = "Filter your search";
const labelchangeone = "I am a";
const labelchangetwo = "Looking for";
const labelchangethree = "Age";
const labelchangefour = "Country";
const searchBtnText = "Find Your Partner";

const ModalSearch = () => {
  const [selectedGender, setSelectedGender] = useState('male');
  const [selectedLookingFor, setSelectedLookingFor] = useState('female');
  const [selectedMinAge, setSelectedMinAge] = useState('18');
  const [selectedMaxAge, setSelectedMaxAge] = useState('25');
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    
  };

  return (
    <div className="modal-content border-0 mb-4">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel1">{title}</h5>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="banner__list">
            <div className="row align-items-center row-cols-1">
              <div className="col">
                <label>{labelchangeone}</label>
                <div className="banner__inputlist">
                  <SelectGender
                    select={selectedGender}
                    onSelect={(value) => setSelectedGender(value)}
                  />
                </div>
              </div>
              <div className="col">
                <label>{labelchangetwo}</label>
                <div className="banner__inputlist">
                  <SelectGender
                    select={selectedLookingFor}
                    onSelect={(value) => setSelectedLookingFor(value)}
                  />
                </div>
              </div>
              <div className="col">
                <label>{labelchangethree}</label>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="banner__inputlist">
                      <SelectAge
                        select={selectedMinAge}
                        onSelect={(value) => setSelectedMinAge(value)}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="banner__inputlist">
                      <SelectAge
                        select={selectedMaxAge}
                        onSelect={(value) => setSelectedMaxAge(value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <label>{labelchangefour}</label>
                <div className="banner__inputlist">
                  <SelectCountry
                    select={selectedCountry}
                    onSelect={(value) => setSelectedCountry(value)}
                  />
                </div>
              </div>
              <div className="col">
                <button type="submit" className="default-btn d-block w-100">
                  <span>{searchBtnText} </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSearch;
