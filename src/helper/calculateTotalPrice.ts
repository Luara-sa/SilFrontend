interface CalcTotalFunctionType {
  price: number;
  discount: number;
  vat: number;
  type: "total with dicount" | "total without discount";
}

export const calculateTotalPrice = ({
  discount,
  price,
  vat,
  type,
}: CalcTotalFunctionType) => {
  if (type === "total without discount") {
    const totalWithVat = (price * vat) / 100;
    return totalWithVat + price;
  } else if (type === "total with dicount") {
    const DiscountToNumber = (price * discount) / 100;
    const totalBeforeVat = price - DiscountToNumber;
    const totalAfterVat = totalBeforeVat + (totalBeforeVat * vat) / 100;
    return totalAfterVat;
  }
};
