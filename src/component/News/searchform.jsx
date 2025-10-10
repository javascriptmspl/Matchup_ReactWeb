import React, { useState } from 'react';

const ItemSearchForm = () => {
  // State hooks for managing form data and advanced search visibility
  const [year, setYear] = useState('');
  const [keywords, setKeywords] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

 
  const handleSubmit = (event) => {
    event.preventDefault();
    
  };


  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const toggleAdvancedSearch = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className="search_form_wrap">
      <form
        name="item_basic_search_20295"
        onSubmit={handleSubmit} // No action attribute
        className="wd_search_form wd_search_form_basic"
      >
        <input type="hidden" name="l" value="50" />
        <div className="wd_search_basic_fields">
          <label htmlFor="item_basic_search_20295_year" className="wd_sr-only">Year</label>
          <select
            name="year"
            id="item_basic_search_20295_year"
            value={year}
            onChange={handleYearChange}
          >
            <option value="">All Years</option>
            {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((yearOption) => (
              <option key={yearOption} value={yearOption}>{yearOption}</option>
            ))}
          </select>
          <label htmlFor="item_basic_search_20295_keywords" className="wd_sr-only">Keywords</label>
          <input
            type="text"
            name="keywords"
            value={keywords}
            size="32"
            placeholder="Search"
            onChange={handleKeywordsChange}
            id="item_basic_search_20295_keywords"
          />
          <button type="submit" className="wd_search_button" title="Search">Go</button>
        </div>
        <a
          className="wd_search_advanced_link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleAdvancedSearch();
          }}
        >
          {showAdvanced ? 'Basic Search' : 'Advanced Search'}
        </a>
      </form>

      {/* Advanced Search Form */}
      {showAdvanced && (
        <form
          method="get"
          className="wd_search_form wd_search_form_advanced"
          onSubmit={handleSubmit} // No action attribute
        >
          <input type="hidden" name="advanced" value="1" />
          <div className="wd_form_field wd_form_field_pos_right">
            <div className="wd_form_field_label">
              <label htmlFor="item_advanced_search_20295_keywords">Search</label>
            </div>
            <div className="wd_form_field_input">
              <input
                type="text"
                name="keywords"
                size="40"
                placeholder="Keywords"
                id="item_advanced_search_20295_keywords"
              />
            </div>
          </div>
          <input type="hidden" name="l" value="50" />
          <div className="wd_form_field wd_form_field_pos_right">
            <div className="wd_form_field_label">
              <label htmlFor="item_advanced_search_20295_start">From</label>
            </div>
            <div className="wd_form_field_input">
              <input
                type="text"
                name="start"
                size="32"
                placeholder="Date"
                id="wd_wai_dp_input_nf_start"
              />
              <button
                type="button"
                className="icon wd_wai_dp_button"
                id="wd_wai_dp_button_nf_start"
                title="Choose Date"
              >
                <span className="wd_datepicker-icon fa fa-calendar"></span>
              </button>
            </div>
          </div>
          <div className="wd_form_field wd_form_field_pos_right">
            <div className="wd_form_field_label">
              <label htmlFor="item_advanced_search_20295_end">To</label>
            </div>
            <div className="wd_form_field_input">
              <input
                type="text"
                name="end"
                size="32"
                placeholder="Date"
                id="wd_wai_dp_input_nf_end"
              />
              <button
                type="button"
                className="icon wd_wai_dp_button"
                id="wd_wai_dp_button_nf_end"
                title="Choose Date"
              >
                <span className="wd_datepicker-icon fa fa-calendar"></span>
              </button>
            </div>
          </div>
          <fieldset className="wd_form_field wd_form_field_pos_right">
            <legend className="wd_form_field_label">Asset Types</legend>
            <div className="wd_form_field_input d-flex align-items-center justify-content-between">
              {['Photos', 'Video', 'Audio', 'Documents', 'Events', 'Standard'].map((type, index) => (
                <span key={index} className="wd_checkbox text-center">
                  <input
                    type="checkbox"
                    name="asset_types[]"
                    value={117 + index}
                    id={`item_advanced_search_20295_asset_types_${117 + index}`}
                    defaultChecked={true}
                  />
                  <label htmlFor={`item_advanced_search_20295_asset_types_${117 + index}`}>
                    {type}
                  </label>
                </span>
              ))}
            </div>
          </fieldset>
          <input type="hidden" name="have_asset_types" value="1" />
            <div className="wd_form_footer wd_form_buttons">
            <div>
              <input type="submit" value="Search" />
            </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleAdvancedSearch();
                }}
              >
                Basic Search
              </a>
            </div>
        </form>
      )}
    </div>
  );
};

export default ItemSearchForm;
