import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as publicApi from '@/services/public-api';
import { RootState } from '..';

interface AdImage {
  id: number;
  uri: string;
}

interface AdsState {
  images: AdImage[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: AdsState = {
  images: [],
  loading: 'idle',
};

export const fetchAdImages = createAsyncThunk(
  'ads/fetchImages',
  async () => {
    console.log('Fetching ad images from API...');
    const ads = await publicApi.getAdsCover();
    console.log('Fetched ad data:', ads);
    const images: AdImage[] = ads.map(ad => ({
      id: ad.id,
      uri: publicApi.getFileUrl(ad.file_id),
    }));
    console.log('Processed ad images with URLs:', images);
    return images;
  }
);

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    clearAds: (state) => {
      state.images = [];
      state.loading = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdImages.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchAdImages.fulfilled, (state, action: PayloadAction<AdImage[]>) => {
        state.loading = 'succeeded';
        state.images = action.payload;
      })
      .addCase(fetchAdImages.rejected, (state) => {
        state.loading = 'failed';
      });
  },
});

export const { clearAds } = adsSlice.actions;

export default adsSlice.reducer;
