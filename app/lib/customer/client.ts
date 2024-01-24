import {encode} from 'shopify-gid';
import btoa from 'btoa';

import {queries} from './queries';
import {mutations} from './mutations';

const formatError = (error = '') => {
  let _error = error;
  _error = _error.replace(/^\[\S+\]/g, '');
  _error = _error.replace(/(- Request ID:).+$/g, '');
  _error = _error.replace(/(: {).+$/g, '');
  return _error.trim();
};

const errorsResponse = (errors: any) => {
  const _errors = Array.isArray(errors?.message)
    ? errors.message.map(formatError)
    : [formatError(errors.message)];
  return {
    errors: _errors,
    response: null,
  };
};

export const accessTokenRenew = async (
  context: any, // TODO: create context type
  {
    accessToken,
    country = 'US',
  }: {
    accessToken: {token: string};
    country?: string;
  },
) => {
  try {
    const renew = {
      response: null,
      errors: [],
      data: null,
    };

    renew.response = await context.storefront.mutate(
      mutations.accessTokenRenew,
      {variables: {accessToken, country}},
    );

    renew.errors = renew.response?.renew?.errors || [];
    renew.data = renew.response?.renew;

    const errors = renew.errors.map((error) => error?.message).filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: renew.data,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addresses = async (
  context: any,
  {
    accessToken,
    country = 'US',
  }: {
    accessToken: {token: string};
    country?: string;
  },
) => {
  try {
    const get = {
      response: null,
      errors: [],
      addresses: null,
    };

    if (!accessToken?.token) {
      throw new Error('accessToken not provided');
    }
    // Get customer from token
    get.response = await context.storefront.query(queries.getAddresses, {
      variables: {
        accessToken: accessToken.token,
        country,
      },
    });

    get.errors = get.response?.errors?.length
      ? get.response.errors.map((error) => error?.message).filter(Boolean)
      : [];

    if (get.errors.length) {
      throw new Error(get.errors);
    }

    get.customer = get.response?.customer;

    const addresses = get?.customer?.addresses || [];

    return {
      errors: null,
      response: {
        addresses,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressCreate = async (
  context: any,
  {
    accessToken,
    address,
    isDefault,
    country = 'US',
  }: {
    accessToken: {token: string};
    address: any;
    isDefault?: boolean;
    country?: string;
  },
) => {
  try {
    const created = {
      response: null,
      errors: [],
      address: null,
    };

    const defaulted = {
      response: null,
      errors: [],
      address: null,
    };

    if (!accessToken || !address) {
      throw new Error('A required address create field is missing.');
    }

    // 1. create the new customer address
    created.response = await context.storefront.mutate(
      mutations.addressCreate,
      {
        variables: {
          country,
          accessToken: accessToken.token,
          address,
        },
      },
    );

    created.errors = created.response?.create?.errors || [];
    created.address = created.response?.create?.address || null;

    // 2. if needed set address as default
    if (isDefault) {
      defaulted.response = await context.storefront.mutate(
        mutations.addressDefaultUpdate,
        {
          variables: {
            country,
            accessToken: accessToken.token,
            id: created.address.id,
          },
        },
      );

      defaulted.address =
        defaulted?.response?.default?.customer?.defaultAddress;
      defaulted.errors = defaulted.response?.default?.errors || [];
    }

    const errors = [...created.errors, ...defaulted.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        address: created.address,
        defaultAddress: defaulted.address,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressUpdate = async (
  context: any,
  {
    accessToken,
    id,
    address,
    isDefault,
    country = 'US',
  }: {
    accessToken: {token: string};
    id: string;
    address: any;
    isDefault?: boolean;
    country?: string;
  },
) => {
  try {
    const updated = {
      response: null,
      errors: [],
      address: null,
    };

    const defaulted = {
      response: null,
      errors: [],
      address: null,
    };

    if (!accessToken || !id || !address || typeof isDefault === 'undefined') {
      throw new Error('A required address update field is missing.');
    }

    // 1. update address data
    updated.response = await context.storefront.mutate(
      mutations.addressUpdate,
      {
        variables: {
          country,
          accessToken: accessToken.token,
          id,
          address,
        },
      },
    );

    updated.errors = updated.response?.update?.errors || [];
    updated.address = updated.response?.update?.address;

    // 2. if needed set address as default
    if (isDefault) {
      defaulted.response = await context.storefront.mutate(
        mutations.addressDefaultUpdate,
        {
          variables: {
            country,
            accessToken: accessToken.token,
            id,
          },
        },
      );

      defaulted.address =
        defaulted?.response?.default?.customer?.defaultAddress;
      defaulted.errors = defaulted.response?.default?.errors || [];
    }

    const errors = [...updated.errors, ...defaulted.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        address: updated.address || null,
        defaultAddress: defaulted.address,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressDelete = async (
  context: any,
  {
    accessToken,
    id,
    country = 'US',
  }: {
    accessToken: {token: string};
    id: string;
    country: string;
  },
) => {
  try {
    const deleted = {
      response: null,
      errors: [],
      addressId: null,
    };

    if (!accessToken?.token || !id) {
      throw new Error('Missing required accessToken or id field');
    }

    // 1. delete address
    deleted.response = await context.storefront.mutate(
      mutations.addressDelete,
      {
        variables: {
          country,
          accessToken: accessToken.token,
          id,
        },
      },
    );

    deleted.addressId =
      deleted.response.delete.deletedCustomerAddressId || null;

    deleted.errors =
      deleted.response?.errors || deleted.response?.delete?.errors || [];

    const errors = deleted.errors
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        deletedCustomerAddressId: deleted.addressId,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerActivate = async (
  context: any,
  {
    customerId,
    activationToken,
    password,
    country = 'US',
  }: {
    customerId: string;
    activationToken: string;
    password: string;
    country?: string;
  },
) => {
  let errors: string[] = [];
  try {
    const activated = {
      response: null,
      errors: [],
      data: null,
    };

    activated.response = await context.storefront.mutate(
      mutations.customerActivate,
      {
        variables: {
          id: encode('Customer', customerId),
          country,
          input: {
            activationToken,
            password,
          },
        },
      },
    );

    activated.errors = activated.response?.errors || [];

    if (activated.errors?.length) {
      errors = activated.errors.map((error) => error?.message).filter(Boolean);
    }

    if (activated.response?.customerActivate?.errors?.length) {
      errors = [
        ...errors,
        ...(activated.response?.customerActivate?.errors
          ?.map((error) => error?.message)
          .filter(Boolean) || []),
      ];
    }

    if (errors?.length) {
      throw new Error(errors);
    }

    activated.data = activated.response?.customerActivate;
    delete activated.data.errors;

    return {
      errors: null,
      response: activated.data,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerGet = async (
  context: any,
  {
    accessToken,
    country = 'US',
  }: {
    accessToken: {token: string};
    country?: string;
  },
) => {
  try {
    const get = {
      response: null,
      errors: [],
      customer: null,
    };

    if (!accessToken?.token) {
      throw new Error('accessToken not provided');
    }

    // Get customer from token
    get.response = await context.storefront.query(queries.getCustomer, {
      variables: {
        accessToken: accessToken.token,
        country,
      },
    });

    get.errors = get.response?.errors?.length
      ? get.response.errors.map((error) => error?.message).filter(Boolean)
      : [];

    if (get.errors.length) {
      throw new Error(get.errors);
    }

    get.customer = get.response?.customer || null;

    return {
      errors: null,
      response: {
        customer: get.customer,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerMetafield = async (
  context: any,
  {
    accessToken,
    country = 'US',
    key,
    namespace,
  }: {
    accessToken: {token: string};
    country?: string;
    key: string;
    namespace: string;
  },
) => {
  try {
    const get = {
      response: null,
      errors: [],
      metafield: null,
    };

    if (!accessToken?.token) {
      throw new Error('accessToken not provided');
    }
    if (!key) {
      throw new Error('metafield key not provided');
    }
    if (!namespace) {
      throw new Error('metafield namespace not provided');
    }

    // Get customer from token
    get.response = await context.storefront.query(queries.getMetafield, {
      variables: {
        country,
        accessToken: accessToken.token,
        key,
        namespace,
      },
    });

    get.errors = get.response?.errors?.length
      ? get.response.errors.map((error) => error?.message).filter(Boolean)
      : [];

    if (get.errors?.length) {
      throw new Error(get.errors);
    }

    get.metafield = get.response?.customer?.metafield || null;

    if (!get.metafield) {
      throw new Error('metafield not found');
    }

    return {
      errors: null,
      response: {
        metafield: get.metafield,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerLogin = async (
  context: any,
  {
    email,
    password,
    country = 'US',
  }: {email: string; password: string; country?: string},
) => {
  try {
    let errors: string[] = [];
    const login = {
      response: null,
      errors: [],
      accessToken: null,
    };
    const get = {
      response: null,
      errors: [],
      customer: null,
    };

    if (!email || !password) {
      throw new Error('required email or password not provided');
    }

    // 1. Login with email and pass to get an accessToken
    login.response = await context.storefront.mutate(mutations.customerLogin, {
      variables: {country, input: {email, password}},
    });

    login.accessToken = login.response?.login?.customerAccessToken;
    login.errors = login.response?.login?.errors || [];

    // 2. get fresh customer with token info if there was no errors
    if (!login.errors.length && login?.accessToken?.token) {
      get.response = await context.storefront.query(queries.getCustomer, {
        variables: {
          country,
          accessToken: login.accessToken.token,
        },
      });

      console.log('get.response', get.response);

      get.customer = get.response?.customer;
      get.errors = get.response?.errors || [];

      if (!get.customer) {
        throw new Error('customer not found');
      }
    }

    errors = [...login.errors, ...get.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        accessToken: login.accessToken || null,
        customer: get.customer || null,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerCreate = async (
  context: any,
  {
    email,
    password,
    firstName,
    lastName,
    acceptsMarketing = false,
    country = 'US',
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    acceptsMarketing?: boolean;
    country?: string;
  },
) => {
  try {
    let errors: string[] = [];
    const created = {
      response: null,
      errors: [],
      customer: null,
    };
    const login = {
      response: null,
      errors: [],
      token: null,
    };

    if (!email || !password || !firstName || !lastName) {
      throw new Error('Missing required customerCreate field');
    }

    // 1. Create customer
    created.response = await context.storefront.mutate(
      mutations.customerCreate,
      {
        variables: {
          country,
          input: {email, password, firstName, lastName, acceptsMarketing},
        },
      },
    );

    created.customer = created.response?.customerCreate;
    created.errors = created.response?.customerCreate?.errors || [];

    errors = created.errors;

    if (!errors.length && created.customer) {
      // 2. login by creating an accessToken
      login.response = await context.storefront.mutate(
        mutations.accessTokenCreate,
        {
          variables: {
            country,
            input: {
              email,
              password,
            },
          },
        },
      );

      console.log('login.response', login.response);

      login.errors = login.response?.login?.errors || [];
      login.token = login.response?.login;
    }

    errors = [...errors, ...login.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    const response = {
      ...created.customer,
      ...login.token,
    };

    delete response.errors;

    return {
      errors: null,
      response,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerUpdate = async (
  context: any,
  {
    accessToken,
    customer,
    country = 'US',
  }: {accessToken: {token: string}; customer: any; country?: string},
) => {
  try {
    let errors: string[] = [];
    const updated = {
      response: null,
      errors: [],
      customer: null,
    };
    const renewed = {
      response: null,
      errors: [],
      token: null,
    };

    if (!accessToken?.token || !customer) {
      throw new Error('required accessToken or customer not provided');
    }

    // 1. Update the customer
    updated.response = await context.storefront.mutate(
      mutations.customerUpdate,
      {
        variables: {
          accessToken: accessToken.token,
          customer,
          country,
        },
      },
    );

    updated.errors = updated.response?.customerUpdate?.errors || [];
    updated.customer = updated.response?.customerUpdate?.customer;

    if (!errors.length && updated.customer) {
      // 2. renew token so we can save it
      renewed.response = await context.storefront.mutate(
        mutations.accessTokenRenew,
        {
          variables: {
            country,
            accessToken: accessToken.token,
          },
        },
      );

      renewed.errors =
        renewed.response?.renew?.errors || renewed.response?.errors || [];

      renewed.token = renewed.response?.renew?.accessToken;

      if (!renewed.token) {
        throw new Error('could not renew updated customer token');
      }
    }

    errors = [...errors, ...renewed.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        accessToken: renewed.token,
        customer: updated.customer,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerOrder = async (
  context: any,
  {
    accessToken,
    id,
    country = 'US',
  }: {accessToken: {token: string}; id: string; country?: string},
) => {
  try {
    const get = {
      response: null,
      errors: [],
      order: null,
    };

    if (!accessToken?.token) {
      throw new Error('accessToken not provided');
    }

    if (!id) {
      throw new Error('order id not provided');
    }

    // Get customer from token
    get.response = await context.storefront.query(queries.getOrderById, {
      variables: {country, id},
    });

    if (!get.response?.order) {
      throw new Error(`order not found with id ${id}`);
    }

    get.order = get.response.order;

    return {
      errors: null,
      response: {
        order: get.order,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerOrders = async (
  context: any,
  {
    accessToken,
    first,
    last,
    before,
    after = '',
    country = 'US',
  }: {
    accessToken: {token: string};
    first?: number;
    last?: number;
    before?: string;
    after?: string;
    country?: string;
  },
) => {
  try {
    if (!accessToken || !first) {
      throw new Error('required accessToken not provided');
    }
    if (!first && !last && !before) {
      throw new Error('required pagination not provided');
    }

    const pageVariables = {
      country,
      accessToken,
      first,
    };

    if (after) {
      pageVariables.after = after;
    }

    const response = await context.storefront.query(
      first ? queries.getOrdersNext : queries.getOrdersPrevious,
      {variables: pageVariables},
    );

    const data = response?.customer?.orders;

    const pageInfo = data?.pageInfo;
    const page = data?.page;
    const orders = page.map((pageOrders) => {
      return {
        ...pageOrders.order,
        // this will be used as slug for the details page
        detailsUrl: `/account/orders/${btoa(pageOrders.order.id)}`,
      };
    });
    const nextPage = pageInfo.hasNextPage ? page[page.length - 1].cursor : null;

    const prevPage = pageInfo.hasPreviousPage ? page[0].cursor : null;

    return {
      errors: null,
      response: {
        orders,
        after: nextPage,
        before: prevPage,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const passwordReset = async (
  context: any,
  {
    password,
    url,
    country = 'US',
  }: {password: string; url: string; country?: string},
) => {
  try {
    const reset = {
      response: null,
      errors: [],
      data: null,
    };

    if (!password || !url) {
      throw new Error('required password or url not provided');
    }

    reset.response = await context.storefront.mutate(mutations.passwordReset, {
      variables: {
        password,
        resetUrl: url,
        country,
      },
    });

    reset.errors = reset.response?.reset?.errors
      ? reset.response?.reset?.errors
          .map((error) => error?.message)
          .filter(Boolean)
      : [];

    if (reset.errors?.length) {
      throw new Error(reset.errors);
    }

    const response = reset.response?.reset;
    delete response.errors;

    return {
      errors: null,
      response,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const passwordRecover = async (
  context: any,
  {email, country = 'US'}: {email: string; country?: string},
) => {
  try {
    const recover = {
      response: null,
      errors: [],
      data: null,
    };

    if (!email) {
      throw new Error('Missing required email field');
    }

    recover.response = await context.storefront.mutate(
      mutations.passwordRecover,
      {variables: {email, country}},
    );

    recover.errors = recover?.response?.recover?.errors?.length
      ? recover.response.recover.errors
          .map((error) => error?.message)
          .filter(Boolean)
      : [];

    if (recover.errors?.length) {
      throw new Error(recover.errors);
    }

    return {
      errors: null,
      response: {
        emailSent: true,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

/*
    Internal helpers
  */
// export const enrichOrder = async ({order}) => {
//   const {pascalCase} = await import('change-case');
//   const TimeAgo = (await import('javascript-time-ago')).default;
//   const enLang = (await import('javascript-time-ago/locale/en')).default;

//   TimeAgo.addLocale(enLang);

//   const timeAgo = new TimeAgo('en-US');
//   const orderDate = new Date(order.processedAt);
//   const timeSinceOrder = timeAgo.format(orderDate);

//   const [, month, day, year] = new Date(Date.parse(order.processedAt))
//     .toString()
//     .split(' ');

//   const date = `${month} ${day}, ${year}`;

//   const fulfillmentStatus = order.fulfillmentStatus
//     .split('_')
//     .map(pascalCase)
//     .join(' ');

//   const isFulfilled = order.fulfillmentStatus === 'FULFILLED';
//   const isPaid = order.financialStatus === 'PAID';

//   const financialStatus = order.financialStatus
//     .split('_')
//     .map(pascalCase)
//     .join(' ');

//   return {
//     ...order,
//     timeSinceOrder,
//     date,
//     isFulfilled,
//     fulfillmentStatus,
//     isPaid,
//     financialStatus,
//   };
// };
