import Basket from '../../utils/basket';

describe('basket', () => {

    it('adds products to basket', () => {
        const basket = new Basket();
        basket.add({ name: 'Masło' });
        expect(basket.products()).toHaveLength(1);
    });

    it('removes product from basket', () => {
        const basket = new Basket();

        basket.add({ name: 'Masło' });
        expect(basket.products()).toHaveLength(1);

        basket.remove({ name: 'Masło' });
        expect(basket.products()).toHaveLength(0);
    });

    it('removes product from basket', () => {
        const basket = new Basket();

        basket.add({ name: 'Masło' });
        expect(basket.products()).toHaveLength(1);
        expect(basket.hasProduct({ name: 'Masło' })).toBeTruthy();
    });
});
