import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import {formatGroupingWithOptions} from '~/lib/utils';
type Dispatch = ({type, payload}: {type: string; payload?: any}) => void;

const Context = createContext({state: {}, actions: {}});

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload.products,
      };
    case 'SET_PRODUCT_INDEXES_MAP':
      return {
        ...state,
        productIndexesMap: action.payload.productIndexesMap,
      };
    case 'SET_GROUPINGS':
      return {
        ...state,
        groupings: action.payload.groupings,
      };
    case 'SET_GROUPING_INDEXES_MAP':
      return {
        ...state,
        groupingIndexesMap: action.payload.groupingIndexesMap,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  setProducts: (products) => {
    dispatch({type: 'SET_PRODUCTS', payload: {products}});
  },
  setProductIndexesMap: (productIndexesMap) => {
    dispatch({type: 'SET_PRODUCT_INDEXES_MAP', payload: {productIndexesMap}});
  },
  setGroupings: (groupings) => {
    dispatch({type: 'SET_GROUPINGS', payload: {groupings}});
  },
  setGroupingIndexesMap: (groupingIndexesMap) => {
    dispatch({type: 'SET_GROUPING_INDEXES_MAP', payload: {groupingIndexesMap}});
  },
});

export function ProductsContextProvider({
  children,
  groupings: initialGroupings,
  productsPromise,
}: {
  children: ReactNode;
  groupings: any;
  productsPromise;
}) {
  const [state, dispatch] = useReducer(reducer, {
    products: [], // all products cache for search and product groupings
    productIndexesMap: null, // map of product handles to index in products array
    groupings: [], // product groupings set in admin
    groupingIndexesMap: null, // map of product handles to index in groupings array
  });

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  useEffect(() => {
    if (state.products.length && state.productIndexesMap) return;

    const loadFullCollection = async () => {
      try {
        let allProducts: any[] = [];
        const allProductIndexesMap: any = {};

        // if session storage is empty, fetch from API
        allProducts = await productsPromise;
        allProducts.forEach((product, index) => {
          const optionsMap = product.options.reduce((acc, option) => {
            acc[option.name] = option.values;
            return acc;
          }, {});
          allProducts[index] = {
            ...product,
            optionsMap,
          };
          allProductIndexesMap[product.handle] = index;
        });

        actions(dispatch).setProducts(allProducts);
        actions(dispatch).setProductIndexesMap(allProductIndexesMap);
      } catch (error: any) {
        console.error(`productsContext:error`, error.message);
      }
    };

    loadFullCollection();
  }, [productsPromise]);

  useEffect(() => {
    if (state.groupings && state.groupingIndexesMap) return;
    if (!state.products.length || !state.productIndexesMap) return;

    const groupings: any[] = [];
    const groupingIndexesMap: any = {};

    initialGroupings.forEach(({node}, index: number) => {
      const groupingWithOptions = formatGroupingWithOptions({
        grouping: node,
        getProductByHandle: (handle) => {
          const productIndex = state.productIndexesMap[handle];
          return state.products[productIndex];
        },
      });

      const groupingProducts = [
        ...groupingWithOptions.products,
        ...groupingWithOptions.subgroups.flatMap(
          (subgroup: any) => subgroup.products,
        ),
      ];
      groupingProducts.forEach((handle) => {
        groupingIndexesMap[handle] = index;
      });
      groupings.push(groupingWithOptions);
    });

    actions(dispatch).setGroupings(groupings);
    actions(dispatch).setGroupingIndexesMap(groupingIndexesMap);
  }, [initialGroupings, state.products, state.productIndexesMap]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useProductsContext = () => useContext(Context);
