import React from "react";
import { useState, useEffect } from "react";
import { menuItemModel } from "../../../Interfaces";
import MenuItemCard from "./MenuItemCard";
import { setMenuItem } from "../../../Storage/Redux/menuItemSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetMenuItemsQuery } from "../../../Apis/menuItemApi";
import { RootState } from "../../../Storage/Redux/store";
import { SD_SortTypes } from "../../../Utility/SD";

function MenuItemsList() {
  const dispatch = useDispatch();
  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [sortName, setSortName] = useState(SD_SortTypes.NAME_A_Z);

  const { data, isLoading } = useGetMenuItemsQuery(null);
  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];

  // const menuItems = useSelector(
  //   (state: RootState) => state.menuItemStore.menuItem
  // );

  const searchValue = useSelector(
    (state: RootState) => state.menuItemStore.search
  );

  // useEffect(() => {
  //   if (data && data.data) {
  //     const tempMenuArray = handleFilters(searchValue);
  //     setMenuItems(tempMenuArray);
  //   }
  // }, [searchValue]);
  useEffect(() => {
    if (data && data.data) {
      if (searchValue) {
        const tempMenuArray = handleFilters(
          sortName,
          selectedCategory,
          searchValue
        );
        setMenuItems(tempMenuArray);
      } else {
        setMenuItems(data.data); // Hiển thị tất cả sản phẩm nếu không có tìm kiếm
      }
    }
  }, [searchValue, data, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMenuItem(data.data));

      const tempCategoryList = ["All"];
      data.data.forEach((item: menuItemModel) => {
        if (item.category && tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });

      setCategoryList(tempCategoryList);
    }
  }, [data, isLoading]);

  const handleSortClick = (i: number) => {
    setSortName(sortOptions[i]);
    const tempArray = handleFilters(
      sortOptions[i],
      selectedCategory,
      searchValue
    );

    setMenuItems(tempArray);
  };

  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;

    if (buttons.length === 0) return;

    buttons.forEach((button, index) => {
      if (button && index === i) {
        button.classList.add("active");

        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }

        setSelectedCategory(localCategory);
        const tempArray = handleFilters(sortName, localCategory, searchValue);
        setMenuItems(tempArray);
      } else {
        button.classList.remove("active");
      }
    });
  };

  const handleFilters = (
    sortType: SD_SortTypes,
    category: string,
    search: string
  ) => {
    // let tempMenuItems = [...data.data];
    let tempArray =
      category === "All"
        ? [...data.data]
        : data.data.filter(
            (item: menuItemModel) =>
              item.category &&
              item.category.toUpperCase() === category.toUpperCase()
          );
    console.log("Filtered array:", tempArray);
    // search functionality
    if (search) {
      const tempArray2 = [...tempArray];
      tempArray = tempArray2.filter((item: menuItemModel) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }

    // Hàm loại bỏ tiền tố "Bánh"
    const removePrefix = (name: string) => {
      const prefix = "Bánh ";
      return name.startsWith(prefix) ? name.slice(prefix.length) : name;
    };

    // Hàm lấy giá thấp nhất
    const getLowestPrice = (prices: { name: string; price: number }[]) =>
      Math.min(...prices.map((p) => p.price));

    // Hàm lấy giá cao nhất
    const getHighestPrice = (prices: { name: string; price: number }[]) =>
      Math.max(...prices.map((p) => p.price));

    // Sắp xếp theo loại sortType
    switch (sortType) {
      case SD_SortTypes.PRICE_LOW_HIGH:
        tempArray.sort(
          (a: menuItemModel, b: menuItemModel) =>
            getLowestPrice(a.prices) - getLowestPrice(b.prices)
        );
        break;

      case SD_SortTypes.PRICE_HIGH_LOW:
        tempArray.sort(
          (a: menuItemModel, b: menuItemModel) =>
            getHighestPrice(b.prices) - getHighestPrice(a.prices)
        );
        break;

      case SD_SortTypes.NAME_A_Z:
        tempArray.sort((a: menuItemModel, b: menuItemModel) =>
          removePrefix(a.name)
            .toUpperCase()
            .localeCompare(removePrefix(b.name).toUpperCase())
        );
        break;

      case SD_SortTypes.NAME_Z_A:
        tempArray.sort((a: menuItemModel, b: menuItemModel) =>
          removePrefix(b.name)
            .toUpperCase()
            .localeCompare(removePrefix(a.name).toUpperCase())
        );
        break;

      default:
        break;
    }

    return tempArray;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("MenuItemsList data:", data); // Check if data is fetched correctly
  console.log("MenuItemsList menuItems:", menuItems);

  return (
    <div className="container row">
      <div className="my-3">
        <ul className="nav w-100 d-flex justify-content-center">
          {categoryList.map((categoryName, index) => (
            <li className="nav-item" key={index}>
              <button
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 && "active"
                }`}
                onClick={() => handleCategoryClick(index)}
              >
                {categoryName}
              </button>
            </li>
          ))}
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <button
              className="nav-link dropdown-toggle text-dark fs-6 border"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortName}
            </button>
            <ul className="dropdown-menu">
              {sortOptions.map((sortType, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSortClick(index)}
                  >
                    {sortType}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      {menuItems &&
        menuItems.length > 0 &&
        menuItems.map((menuItem: menuItemModel) => (
          <MenuItemCard menuItem={menuItem} key={menuItem._id}></MenuItemCard>
        ))}
    </div>
  );
}

export default MenuItemsList;
