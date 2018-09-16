import nock from 'nock';
import paymentsApi from '../paymentsApi';

describe.only('paymentsApi', () => {
  const payment = {
    token: '123ABC',
    amount: 950,
    card: {
      number: '4111111111111111',
      securityCode: '950',
      expMonth: '07',
      expYear: '21',
      owner: 'John Doe'
    }
  }

  it('authorizes the client', async () => {
    nock('http://payments.local')
      .post('/auth/token')
      .reply(200, {
        'token': '123Token'
      });

    const responseSuccess = await paymentsApi.authorizeClient('test', 'test')

    expect(responseSuccess).toBe('123Token');
  });

  it('throws an error when credentials are wrong', () => {
    nock('http://payments.local')
    .post('/auth/token', { username: 'badUser', password: 'badPassword' })
    .reply(401);

  return paymentsApi
    .authorizeClient('badUser', 'badPassword' )
    .catch(e => expect(e.message).toMatch('Unauthorized'));
  });

  it('processes card payment', async () => {
    const { token, card, amount } = payment;
    const request = {
      token,
      amount: amount * 100,
      card
    }
    nock('http://payments.local')
      .post('/payments/payment', request)
      .reply(200, { transactionId: 'TX123' });

    const responseSuccess = await paymentsApi.processPayment(token, card, amount);

    expect(responseSuccess).toEqual('TX123');
  });

  it('checks if transaction is completed', async () => {
    const { token, card, amount } = payment;
    const transactionId = 'TX123';

    nock('http://payments.local')
      .get(`/payments/payment/${transactionId}`)
      .query({ token })
      .reply(200, { status: 'COMPLETED' });

      const status = await paymentsApi.isPaymentCompleted(token, transactionId);

      expect(status).toBeTruthy();
  });
});
