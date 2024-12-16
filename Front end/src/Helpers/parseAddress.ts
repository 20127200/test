
export const parseAddress = (address: string) => {
    const cityList = ["TP.HCM", "Ngoại Thành"];
    const districtList = [
      "Quận 1",
      "Quận 2",
      "Quận 3",
      "Quận 4",
      "Quận 5",
      "Quận 6",
      "Quận 7",
      "Quận 8",
      "Quận 9",
      "Quận 10",
      "Quận 11",
      "Quận 12",
      "Tân Bình",
      "Tân Phú",
      "Bình Tân",
      "Bình Thạnh",
      "Gò Vấp",
      "Phú Nhuận",
      "Thủ Đức",
      "Nhà Bè",
      "Cần Giờ",
      "Củ Chi",
      "Hóc Môn",
      "Bình Chánh",
    ];
  
    let city = cityList.find((city) => address.includes(city)) || "";
    let district =
      districtList.find((district) => address.includes(district)) || "";
  
    let street = address;
    if (city) {
      street = street.replace(city, "").trim();
    }
    if (district) {
      street = street.replace(district, "").trim();
    }
  
    street = street.replace(/,\s*$/, "").replace(/,+/g, "").trim();
    return { street, district, city };
  };
  