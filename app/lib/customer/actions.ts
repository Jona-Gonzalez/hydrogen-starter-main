import {
  customerCreate,
  customerGet,
  customerLogin,
  customerOrders,
} from './client';

export const customerLoginRegisterAction = async ({request, context}) => {
  const body = await request.formData();
  const requestType = body.get('request-type');

  const actionData: Record<string, unknown> = {
    loginErrors: null,
    registerErrors: null,
    customer: null,
    accessToken: null,
  };

  if (requestType === 'login') {
    const email = body.get('email');
    const password = body.get('password');

    const {errors: loginErrors, response: loginResponse} = await customerLogin(
      context,
      {
        email,
        password,
      },
    );

    if (loginErrors?.length) {
      console.log('customerLogin:errors', loginErrors);
      actionData.loginErrors = loginErrors;
    }
    const {accessToken, customer} = {...loginResponse};
    if (customer) {
      console.log('customerLogin:customer', customer);
      console.log('customerLogin:accessToken', accessToken);
      actionData.customer = customer;
      actionData.accessToken = accessToken;
    }
  }

  if (requestType === 'register') {
    const firstName = body.get('firstName');
    const lastName = body.get('lastName');
    const email = body.get('email');
    const password = body.get('password');
    const passwordConfirm = body.get('passwordConfirm');

    if (password !== passwordConfirm) {
      actionData.registerErrors = ['Passwords do not match'];
      return actionData;
    }

    const {errors: createErrors, response: createResponse} =
      await customerCreate(context, {
        acceptsMarketing: false,
        firstName,
        lastName,
        email,
        password,
      });

    if (createErrors?.length) {
      console.log('customerCreate:errors', createErrors);
      actionData.registerErrors = createErrors;
    }
    const {accessToken, customer} = {...createResponse};
    if (customer) {
      console.log('customerCreate:customer', customer);
      console.log('customerCreate:accessToken', accessToken);
      actionData.customer = customer;
      actionData.accessToken = accessToken;
    }
  }

  return actionData;
};

export const customerGetAction = async ({request, context}) => {
  const actionData: Record<string, unknown> = {
    errors: null,
    customer: null,
  };
  const body = await request.formData();
  const accessTokenJson = body.get('accessToken');

  if (!accessTokenJson) return actionData;

  const accessToken = JSON.parse(accessTokenJson as string);

  const {errors, response} = await customerGet(context, {accessToken});

  if (errors?.length) {
    console.error('error fetching customer from access token', errors[0]);
    actionData.errors = errors;
    return actionData;
  }

  if (response?.customer) {
    actionData.customer = response.customer;
  }

  return actionData;
};

export const customerOrdersAction = async ({request, context}) => {
  const actionData: Record<string, unknown> = {
    errors: null,
    customer: null,
  };
  const body = await request.formData();
  const accessTokenJson = body.get('accessToken');
  const first = body.get('first');

  if (!accessTokenJson) return actionData;

  const accessToken = JSON.parse(accessTokenJson as string);

  const {errors, response} = await customerOrders(context, {
    accessToken,
    first: first || 10,
  });

  if (errors?.length) {
    console.error('error fetching customer from access token', errors[0]);
    actionData.errors = errors;
    return actionData;
  }

  if (response?.customer) {
    actionData.customer = response.customer;
  }

  return actionData;
};
