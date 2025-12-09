// store/slices/imageUploadSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UploadImage {
  imageUrl: string[] | [];
}

const initialState: UploadImage = {
  imageUrl: [],
};

const imageUrlSlice = createSlice({
  name: 'imageUrl',
  initialState,
  reducers: {
    setImageUrl: (state, action: PayloadAction<string[]>) => {
      state.imageUrl = action.payload;
    },
    clearImageUrl: (state) => {
      state.imageUrl = [];
    },
  },
});

export const { setImageUrl, clearImageUrl } = imageUrlSlice.actions;

export default imageUrlSlice.reducer;
