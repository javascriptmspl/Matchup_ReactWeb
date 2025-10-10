import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";



const PromotionalOffersScreen = () => {
  // Move the state and handlers into the component
  const [searchCriteria, setSearchCriteria] = useState({
    age: "",
    gender: "",
    location: "",
    hobbies: [],
    quizCompatibility: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (

    <>

      <div>
        <HeaderFour />
        <div className="container searchpageWrap mt-5">
        <h2 className="text-center mb-4">Profile Search Filter</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-control"
                value={searchCriteria.age}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-control"
                value={searchCriteria.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={searchCriteria.location}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Hobbies</label>
            <input
              type="text"
              name="hobbies"
              className="form-control"
              placeholder="e.g., reading, hiking"
              value={searchCriteria.hobbies.join(",")}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  hobbies: e.target.value.split(","),
                })
              }
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="quizCompatibility"
              name="quizCompatibility"
              checked={searchCriteria.quizCompatibility}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="quizCompatibility">
              Show only compatible profiles (based on quiz results)
            </label>
          </div>

          <button  type="submit" className="btn btn-primary btn-block">
            Search Profiles
          </button>
        </form>
        </div>
   
      </div>
           <FooterFour/>
           </>
  );
};

export default PromotionalOffersScreen;
