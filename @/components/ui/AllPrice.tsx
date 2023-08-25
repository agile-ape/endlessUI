import PriceAmount from "./PriceAmount";

export default function AllPrice() {
  return (
    <div className="grid grid-cols-2 w-[20rem] mx-auto gap-2 my-5">
      <PriceAmount amount="0.0822ETH" type="total" />
      <PriceAmount amount="0.0822ETH" type="current" />
      <PriceAmount amount="0.0822ETH" type="redeem" />
      <PriceAmount amount="0.0822ETH" type="bounty" />
    </div>
  )
}