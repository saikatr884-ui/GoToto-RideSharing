import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Ride {
  id: string;
  status: string;
  fare: number;
  distance: number;
  duration: number;
  pickupLocation: any;
  dropoffLocation: any;
  driverId: string | null;
  customerId: string;
  createdAt: string;
}

interface RideState {
  currentRide: Ride | null;
  rideHistory: Ride[];
  loading: boolean;
  error: string | null;
}

const initialState: RideState = {
  currentRide: null,
  rideHistory: [],
  loading: false,
  error: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setCurrentRide: (state, action: PayloadAction<Ride | null>) => {
      state.currentRide = action.payload;
    },
    setRideHistory: (state, action: PayloadAction<Ride[]>) => {
      state.rideHistory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateRideStatus: (state, action: PayloadAction<string>) => {
      if (state.currentRide) {
        state.currentRide.status = action.payload;
      }
    },
  },
});

export const {
  setCurrentRide,
  setRideHistory,
  setLoading,
  setError,
  updateRideStatus,
} = rideSlice.actions;
export default rideSlice.reducer;
