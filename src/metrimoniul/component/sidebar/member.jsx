import { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { metriGetAllUsersAsync } from "../../../service/MANAGE_SLICE/find-user-SLICE";
import {  LOCAL_USER_GENDER_METRI } from "../../../utils";
import { BASE_URL } from "../../../base";

const title = "Members";


const ActiveMember = () => {
    const selectedUserId = useParams()
    const ALL_USER_METRIMONIAL = useSelector((state) => state.getAllUser.users);

    const dispatch = useDispatch();

    const userByMode = LOCAL_USER_GENDER_METRI();

    // const showuserByGender = ALL_USER_METRIMONIAL.filter((member) => member.iAm !== userByMode);
    const showuserByGender = ALL_USER_METRIMONIAL.filter(
        (member) => member.iAm !== userByMode && member.id !== selectedUserId.id
      );
      

    useEffect(() => {
        dispatch(metriGetAllUsersAsync());
    }, [dispatch]);

    console.log("showuserByGender===>", showuserByGender)
    return (
        <div className="active-member bg-white pt-4 mb-4">
            <div className="modal-header">
                <h6>{title}</h6>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="Newest-tab" data-bs-toggle="tab" data-bs-target="#Newest" type="button" role="tab" aria-controls="Newest" aria-selected="true">Newest </button>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                        <button className="nav-link" id="Popular-tab" data-bs-toggle="tab" data-bs-target="#Popular" type="button" role="tab" aria-controls="Popular" aria-selected="false">Popular</button>
                    </li> */}
                </ul>
            </div>
            <div className="modal-body group__bottom--body">
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="Newest" role="tabpanel" aria-labelledby="Newest-tab">
                        <ul>
                            {showuserByGender ? (
                                showuserByGender.map((val, i) => (
                                    <li key={i}>
                                        <div className="top">
                                            <div className="left member--style2">
                                                <div className="member__thumb">     
                                                    <img
                                                        // src={
                                                        //     val.avatars
                                                        //         ? `${BASE_URL}/assets/images/${val.mainAvatar}`
                                                        //         : null
                                                        // }
                                                        src={
                                                            
                                                                val?.mainAvatar
                                                                  ? `${BASE_URL}/assets/images/${val?.mainAvatar}`
                                                                  : val?.avatars?.[0]
                                                                  ? `${BASE_URL}/assets/images/${val?.avatars[0]}`
                                                                  : null
                                                              
                                                        }

                                                        // src={
                                                        //     USER_PROFILE?.avatars
                                                        //       ? `https://datingapi.meander.software/assets/images/${USER_PROFILE?.mainAvatar}`
                                                        //       : userMale
                                                        //   }
                                                        style={{
                                                            height: "51px",
                                                            objectFit: "cover"
                                                          }} 
                                                        alt={val.name || ''}
                                                        />
                                                    {/* <span className="member__activity"></span> */}
                                                </div>
                                            </div>
                                            <div className="right">
                                                <Link to={`/metrimonial/user-profile/${val._id}`}><h6>{val.name}</h6></Link>
                                                        <span>{val.activety}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <h1>Loading...</h1>
                            )}

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActiveMember;