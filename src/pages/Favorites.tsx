import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeFavorite } from "../redux/slices/dogsSlice";
import { logout } from "../redux/slices/authSlice";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Favorites() {
  const favorites = useSelector((state: RootState) => state.dogs.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h4">Your Favorite Dogs</Typography>
          <Button variant="outlined" sx={{backgroundColor:"white", color:"#fba918" , borderColor:"#fba918" }}  onClick={() => navigate("/search")}>
            Back to Search
          </Button>
        </Box>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2, backgroundColor:"#fba918" }}  onClick={() => navigate("/match")}>
            Find My Match
          </Button>
          <Button variant="contained" sx={{backgroundColor:"white", color:"#fba918" , borderColor:"#fba918" }} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography>
            No favorite dogs yet. Go find some in the Search page!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate("/search")}
          >
            Browse Dogs
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {favorites.map((dog) => (
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
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>{dog.name}</Typography>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>Breed:</Typography>
                    <Typography variant="body2">{dog.breed}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>Age:</Typography>
                    <Typography variant="body2">{dog.age}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>Location:</Typography>
                    <Typography variant="body2">{dog.zip_code}</Typography>
                  </Box>
                </CardContent>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{backgroundColor:"white", color:"#fba918" , borderColor:"#fba918",m: 1  }}
                    onClick={() => dispatch(removeFavorite(dog.id))}
                  >
                    Remove
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>

        </>
      )}
    </Container>
  );
}
