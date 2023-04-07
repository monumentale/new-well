import React, { useReducer } from "react";

export const GlobalContext = React.createContext();

const initialState = {
  userdetails: {},
  productdetails: {},
  loggedin: false,
  paymentfor: "",
  productinfo: {},
  singleuser: "",
  selectedinvestment: "",
  cointoinvestwith: ""
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setproductdetails": {
      return {
        ...state,
        productdetails: action.snippet
      };
    }

    case "setselectedinvestment": {
      return {
        ...state,
        selectedinvestment: action.snippet
      };
    }


    case "setcointoinvestwith": {
      return {
        ...state,
        cointoinvestwith: action.snippet
      };
    }

    case "setproductinfo": {
      return {
        ...state,
        productinfo: action.snippet
      };
    }
    case "setsingleuser": {
      return {
        ...state,
        singleuser: action.snippet
      };
    }
    case "setuserdetails": {
      return {
        ...state,
        userdetails: action.snippet
      };
    }
    case "setpaymentfor": {
      return {
        ...state,
        paymentfor: action.snippet
      };
    }
    case "setloggedin": {
      return {
        ...state,
        loggedin: action.snippet
      }
    }
    default:
      return state;
  }
};

export const GlobalState = props => {
  const globalState = useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={globalState}>
      {props.children}
    </GlobalContext.Provider>
  );
};
