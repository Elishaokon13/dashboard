import { useEffect } from 'react'
import { useLNTStatePriceFixed } from 'state/global/hooks'

const useGetDocumentTitlePrice = () => {
  const cakePriceBusd = useLNTStatePriceFixed()
  useEffect(() => {
    const cakePriceBusdString = cakePriceBusd || ''
    document.title = `Pancake Swap - ${cakePriceBusdString}`
  }, [cakePriceBusd])
}
export default useGetDocumentTitlePrice
