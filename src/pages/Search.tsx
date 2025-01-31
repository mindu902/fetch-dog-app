import { useEffect, useState } from "react";
import axios from "axios";
import { fetchBreeds, searchDogs, fetchDogDetails } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addFavorite, removeFavorite } from "../redux/slices/dogsSlice";
import { logout } from "../redux/slices/authSlice";
import {
  Container,
  Grid,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Box,
  Pagination,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import React from "react";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export default function Search() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchParams, setSearchParams] = useSearchParams(); 
  const initialPage = Number(searchParams.get("page")) || 1;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalResults, setTotalResults] = useState(0);
  const PAGE_SIZE = 9;

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.dogs.favorites);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBreeds() {
      const response = await fetchBreeds();
      setBreeds(response.data);
    }
    loadBreeds();
  }, []);

  const handleSearch = async (url: string | null = null, page = currentPage) => {   
    setLoading(true);
    try {
      let searchResponse;
      if (url) {
        searchResponse = await axios.get(API_BASE_URL + url, {
          withCredentials: true,
        });
      } else {                
        let currPageSize = totalResults - (page - 1) * PAGE_SIZE;        
        if (currPageSize <= 0) currPageSize = PAGE_SIZE;
        searchResponse = await searchDogs({
          breeds: selectedBreed ? [selectedBreed] : [],
          sort: `breed:${sortOrder}`,
          size: Math.min(PAGE_SIZE, currPageSize),
          from: (page - 1) * PAGE_SIZE,
        });
      }

      const dogIds = searchResponse.data.resultIds;      
      setTotalResults(searchResponse.data.total || 0);

      setSearchParams({ page: String(page) });
      setCurrentPage(page);

      if (dogIds.length > 0) {
        const dogDetailsResponse = await fetchDogDetails(dogIds);
        setDogs(dogDetailsResponse.data);
      } else {
        setDogs([]);
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  useEffect(() => {
    handleSearch(null, currentPage);
  }, [sortOrder, currentPage]);

  const toggleFavorite = (dog: Dog) => {
    if (favorites.some((fav) => fav.id === dog.id)) {
      dispatch(removeFavorite(dog.id));
    } else {
      dispatch(addFavorite(dog));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Find Your Perfect Dog</Typography>
        <Box>
          <Button
            variant="contained"
            sx={{ mr: 2, backgroundColor: "#fba918" }}
            onClick={() => navigate("/favorites")}
          >
            View Favorites ({favorites.length})
          </Button>
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "white",
              color: "#fba918",
              borderColor: "#fba918",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Breed</InputLabel>
          <Select
            value={selectedBreed}
            label="Breed"
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            <MenuItem value="">All Breeds</MenuItem>
            {breeds.map((breed) => (
              <MenuItem key={breed} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort by Breed</InputLabel>
          <Select
            value={sortOrder}
            label="Sort by Breed"
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="asc">Ascending ⬆</MenuItem>
            <MenuItem value="desc">Descending ⬇</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2, backgroundColor: "#fba918" }}
          onClick={() => handleSearch()}
        >
          Search
        </Button>
      </Box>

      {!loading ? (
        <Grid container spacing={3}>
          {dogs.map((dog) => (
            <Grid item xs={12} sm={6} md={4} key={dog.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={dog.img}
                  alt={dog.name}
                />
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {dog.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Breed:
                    </Typography>
                    <Typography variant="body2">{dog.breed}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Age:
                    </Typography>
                    <Typography variant="body2">{dog.age}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Location:
                    </Typography>
                    <Typography variant="body2">{dog.zip_code}</Typography>
                  </Box>
                </CardContent>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    color: "#fba918",
                    borderColor: "#fba918",
                    m: 1,
                  }}
                  onClick={() => toggleFavorite(dog)}
                >
                  {favorites.some((fav) => fav.id === dog.id)
                    ? "❤️ Favorited"
                    : "♡ Favorite"}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <CircularProgress
          sx={{ display: "block", color: "#fba918", margin: "20px auto" }}
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => handleSearch(null, page)}
          color="primary"
          sx={{ "& .MuiPaginationItem-root": { color: "#fba918" } }}
        />
      </Box>
    </Container>
  );
}
