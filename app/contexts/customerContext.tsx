import {createContext, ReactNode, useContext, useMemo, useReducer} from 'react';
import {
  AccessToken,
  Customer,
  CustomerStatus,
} from '~/lib/types';
type Dispatch = ({type, payload}: {type: string; payload?: any}) => void;

const Context = createContext({state: {}, actions: {}});

const customerState = {
  accessToken: null,
  customer: null,
  customerStatus: 'uninitialized', // 'uninitialized' | 'creating' | 'fetching' | 'logged_in' | 'guest'
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.payload,
      };
    case 'SET_CUSTOMER':
      return {
        ...state,
        customer: action.payload,
      };
    case 'SET_CUSTOMER_STATUS':
      return {
        ...state,
        customerStatus: action.payload,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  setAccessToken: (accessToken: AccessToken) => {
    dispatch({type: 'SET_ACCESS_TOKEN', payload: accessToken});
  },
  setCustomer: (customer: Customer) => {
    dispatch({type: 'SET_CUSTOMER', payload: customer});
  },
  setCustomerStatus: (customerStatus: CustomerStatus) => {
    dispatch({type: 'SET_CUSTOMER_STATUS', payload: customerStatus});
  },
});

export function CustomerContextProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(reducer, {...customerState});

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useCustomerContext = () => useContext(Context);
