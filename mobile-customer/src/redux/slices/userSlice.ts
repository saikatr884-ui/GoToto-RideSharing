import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
  address: string;
  paymentMethods: any[];
  emergencyContacts: any[];
}

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { setProfile, setLoading, setError, updateProfile } =
  userSlice.actions;
export default userSlice.reducer;
