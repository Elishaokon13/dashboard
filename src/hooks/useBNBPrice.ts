import { useState, useEffect } from "react";
import usePrice from 'hooks/usePrice'

const useBNBPrice = () => {
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const bnb_token_address = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  const bnb_pair_address = '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16'

  useEffect(() => {
    async function  calcPrice() {
      setLoading(true);
      try { 
              
          const [bnbPrice] = await Promise.all([
              usePrice(bnb_token_address, bnb_pair_address)
          ])
          const price = bnbPrice
          setPrice(price)
          
         //setPrice(0.1234)

      } catch {

      } finally {
        setLoading(false);
      }
    }; 
    
    calcPrice()
  }, []);

  return [ price, loading ];
};

export default useBNBPrice;

