import shopApi from '../shopApi';

describe('shopApi', () => {

  const products = {
    productIds: [4],
    quantityById: { 4: 2 }
  };

  const deliveryAddress = {
    fullName: 'Grzegorz Brzęczyszczykiewicz',
    street: 'Powązkowska 666',
    city: 'Warsaw',
    country: 'PL'
  };

  const deliveryMethod = { deliveryMethod: 'post' };

  it('should returns products list', async () => {
    const result = await shopApi.getProducts();

    expect(result.data.products).toBeDefined();
    expect(result.data.products).toBeInstanceOf(Array);
    expect(result.data.products[0]).toMatchObject({
      id: expect.anything(),
      title: expect.anything(),
      price: expect.anything(),
      image: expect.anything()
    });
  });

  it('should create an order', async () => {
    const response = await shopApi.createOrder(products);

    expect(response.data).toMatchObject({
      status: 'NEW',
      orderNumber: expect.any(Number),
      products
    });
  });

  it('should update delivery address', async () => {
    const order = await shopApi.createOrder(products);

    const response = await shopApi.changeDeliveryAddress(order.data.orderNumber, deliveryAddress);

    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({ status: 'OK' });

    const orderWithUpdatedAddress = await shopApi.getOrder(order.data.orderNumber);

    expect(orderWithUpdatedAddress.data).toMatchObject({
      deliveryAddress
    })
  });

  it('should update delivery method', async () => {
    const order = await shopApi.createOrder(products);

    const response = await shopApi.changeDeliveryMethod(order.data.orderNumber, deliveryMethod);

    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({ status: 'OK' });

    const orderWithUpdatedDeliveryMethod = await shopApi.getOrder(order.data.orderNumber);

    expect(orderWithUpdatedDeliveryMethod.data).toMatchObject({
      deliveryMethod
    })
  });

  it('should submit order', async () => {
    const order = await shopApi.createOrder(products);

    const responseDeliveryAddress = await shopApi.changeDeliveryAddress(order.data.orderNumber, deliveryAddress);
    expect(responseDeliveryAddress.status).toEqual(200);
    expect(responseDeliveryAddress.data).toMatchObject({ status: 'OK' });

    const responseDeliveryMethod = await shopApi.changeDeliveryMethod(order.data.orderNumber, deliveryMethod);
    expect(responseDeliveryMethod.status).toEqual(200);
    expect(responseDeliveryMethod.data).toMatchObject({ status: 'OK' });

    const responseSubmittedOrder = await shopApi.submitOrder(order.data.orderNumber);
    expect(responseSubmittedOrder.status).toEqual(200);
    expect(responseSubmittedOrder.data).toMatchObject({ status: 'OK' });

    const orderSubmitted = await shopApi.getOrder(order.data.orderNumber);

    expect(orderSubmitted.data).toMatchObject({
      status: 'SUBMITTED',
      orderNumber: order.data.orderNumber,
      products,
      deliveryAddress,
      deliveryMethod
    })
  })
});
