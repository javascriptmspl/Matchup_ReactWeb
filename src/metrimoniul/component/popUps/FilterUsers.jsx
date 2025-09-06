import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import SelectGender from "../select/selectgender";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../../base";
import { useNavigate } from "react-router-dom";
const title = "Find your true love";
const desc = "Serious dating with your perfect match is just a click away.";

const labelchangeone = "I am a";
const labelchangetwo = "Looking for";
const labelchangethree = "Age";
const labelchangefour = "Cities";
const btnText = "Find Your Partner";

const MetriSearchFilterModal = ({ showModal, hideModal }) => {
  const navigate = useNavigate();
  const [selectedDistance, setSelectedDistance] = useState(10);
  const dispatch = useDispatch();

  const [selectedGender, setSelectedGender] = useState("male");
  const [selectedLookingFor, setSelectedLookingFor] = useState("female");
  const [selectAge, setSelectAge] = useState({
    minAge: "20",
    maxAge: "25",
  });
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleChangeData = (e) => {
    setSelectAge({ ...selectAge, [e.target.name]: e.target.value });
  };

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

  const startAge1 = 19;
  const endAge1 = 40;
  const generateAgeOptionsNew = () => {
    const ageOptions1 = [];
    for (let age = startAge1; age <= endAge1; age++) {
      ageOptions1.push(
        <option key={age} value={age}>
          {age}
        </option>
      );
    }
    return ageOptions1;
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();

    try {
      // Build query string dynamically
      let queryParams = new URLSearchParams();

      if (selectedLookingFor) {
        queryParams.append("gender", selectedLookingFor);
      }
      if (selectedCountry) {
        queryParams.append("address", selectedCountry);
      }
      if (selectAge.minAge) {
        queryParams.append("minAge", selectAge.minAge);
      }
      if (selectAge.maxAge) {
        queryParams.append("maxAge", selectAge.maxAge);
      }

      queryParams.append("modeId", "68ad61f71130f0d24d4aff04");

      const url = `${BASE_URL}/User/filter?${queryParams.toString()}&t=${Date.now()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      hideModal();
      navigate("/metrimonial/members", { state: { data: data.data } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const usaCities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "San Francisco",
    "Indianapolis",
    "Columbus",
    "Fort Worth",
    "Charlotte",
    "Seattle",
    "Denver",
    "El Paso",
    "Detroit",
    "Washington",
    "Boston",
    "Memphis",
    "Nashville",
    "Portland",
    "Oklahoma City",
    "Las Vegas",
    "Baltimore",
    "Pune",
    "Milwaukee",
    "Albuquerque",
    "Tucson",
    "Fresno",
    "Sacramento",
    "Mesa",
    "Kansas City",
    "Atlanta",
    "Long Beach",
    "Colorado Springs",
    "Raleigh",
    "Miami",
    "Oakland",
    "Minneapolis",
    "Tulsa",
    "Cleveland",
    "New Delhi",
    "Chandigarh",
    "USA",
  ];

  const minimumAge = ["18", "19", "20"];
  const maximumAge = ["19", "20", "21"];
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleDistanceChange = (e) => {
    setSelectedDistance(e.target.value);
  };

  return (
    <>
      <Modal show={showModal} onHide={hideModal} centered>
        <span onClick={hideModal}>
          <i
            className="fa fa-times fs-3"
            aria-hidden="true"
            style={{
              cursor: "pointer",
              float: "right",
              padding: "15px 25px 0 0",
            }}
          ></i>
        </span>
        <div className="modal-content border-0 mb-4">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel1">
              Filter your search
            </h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFilterSubmit}>
              <div className="banner__list">
                <div className="row align-items-center row-cols-1">
                  <div className="banner__list">
                    <label>{labelchangetwo}</label>
                    <div className="row">
                      <div className="col-6">
                        <label className="banner__inputlist" htmlFor="male2">
                          <input
                            type="radio"
                            id="male2"
                            name="partnerGender"
                            className="male"
                            value="male"
                            checked={selectedLookingFor === "male"}
                            onChange={() => setSelectedLookingFor("male")}
                          />
                          <span>Male</span>
                          <span className="banner__inputlist--icon">
                            <i className="fa-solid fa-mars"></i>
                          </span>
                        </label>
                      </div>

                      <div className="col-6">
                        <label className="banner__inputlist" htmlFor="female2">
                          <input
                            type="radio"
                            id="female2"
                            name="partnerGender"
                            className="female"
                            value="female"
                            checked={selectedLookingFor === "female"}
                            onChange={() => setSelectedLookingFor("female")}
                          />
                          <span>Female</span>
                          <span className="banner__inputlist--icon">
                            <i className="fa-solid fa-venus"></i>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="banner__list">
                    <label>{`Distance (${selectedDistance} km)`}</label>
                    <div className="row">
                      <div className="col-12">
                        <Form.Range
                          className="custom-range"
                          value={selectedDistance}
                          onChange={handleDistanceChange}
                          min={1}
                          max={100}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <label>Location</label>
                    <div className="banner__inputlist">
                      <select
                        id="country"
                        name="country"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        required
                      >
                        <option value="" disabled>
                          Select a city
                        </option>
                        {usaCities.map((country, index) => (
                          <option key={index} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <label>City</label>
                    <div className="banner__inputlist">
                      <select
                        id="country"
                        name="country"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      >
                        {usaCities.map((country, index) => (
                          <option key={index} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
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
                    <button type="submit" className="default-btn d-block w-100">
                      <span>Find Your Partner</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MetriSearchFilterModal;
