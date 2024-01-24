import {createContext, ReactNode, useContext, useMemo, useReducer} from 'react';
import EventEmitter from 'eventemitter3';

type Dispatch = ({type, payload}: {type: string; payload?: any}) => void;

const emitter = new EventEmitter();

const Context = createContext({state: {}, actions: {}});

const globalState = {
  cartOpen: false,
  modal: {children: null, props: {}},
  overlayOpen: false,
  searchOpen: false,
  emitter,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'OPEN_CART':
      return {
        ...state,
        cartOpen: true,
        modal: {children: null, props: {}},
        overlayOpen: true,
        searchOpen: false,
      };
    case 'CLOSE_CART':
      return {
        ...state,
        cartOpen: false,
        overlayOpen: false,
      };
    case 'OPEN_MODAL':
      return {
        ...state,
        cartOpen: false,
        modal: {
          children: action.payload.children,
          props: action.payload.props,
        },
        overlayOpen: true,
        searchOpen: false,
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: {children: null, props: {}},
        overlayOpen: false,
      };
    case 'CLOSE_OVERLAY':
      return {
        ...state,
        cartOpen: false,
        modal: {children: null, props: {}},
        overlayOpen: false,
        searchOpen: false,
      };
    case 'OPEN_SEARCH':
      return {
        ...state,
        cartOpen: false,
        modal: {children: null, props: {}},
        overlayOpen: true,
        searchOpen: true,
      };
    case 'CLOSE_SEARCH':
      return {
        ...state,
        overlayOpen: false,
        searchOpen: false,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  openCart: () => {
    dispatch({type: 'OPEN_CART'});
  },
  closeCart: () => {
    dispatch({type: 'CLOSE_CART'});
  },
  openModal: (children: ReactNode, props: any) => {
    dispatch({type: 'OPEN_MODAL', payload: {children, props}});
  },
  closeModal: () => {
    dispatch({type: 'CLOSE_MODAL'});
  },
  closeOverlay: () => {
    dispatch({type: 'CLOSE_OVERLAY'});
  },
  openSearch: () => {
    dispatch({type: 'OPEN_SEARCH'});
  },
  closeSearch: () => {
    dispatch({type: 'CLOSE_SEARCH'});
  },
});

export function GlobalContextProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(reducer, {...globalState});

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useGlobalContext = () => useContext(Context);
