// store/slices/paymentMethodSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentMethodState {
  paymentMethodId: string | null;
}

const initialState: PaymentMethodState = {
  paymentMethodId: null,
};

const paymentMethodSlice = createSlice({
  name: 'paymentMethod',
  initialState,
  reducers: {
    setPaymentMethodId: (state, action: PayloadAction<string>) => {
      state.paymentMethodId = action.payload;
    },
    clearPaymentMethodId: (state) => {
      state.paymentMethodId = null;
    },
  },
});

export const { setPaymentMethodId, clearPaymentMethodId } =
  paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;
