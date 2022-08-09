import {
  fetchRegions,
  fetchCategories,
  fetchRestaurants,
  fetchRestaurant,
  postLogin,
  postReview,
} from './api';

import REGIONS from '../../fixtures/regions';
import CATEGORIES from '../../fixtures/categories';
import RESTAURANTS from '../../fixtures/restaurants';
import RESTAURANT from '../../fixtures/restaurant';
import ACCESS_TOKEN from '../../fixtures/access-token';

describe('api', () => {
  const mockFetch = (data, status = true) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: status,
      async json() { return data; },
    });
  };

  describe('fetchRegions', () => {
    context('when success', () => {
      beforeEach(() => {
        mockFetch(REGIONS);
      });

      it('returns regions', async () => {
        const regions = await fetchRegions();

        expect(regions).toEqual(REGIONS);
      });
    });

    context('when failed', () => {
      beforeEach(() => {
        mockFetch(REGIONS, false);
      });

      it('throws "지역 목록 조회에 실패했습니다." message', async () => {
        await expect(async () => {
          await fetchRegions();
        }).rejects.toThrow('지역 목록 조회에 실패했습니다.');
      });
    });
  });

  describe('fetchCategories', () => {
    beforeEach(() => {
      mockFetch(CATEGORIES);
    });

    it('returns categories', async () => {
      const categories = await fetchCategories();

      expect(categories).toEqual(CATEGORIES);
    });
  });

  describe('fetchRestaurants', () => {
    beforeEach(() => {
      mockFetch(RESTAURANTS);
    });

    it('returns restaurants', async () => {
      const restaurants = await fetchRestaurants({
        regionName: '서울',
        categoryId: 1,
      });

      expect(restaurants).toEqual(RESTAURANTS);
    });
  });

  describe('fetchRestaurant', () => {
    beforeEach(() => {
      mockFetch(RESTAURANT);
    });

    it('returns restaurants', async () => {
      const restaurant = await fetchRestaurant({ restaurantId: 1 });

      expect(restaurant).toEqual(RESTAURANT);
    });
  });

  describe('postLogin', () => {
    beforeEach(() => {
      mockFetch({ accessToken: ACCESS_TOKEN });
    });

    it('returns accessToken', async () => {
      const accessToken = await postLogin({
        email: 'tester@example.com',
        password: '1234',
      });

      expect(accessToken).toEqual(ACCESS_TOKEN);
    });
  });

  describe('postReview', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('returns nothing', async () => {
      const result = await postReview({
        accessToken: ACCESS_TOKEN,
        restaurantId: 1,
        score: 5,
        description: '맛있어요!',
      });

      expect(result).toBeUndefined();
    });
  });
});
