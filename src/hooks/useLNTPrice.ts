import { useState, useEffect } from "react";
import usePrice from 'hooks/usePrice'

/*
const useLNTPrice = () => {
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const lnt_token_address = '0xC13CbF50370E5EaE6f5Dd9D8a1015007f34C4eaD'
  const lnt_pair_address = '0x3230784b84dE1C68e55b41042d37951E14FfbBB4'
  const bnb_token_address = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  const bnb_pair_address = '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16'

  useEffect(() => {
    async function  calcPrice() {
      setLoading(true);
      try { 
              
          const [lntPrice, bnbPrice] = await Promise.all([
              usePrice(lnt_token_address, lnt_pair_address),
              usePrice(bnb_token_address, bnb_pair_address)
          ])
          const price = lntPrice * bnbPrice
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

export default useLNTPrice;
*/

