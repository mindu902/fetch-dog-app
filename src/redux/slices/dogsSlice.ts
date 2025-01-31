import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogsState {
  dogs: Dog[];
  favorites: Dog[];
}

const initialState: DogsState = {
  dogs: [],
  favorites: [],
};

const dogsSlice = createSlice({
  name: "dogs",
  initialState,
  reducers: {
    setDogs: (state, action: PayloadAction<Dog[]>) => {
      state.dogs = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Dog>) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((dog) => dog.id !== action.payload);
    },
  },
});

export const { setDogs, addFavorite, removeFavorite } = dogsSlice.actions;
export default dogsSlice.reducer;
