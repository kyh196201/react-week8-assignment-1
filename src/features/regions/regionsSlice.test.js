import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';

import reducer, {
  setRegions,
  selectRegion,
  statusSelector,
  loadRegions,
  getRegions,
} from './regionsSlice';

import STATUS from '../../constants/status';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../../services/api');

describe('regionsSlice', () => {
  let store;

  it('has initial state', () => {
    expect(reducer(undefined, { type: 'regions/action' })).toEqual({
      status: STATUS.IDLE,
      regions: [],
      selectedRegion: null,
      error: null,
    });
  });

  describe('setRegions', () => {
    it('changes regions', () => {
      const prevState = {
        regions: [],
      };

      const regions = [
        { id: 1, name: '서울' },
      ];

      const state = reducer(prevState, setRegions(regions));

      expect(state.regions).toHaveLength(1);
    });
  });

  describe('selectRegion', () => {
    it('changes selected region', () => {
      const prevState = {
        regions: [
          { id: 1, name: '서울' },
        ],
        selectedRegion: null,
      };

      const state = reducer(prevState, selectRegion({ regionId: 1 }));

      expect(state.selectedRegion).toEqual({
        id: 1,
        name: '서울',
      });
    });
  });

  describe('statusSelector', () => {
    const state = {
      regions: { status: '' },
    };

    expect(statusSelector(state)).toBe('');
  });

  describe('loadRegions', () => {
    beforeEach(() => {
      store = mockStore({});
    });

    it('dispatches setRegions', async () => {
      await store.dispatch(loadRegions());

      const actions = store.getActions();

      expect(actions[0]).toEqual(setRegions([]));
    });
  });

  describe('getRegions', () => {
    beforeEach(() => {
      store = mockStore({
        regions: {
          regions: [],
        },
      });
    });

    context('when success', () => {
      it('calls actions', async () => {
        await store.dispatch(getRegions());

        const actions = store.getActions();

        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(getRegions.pending.type);
        expect(actions[1]).toEqual(expect.objectContaining({
          payload: [],
        }));
      });
    });
  });
});
