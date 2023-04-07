import React, { useEffect, useRef, useState, useContext } from 'react'
import { GlobalContext } from "../Globalstate";

function Sidebar() {
    const [{ userdetails, loggedin, tradingpair }, dispatch] = useContext(GlobalContext);
    return (
        <div className="sidebar sidebar-style-2" data-background-color="light">
            <div className="sidebar-wrapper scrollbar scrollbar-inner">
                <div className="sidebar-content">
                    <div className="user">
                        <div className="info">
                            <a data-toggle="collapse" href="#collapseExample" aria-expanded="true">
                                <span>
                                    {userdetails.fullname}
                                    <span className="caret" />
                                </span>
                            </a>
                            <div className="clearfix" />
                            <div className="collapse in" id="collapseExample">
                                <ul className="nav">
                                    <li>
                                        <a href="/settings">
                                            <span className="link-collapse">Account Settings</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <ul className="nav nav-primary">
                        <li className="nav-item active">
                            <a href="/dashboard">
                                <i className="fas fa-home" />
                                <p>Dashboard</p>
                            </a>
                        </li>
                        <li className="nav-item d-md-none  ">
                            <a href="/deposit">
                                <i className="fa fa-download " aria-hidden="true" />
                                <p>Fund your Account</p>
                            </a>
                        </li>
                        <li className="nav-item d-md-none  ">
                            <a href="/withdrawal">
                                <i className="fa fa-arrow-alt-circle-up " aria-hidden="true" />
                                <p>Withdraw Funds</p>
                            </a>
                        </li>
                        {/* <li className="nav-item ">
                            <a href="/tradinghistory">
                                <i className="fa fa-signal " aria-hidden="true" />
                                <p>Profit Record</p>
                            </a>
                        </li> */}
                        <li className="nav-item ">
                            <a href="/transactions">
                                <i className="fa fa-briefcase " aria-hidden="true" />
                                <p>Transactions history</p>
                            </a>
                        </li>
                        <li className="nav-item ">
                            <a href="/settings">
                                <i className="fa fa-coins" aria-hidden="true" />
                                <p>Profile Update</p>
                            </a>
                        </li>
                        {/* <li className="nav-item ">
                            <a href="/cryptoexchange">
                                <i className="fa fa-coins" aria-hidden="true" />
                                <p>Crypto Exchange</p>
                            </a>
                        </li> */}
                        <li className="nav-item  ">
                            <a data-toggle="collapse" href="#mpack">
                                <i className="fas fa-cubes" />
                                <p>Invest</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="mpack">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="/subscribe">
                                            <span className="sub-item">Subscribe to a Plan</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/myinvestment">
                                            <span className="sub-item">My Investment</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a href="/referral">
                                <i className="fa fa-recycle " aria-hidden="true" />
                                <p>Refer Users</p>
                            </a>
                        </li>
                        <li className="nav-item ">
                            <a href="/support">
                                <i className="fa fa-life-ring" aria-hidden="true" />
                                <p>Help/Support</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar