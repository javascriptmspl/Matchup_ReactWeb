import React, { useEffect, useState } from "react";
import HeaderFour from "../component/layout/HeaderFour";
import FooterFour from "../component/layout/footerFour";
import { MODE_METRI } from "../../utils";
import axios from "axios";
import Lodder from "../component/layout/Lodder";
import { BASE_URL } from "../../base";

const Termsconditions = () => {
  const [termAndCondition, setTermAndCondition] = useState();
  const [loading, setloading] = useState(true);
  const getAlltermsAndConditions = async () => {
    try {
      const resoponse = await axios.get(
        `${BASE_URL}/termsAndConditions/getall/${MODE_METRI}?page_no=1&page_size=100`
      );

      if (resoponse?.data?.data?.length > 0) {
        setTermAndCondition(resoponse.data);
        setloading(false);
      }
    } catch (error) {
      setloading(true);
    }
  };

  useEffect(() => {
    getAlltermsAndConditions();
  }, []);
  return (
    <>
      <HeaderFour />
      {loading ? (
        <Lodder />
      ) : (
        <>
          <section className="terms-section padding-bottom padding-top">
            <div className="container">
              <div className="terms-content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: termAndCondition?.data[0]?.description?.replace(
                      /Marier/gi,
                      "Matchup"
                    ),
                  }}
                />
              </div>
            </div>
          </section>
          <FooterFour />
        </>
      )}
    </>
  );
};

export default Termsconditions;
