"use client";

import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Card,
  Typography,
} from "@mui/material";

const API_BASE = process.env.NEXT_PUBLIC_PYTHON_API_URL; // change in production

export default function TranscriptSearch() {
  const [ticker, setTicker] = useState("");
  const [year, setYear] = useState("");
  const [quarter, setQuarter] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!ticker) return;

    setLoading(true);
    try {
      const params: any = { ticker };

      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const res = await axios.get(`${API_BASE}/transcripts`, { params });

      setResults(res.data.data || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 700, mx: "auto" }}>
      {/* 🔍 Search Bar */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Ticker (e.g. AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          fullWidth
        />

        <TextField
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          sx={{ width: 120 }}
        />

        <TextField
          select
          label="Quarter"
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
          sx={{ width: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Q1">Q1</MenuItem>
          <MenuItem value="Q2">Q2</MenuItem>
          <MenuItem value="Q3">Q3</MenuItem>
          <MenuItem value="Q4">Q4</MenuItem>
        </TextField>

        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          {loading ? "..." : "Search"}
        </Button>
      </Box>

      {/* 📊 Results */}
      <Box>
        {results.map((item, index) => (
          <Card
            key={index}
            sx={{
              p: 2,
              mb: 2,
              cursor: "pointer",
              "&:hover": { boxShadow: 4 },
            }}
            onClick={() => window.open(item.url, "_blank")}
          >
            <Typography fontWeight="bold">{item.company}</Typography>
            <Typography variant="body2">{item.title}</Typography>
            <Typography variant="caption" color="gray">
              {item.quarter} {item.year}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
