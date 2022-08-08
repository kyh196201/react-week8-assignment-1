import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchRegions } from '../../services/api';

import { equal } from '../../utils';

import STATUS from '../../constants/status';

export const getRegions = createAsyncThunk('regions/getRegions', async () => {
  const regions = await fetchRegions();

  return regions;
});

const slice = createSlice({
  name: 'regions',
  initialState: {
    regions: [],
    selectedRegion: null,

    status: STATUS.IDLE,
    error: null,
  },
  reducers: {
    setRegions(state, { payload }) {
      return {
        ...state,
        regions: payload,
      };
    },

    selectRegion(state, { payload: { regionId } }) {
      const { regions } = state;

      return {
        ...state,
        selectedRegion: regions.find(equal('id', regionId)),
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(getRegions.pending, (state) => ({
      ...state,
      status: STATUS.LOADING,
    }));

    builder.addCase(getRegions.fulfilled, (state, action) => ({
      ...state,
      regions: action.payload,
      status: STATUS.SUCCEDED,
    }));

    builder.addCase(getRegions.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      status: STATUS.FAILED,
    }));
  },
});

export const {
  setRegions,
  selectRegion,
} = slice.actions;

export function loadRegions() {
  return async (dispatch) => {
    const regions = await fetchRegions();

    dispatch(setRegions(regions));
  };
}

// @TODO 중복되는 네이밍 수정
export const regionsSelector = (state) => state.regions.regions;
export const selectedRegionSelector = (state) => state.regions.selectedRegion;
export const statusSelector = (state) => state.regions.status;

export default slice.reducer;
