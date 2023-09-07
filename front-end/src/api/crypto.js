import axios from "axios";

export const fetchCryptos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/crypto');
      
      setCryptos(response.data.cryptos);

    } catch (error) {
      console.error('Error fetching cryptos:', error);
    }
  };