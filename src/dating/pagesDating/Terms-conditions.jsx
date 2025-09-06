import React, { useCallback, useEffect } from "react";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";
import { useDispatch, useSelector } from "react-redux";
import { getAllTermAndConditionsAsync } from "../store/slice/commonSlice";

const Termsconditions = () => {
  const datingId = localStorage.getItem("userData");
  const userData = JSON.parse(datingId);
  const modeId = userData?.data?.data?.mode || "658538cde21518a3d04bf3ae";
  const dispatch = useDispatch();
  const getTermAndCondition = useSelector(
    (state) => state.termAndConditionSlice?.activies?.data
  );

  const getTandCondition = useCallback(() => {
    dispatch(getAllTermAndConditionsAsync(modeId));
  }, [dispatch, modeId]);

  useEffect(() => {
    getTandCondition();
  }, [getTandCondition]);


  return (
    <>
      <HeaderFour />
      <section className="terms-section padding-bottom padding-top">
        <div className="container">
          <div className="terms-content">
            <div className="terms-header">
              <h4>Terms And Conditions </h4>
              <p>
                <span className="theme-color fw-bold">Last Updated:</span>{" "}
                December 1, 2023
              </p>
            </div>
            <div className="terms-text">
              <p className="mb-4">
                Welcome to Matchup, a dating app connecting individuals looking
                for meaningful relationships. Before using our services, please
                carefully read and agree to the following terms and conditions
              </p>
              {getTermAndCondition ? (
                getTermAndCondition.map((term, index) => (
                  <div key={index}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: term?.description?.replace(
                          /Marier/gi,
                          "Matchup"
                        ),
                      }}
                    ></p>
                  </div>
                ))
              ) : (
                <div className="loader"></div>
              )}
            </div>
          </div>
        </div>
      </section>
      <FooterFour />
    </>
  );
};

export default Termsconditions;
