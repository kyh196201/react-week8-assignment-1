import { render, fireEvent } from '@testing-library/react';

import { useDispatch, useSelector } from 'react-redux';

import given from 'given2';

import STATUS from '../../constants/status';

import RegionsContainer from './RegionsContainer';

jest.mock('../../services/api');
jest.mock('react-redux');

describe('RegionsContainer', () => {
  const dispatch = jest.fn();

  useSelector.mockImplementation((selector) => selector({
    regions: {
      regions: given.regions,

      selectedRegion: { id: 1, name: '서울' },

      status: given.status,

      error: null,
    },
  }));

  beforeEach(() => {
    dispatch.mockClear();
    useDispatch.mockImplementation(() => dispatch);
  });

  const renderRegionsContainer = () => render((
    <RegionsContainer />
  ));

  // @TODO 제목 어떻게하지
  context('지역 정보를 조회한 적이 없으면', () => {
    given('status', () => STATUS.IDLE);

    it('load regions data', () => {
      renderRegionsContainer();

      expect(dispatch).toBeCalled();
    });
  });

  context('지역 정보를 조회했으면', () => {
    given('status', () => STATUS.SUCCEDED);

    it('doesn\'t load regions data', () => {
      renderRegionsContainer();

      expect(dispatch).not.toBeCalled();
    });
  });

  context('with loading status', () => {
    given('status', () => STATUS.LOADING);

    it('renders loading message', () => {
      const { container } = renderRegionsContainer();

      expect(container).toHaveTextContent('loading..');
    });
  });

  context('with success status', () => {
    given('status', () => STATUS.SUCCEDED);

    context('with regions', () => {
      given('regions', () => [
        { id: 1, name: '서울' },
        { id: 2, name: '부산' },
      ]);

      it('renders checked regions', () => {
        const { container, getByText } = renderRegionsContainer();

        expect(container).toHaveTextContent('서울(V)');
        expect(container).toHaveTextContent('부산');

        fireEvent.click(getByText('부산'));

        expect(dispatch).toBeCalled();
      });
    });

    context('without regions', () => {
      it('renders "지역 목록을 조회하지 못했습니다." message', () => {
        given('regions', () => []);

        const { container } = renderRegionsContainer();

        expect(container).toHaveTextContent('지역 목록을 조회하지 못했습니다.');
      });
    });
  });

  context('with error status', () => {
    given('status', () => STATUS.FAILED);

    it('renders error message', () => {
      const { container } = renderRegionsContainer();

      expect(container).toHaveTextContent('지역 목록을 조회하지 못했습니다.');
    });
  });
});
