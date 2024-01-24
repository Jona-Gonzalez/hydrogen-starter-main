import {COLOR_OPTION_NAME} from '~/lib/constants';

export const formatGroupingWithOptions = ({
  grouping,
  getProductByHandle,
}: {
  grouping: any;
  getProductByHandle: (handle: string) => any;
}) => {
  if (!grouping || !getProductByHandle) return null;

  let validParentGroupProductHandles = [];
  if (grouping.products.length > 0) {
    validParentGroupProductHandles = grouping.products.reduce(
      (acc, product) => {
        if (!getProductByHandle(product.handle)) return acc;
        // TODO: logic to filter out draft products on production
        // if (
        //   !isPreview &&
        //   getProductByHandle(product.handle).status !== 'ACTIVE'
        // )
        //   return acc;
        return [...acc, product.handle];
      },
      [],
    );
  }
  const hasParentGroupWithProducts = validParentGroupProductHandles.length > 0;

  let validSubGroupProductHandlesByIndex: any = {};
  if (grouping.subgroups?.length > 0) {
    validSubGroupProductHandlesByIndex = grouping.subgroups.reduce(
      (sgAcc, subgroup, sgIndex) => {
        if (!subgroup.products?.length) return sgAcc;
        const validHandles = subgroup.products.reduce((acc, sgProduct) => {
          if (!getProductByHandle(sgProduct.handle)) return acc;
          // TODO: logic to filter out draft products on production
          // if (
          //   !isPreview &&
          //   getProductByHandle(sgProduct.handle).status !== 'ACTIVE'
          // )
          //   return acc;
          return [...acc, sgProduct.handle];
        }, []);
        return {...sgAcc, [sgIndex]: validHandles};
      },
      {},
    );
  }
  const hasSubGroupsWithProducts = Object.values(
    validSubGroupProductHandlesByIndex,
  ).some((handles) => handles.length > 0);

  let subGroupProductsByIndex = {};
  if (hasSubGroupsWithProducts) {
    subGroupProductsByIndex = Object.entries(
      validSubGroupProductHandlesByIndex,
    ).reduce((acc, [sgIndex, handles]) => {
      return {
        ...acc,
        [sgIndex]: handles.map((sgProductHandle) =>
          getProductByHandle(sgProductHandle),
        ),
      };
    }, {});
  }

  const parentGroupProducts = validParentGroupProductHandles.map(
    (productHandle) => {
      return getProductByHandle(productHandle);
    },
  );

  let parentGroupOptionsMap = null;
  if (hasParentGroupWithProducts) {
    parentGroupOptionsMap = parentGroupProducts.reduce((acc, {options}) => {
      options?.forEach(({name, values}) => {
        if (!acc[name]) {
          acc[name] = values;
        } else {
          acc[name] = [...new Set([...acc[name], ...values])];
        }
      });
      return acc;
    }, {});
  }

  let subGroupOptionsMapsByIndex: any = {};
  if (hasSubGroupsWithProducts) {
    subGroupOptionsMapsByIndex = Object.entries(subGroupProductsByIndex).reduce(
      (acc, [sgIndex, sgProducts]) => {
        const subGroupOptions = sgProducts.reduce((sgAcc, {options}) => {
          options?.forEach(({name, values}) => {
            if (!sgAcc[name]) {
              sgAcc[name] = values;
            } else {
              sgAcc[name] = [...new Set([...sgAcc[name], ...values])];
            }
          });
          return sgAcc;
        }, {});

        return {
          ...acc,
          [sgIndex]: subGroupOptions,
        };
      },
      {},
    );
  }

  const combinedGroupOptionsInitialMap: any = {};
  if (hasParentGroupWithProducts) {
    Object.entries(parentGroupOptionsMap).forEach(([name, values]) => {
      combinedGroupOptionsInitialMap[name] = {values};
      if (name === COLOR_OPTION_NAME && hasSubGroupsWithProducts) {
        combinedGroupOptionsInitialMap[name].groups = [
          {
            name: 'Default',
            values,
          },
        ];
      }
    });
  }
  if (hasSubGroupsWithProducts) {
    Object.entries(subGroupOptionsMapsByIndex).forEach(
      ([subgroupIndex, subGroupOptions]) => {
        Object.entries(subGroupOptions).forEach(([name, values]) => {
          if (!combinedGroupOptionsInitialMap[name]) {
            combinedGroupOptionsInitialMap[name] = {values};
          } else {
            combinedGroupOptionsInitialMap[name].values = [
              ...new Set([
                ...combinedGroupOptionsInitialMap[name].values,
                ...values,
              ]),
            ];
          }
          if (name === COLOR_OPTION_NAME) {
            combinedGroupOptionsInitialMap[name].groups = [
              ...(combinedGroupOptionsInitialMap[name].groups || []),
              {
                name: grouping.subgroups[subgroupIndex].title,
                values,
              },
            ];
          }
        });
      },
    );
  }

  const combinedGroupOptions = Object.entries(
    combinedGroupOptionsInitialMap,
  ).map(([name, {values, groups}]) => {
    return {
      name,
      values,
      ...(groups && {groups, hasSubGroups: true}),
    };
  });

  const combinedGroupOptionsMap = combinedGroupOptions.reduce(
    (acc, {name, values}) => {
      acc[name] = values;
      return acc;
    },
    {},
  );

  return {
    ...grouping,
    options: combinedGroupOptions,
    optionsMap: combinedGroupOptionsMap,
    products: validParentGroupProductHandles,
    subgroups: hasSubGroupsWithProducts
      ? grouping.subgroups.map((subgroup: any, index: number) => {
          return {
            ...subgroup,
            products: validSubGroupProductHandlesByIndex[index] || [],
          };
        })
      : [],
  };
};
