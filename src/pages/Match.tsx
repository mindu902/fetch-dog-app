import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { matchDog } from "../services/api";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

import React from "react";

export default function Match() {
  const favorites = useSelector((state: RootState) => state.dogs.favorites);
  const [matchedDog, setMatchedDog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchMatch = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await matchDog(favorites.map((dog) => dog.id));
        const matchedId = response.data.match;
        const matchedDog = favorites.find((dog) => dog.id === matchedId);
        setMatchedDog(matchedDog || null);
      } catch (error) {
        console.error("Error finding match:", error);
      }
      setLoading(false);
    };

    fetchMatch();
  }, [favorites]);

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
        <Typography variant="h4">Your Perfect Dog Match</Typography>
        
        <Box>

       
          <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/search")}
          sx={{ mr: 2, backgroundColor:"#fba918" }}
        >
          Find More Dogs
        </Button>
        <Button variant="contained" color="error" sx={{backgroundColor:"white", color:"#fba918" , borderColor:"#fba918" }} onClick={handleLogout}>
            Logout
          </Button>
          </Box>
      </Box>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : favorites.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography>
            You have no favorites yet! Go back and choose some dogs first. 
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate("/search")}
          >
            Find Dogs
          </Button>
        </Box>
      ) : matchedDog ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Card sx={{ maxWidth: 400, boxShadow: 3, borderRadius: 2 }}>
          <CardMedia
              component="img"
              sx={{
                height: 500, 
                width: "100%",
                objectFit: "cover", 
              }}
              image={matchedDog.img}
              alt={matchedDog.name}
            />
            <CardContent sx={{ textAlign: "left" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>{matchedDog.name}</Typography>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>Breed:</Typography>
                    <Typography variant="body2">{matchedDog.breed}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>Age:</Typography>
                    <Typography variant="body2">{matchedDog.age}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>Location:</Typography>
                    <Typography variant="body2">{matchedDog.zip_code}</Typography>
                  </Box>
                </CardContent>
          </Card>
        </Box>
      ) : (
        <Typography sx={{ textAlign: "center", mt: 4 }}>
          Sorry, we couldn't find a perfect match. Try selecting different
          favorites!
        </Typography>
      )}
    </Container>
  );
}
