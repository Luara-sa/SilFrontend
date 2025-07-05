import React, { forwardRef, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Rating,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

import { useMe } from "hooks/useMe";
import { useQuery } from "hooks/useQuery";

import { filterStore } from "store/filterStore";
import { coursesStore } from "store/coursesStore";
import { eventEmitter } from "services/eventEmitter";

import { Category, InfoSystem } from "interface/common";

import { CheckBoxStyled } from "./CheckBoxStyled";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface Props {
  categories?: Category[];
  info_system: InfoSystem;
}

export const CourseFilterContent = forwardRef(
  (props: Props, paramsRef: any) => {
    const { info_system } = useMe();
    const [setQuery, getQuery] = useQuery();
    const [isCategoryOpen, setIsCategoryOpen] = useState<any>([]);
    const [selectValue] = coursesStore((state) => [state.selectValue]);

    const [checkedCategory, setCheckedCategory] = useState<number[]>(
      paramsRef.current.cat_ids ? paramsRef.current.cat_ids : []
    );

    const handleCategoryClick = (catId: number) => {
      const temp = new Set(isCategoryOpen);
      if (temp.has(catId)) {
        temp.delete(catId);
      } else {
        temp.add(catId);
      }
      setIsCategoryOpen([...temp]);
    };

    const toggleDrawer = filterStore((state) => state.toggleDrawer);

    const [rangeValue, setRangeValue] = useState<{
      price: number[];
      hours: number[];
      quantity: number[];
    }>({
      price:
        paramsRef.current.price.length > 0
          ? paramsRef.current.price
          : [50, 5000],
      hours:
        paramsRef.current.hours.length > 0
          ? paramsRef.current.hours
          : [50, 600],
      quantity:
        paramsRef.current.quantity?.length > 0
          ? paramsRef.current.quantity
          : [2, 8],
    });

    // const handleSlidersChange = (event: any, newValue: number | number[]) => {
    //   const { name } = event.target;
    //   paramsRef.current[name] = newValue;
    //   setSlidersValue((slidersValue) => ({
    //     ...slidersValue,
    //     [name]: newValue,
    //   }));
    // };

    const handleSliderInputsChange = (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      const { value } = event.target;
      const index = +event.target.name.split("-")[1];
      const name = event.target.name.split("-")[0] as
        | "price"
        | "hours"
        | "quantity";
      setRangeValue((rangeValue) => ({
        ...rangeValue,
        [name]:
          index === 0
            ? [+value, rangeValue[name][1]]
            : [rangeValue[name][0], +value],
      }));

      paramsRef.current[name] =
        index === 0
          ? [+value, rangeValue[name][1]]
          : [rangeValue[name][0], +value];
    };

    const handleBasicCheckChange = (event: any, checked: boolean) => {
      const { name, value } = event.target;
      if (name !== "level" && name !== "section" && name !== "subscription")
        checked
          ? (paramsRef.current[name] = [...paramsRef.current[name], value])
          : (paramsRef.current[name] = paramsRef.current[name].filter(
              (keyVal: any) => keyVal !== value
            ));
      else paramsRef.current[name] = value;
    };

    const handleCategoriesCheck = (event: any, checked: boolean) => {
      // The name is the parent Id
      const { name, value, id } = event.target;

      if (checked) {
        paramsRef.current.cat_ids = [...paramsRef.current.cat_ids, +value];
      } else {
        paramsRef.current.cat_ids = paramsRef.current.cat_ids
          .filter((id: any) => +id !== +value)
          .filter((id: any) => +id !== +name);
      }
      setCheckedCategory([...paramsRef.current.cat_ids]);
    };

    const handleCategoryParentChecked = (event: any, checked: boolean) => {
      const { name, value } = event.target;
      if (checked) {
        props.categories?.map((categ) => {
          if (+categ.id === +value) {
            paramsRef.current[name] = [
              ...paramsRef.current[name],
              ...categ.child
                .map((child) => {
                  let isExist = false;
                  paramsRef.current[name].filter(() => {
                    if (paramsRef.current[name].includes(+child.id)) {
                      isExist = true;
                    }
                  });
                  return isExist ? false : +child.id;
                })
                .filter((item) => item !== false),
            ];
          }
          return categ;
        });
        paramsRef.current[name] = [...paramsRef.current[name], +value];
      } else {
        props.categories?.map((categ) => {
          if (+categ.id === +value) {
            paramsRef.current[name] = [
              ...paramsRef.current[name].filter((cat_id: any) => {
                return !categ.child.find((child) => +child.id === +cat_id);
              }),
            ];
          }
          return categ;
        });
        paramsRef.current[name] = paramsRef.current[name].filter(
          (keyVal: any) => +keyVal !== +value
        );
      }

      setCheckedCategory([...paramsRef.current[name]]);
    };

    const onSubmit = (event: any) => {
      toggleDrawer();
      setQuery(paramsRef.current);
      eventEmitter.emit("submit-fliter", { selectValueParam: selectValue });
    };

    const onReset = (event: any) => {
      paramsRef.current = {
        page: 0,
        limit: 20,
        cat_ids: [],
        section: "",
        subscription: "",
        price: [],
        rate: "",
        hours: [],
        level: "",
        tags: "",
      };
      eventEmitter.emit("submit-fliter", { selectValueParam: selectValue });
      toggleDrawer();
      setQuery({});
    };

    return (
      <Box sx={{ overflowY: "scroll", scrollbarWidth: "none" }}>
        <Box sx={{ px: "25px", flexDirection: "column", rowGap: "31px" }}>
          <Box>
            <Typography
              sx={{
                color: "primary.main",
                fontSize: ["14px"],
                fontWeight: 500,
              }}
            >
              Category
            </Typography>
            <Box sx={{ ml: "18px" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {props.categories &&
                  props.categories?.map((category, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          columnGap: "10px",
                        }}
                      >
                        <CheckBoxStyled
                          label={category.name.en}
                          name="cat_ids"
                          value={category.id}
                          onChange={handleCategoryParentChecked}
                          checked={Boolean(
                            checkedCategory.filter(
                              (cat) => +cat === +category.id
                            ).length > 0
                          )}
                          control={<Checkbox size="small" />}
                        />
                        <Box onClick={() => handleCategoryClick(category.id)}>
                          {isCategoryOpen.includes(category.id) ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </Box>
                      </Box>

                      <Collapse
                        in={isCategoryOpen.includes(category.id)}
                        // in={false}
                        timeout="auto"
                        unmountOnExit
                      >
                        {category.child.length > 0 &&
                          category.child.map((child, index) => (
                            <Box sx={{ ml: "20px" }} key={index}>
                              <CheckBoxStyled
                                label={child.name.en}
                                name={`${child.parent_id}`}
                                id={`${child.parent_id}`}
                                value={child.id}
                                onChange={handleCategoriesCheck}
                                checked={
                                  !!checkedCategory.find(
                                    (id) => +id === child.id
                                  )
                                }
                                control={
                                  <Checkbox
                                    size="small"
                                    // checked={checked[0] && checked[1]}
                                    // indeterminate={checked[0] !== checked[1]}
                                    // onChange={handleChange1}
                                  />
                                }
                              />
                            </Box>
                          ))}
                      </Collapse>
                    </Box>
                  ))}
              </Box>
            </Box>
          </Box>
          {selectValue === "courses" && (
            <Box>
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: ["14px"],
                  fontWeight: 500,
                }}
              >
                hours
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "baseline", gap: "10px" }}
              >
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: ["14px"],
                    fontWeight: 500,
                    mb: "20px",
                  }}
                >
                  between :
                </Typography>
                <TextField
                  type="number"
                  name="hours-0"
                  value={rangeValue.hours[0]}
                  onChange={handleSliderInputsChange}
                  sx={numberInputStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">h</InputAdornment>
                    ),
                  }}
                />
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: ["14px"],
                    fontWeight: 500,
                    mb: "20px",
                  }}
                >
                  -
                </Typography>
                <TextField
                  type="number"
                  sx={numberInputStyles}
                  name="hours-1"
                  onChange={handleSliderInputsChange}
                  value={rangeValue.hours[1]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">h</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          )}

          {selectValue === "paths" && (
            <Box sx={{ mt: "20px" }}>
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: ["14px"],
                  fontWeight: 500,
                  mb: "20px",
                }}
              >
                Courses Quantity
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "baseline", gap: "10px" }}
              >
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: ["14px"],
                    fontWeight: 500,
                    mb: "20px",
                  }}
                >
                  between :
                </Typography>
                <TextField
                  type="number"
                  name="quantity-0"
                  value={rangeValue.quantity[0]}
                  onChange={handleSliderInputsChange}
                  sx={numberInputStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">h</InputAdornment>
                    ),
                  }}
                />
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: ["14px"],
                    fontWeight: 500,
                    mb: "20px",
                  }}
                >
                  -
                </Typography>
                <TextField
                  type="number"
                  sx={numberInputStyles}
                  name="quantity-1"
                  onChange={handleSliderInputsChange}
                  value={rangeValue.quantity[1]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">h</InputAdornment>
                    ),
                  }}
                />
              </Box>
              {/* <Slider
                getAriaLabel={() => "Temperature range"}
                name="hours"
                value={slidersValue.hours}
                onChange={handleSlidersChange}
                valueLabelDisplay="on"
                // getAriaValueText={valuetext}
                sx={sliderStyle}
                max={600}
                min={50}
                marks={[
                  { value: 50, label: 50 },
                  { value: 600, label: 600 },
                ]}
              /> */}
            </Box>
          )}
          {selectValue === "courses" && (
            <>
              <Box>
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: ["14px"],
                    fontWeight: 500,
                  }}
                >
                  Section
                </Typography>
                <Box sx={{ ml: "18px" }}>
                  <RadioGroup
                    aria-labelledby="sectionOptions-radio-buttons-group"
                    defaultValue={paramsRef.current.section}
                    name="section"
                  >
                    {sectionOptions.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        control={<Radio />}
                        label={option.label}
                        value={option.value}
                        name="section"
                        onChange={handleBasicCheckChange}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: ["14px"],
                    fontWeight: 500,
                  }}
                >
                  Subscription
                </Typography>
                <Box sx={{ ml: "18px" }}>
                  <RadioGroup
                    aria-labelledby="sectionOptions-radio-buttons-group"
                    defaultValue={paramsRef.current.subscription}
                    name="subscription"
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    {subscriptionOptions.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        control={<Radio />}
                        label={option.label}
                        value={option.value}
                        name="subscription"
                        onChange={handleBasicCheckChange}
                      />
                    ))}
                  </RadioGroup>
                  {/* {subscriptionOptions.map((option, index) => (
                    <CheckBoxStyled
                      key={index}
                      control={
                        <Checkbox
                          size="small"
                          defaultChecked={
                            paramsRef.current.subscription.length > 0 &&
                            paramsRef.current.subscription.filter(
                              (sect: any) => option.value === sect
                            ).length > 0
                          }
                        />
                      }
                      label={option.label}
                      name={option.name}
                      value={option.value}
                      onChange={handleBasicCheckChange}
                    />
                  ))} */}
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Box sx={{ position: "relative" }}>
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontSize: ["14px"],
                      fontWeight: 500,
                      mb: "20px",
                    }}
                  >
                    Price
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "baseline", gap: "10px" }}
                >
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontSize: ["14px"],
                      fontWeight: 500,
                      mb: "20px",
                    }}
                  >
                    From :
                  </Typography>
                  <TextField
                    type="number"
                    name="price-0"
                    value={rangeValue.price[0]}
                    onChange={handleSliderInputsChange}
                    sx={numberInputStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">SAR</InputAdornment>
                      ),
                    }}
                  />
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontSize: ["14px"],
                      fontWeight: 500,
                      mb: "20px",
                    }}
                  >
                    To :
                  </Typography>
                  <TextField
                    type="number"
                    sx={numberInputStyles}
                    name="price-1"
                    onChange={handleSliderInputsChange}
                    value={rangeValue.price[1]}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">SAR</InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
        {selectValue === "courses" && (
          <Box sx={{ px: "25px", flexDirection: "column", rowGap: "31px" }}>
            {info_system && (
              <Box>
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: ["14px"],
                    fontWeight: 500,
                  }}
                >
                  English Level
                </Typography>
                <Box sx={{ ml: "18px" }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <RadioGroup
                      aria-labelledby="english_level_enum-radio-buttons-group"
                      defaultValue={paramsRef.current.level}
                      name="english_level_enum"
                    >
                      {info_system &&
                        info_system.english_level_enum.map((level, index) => (
                          <FormControlLabel
                            key={index}
                            control={<Radio />}
                            label={level}
                            value={level}
                            name="level"
                            onChange={handleBasicCheckChange}
                          />
                        ))}
                    </RadioGroup>
                  </Box>
                </Box>
              </Box>
            )}
            <Box>
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: ["14px"],
                  fontWeight: 500,
                }}
              >
                Rating
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: "20px",
                }}
              >
                <Rating
                  size="large"
                  defaultValue={+paramsRef.current.rate}
                  onChange={(e, value) => {
                    paramsRef.current.rate = value;
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: " 0px -2px 4px rgba(0, 0, 0, 0.25)",
            border: "2px solid",
            borderColor: "gray.light",
            // py: "30px",
            height: "100px",
            width: "300px",
            position: "fixed",
            bottom: "0",
            backgroundColor: "gray.active",
          }}
        >
          <Box sx={{ display: "flex", columnGap: "10px" }}>
            <Button
              onClick={onReset}
              startIcon={<img src="/assets/icons/shared/reset.svg" />}
              variant="contained"
              color="warning"
              sx={{
                py: "8px",
                px: "20px",
                color: "gray.active",
                fontWeight: "400",
              }}
            >
              Reset
            </Button>
            <Button
              onClick={onSubmit}
              startIcon={<img src="/assets/icons/shared/thunder.svg" />}
              variant="contained"
              color="secondary"
              sx={{
                py: "8px",
                px: "14px",
                color: "gray.active",
                fontWeight: "400",
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
);

// The error is often caused when using forwardRefs in React.
// The displayName property is used to give a descriptive name to components
// for the React devtools extension.
// Set the displayName property on the component to fix the
// "Component definition is missing display name" error.
CourseFilterContent.displayName = "CourseFilterContent";

const sectionOptions = [
  {
    name: "section",
    value: "men",
    label: "Men",
  },
  {
    name: "section",
    value: "women",
    label: "Women",
  },
  {
    name: "section",
    value: "both",
    label: "Both",
  },
];

const subscriptionOptions = [
  {
    name: "subscription",
    value: "all",
    label: "All",
  },
  {
    name: "subscription",
    value: "free",
    label: "Free",
  },
];
const hoursOptions = [
  {
    name: "hours",
    value: [1, 3],
    label: "1-3",
  },
  {
    name: "hours",
    value: [4, 6],
    label: "4-6",
  },
  {
    name: "hours",
    value: [6, 10],
    label: "6-10",
  },
  {
    name: "hours",
    value: [10, 20],
    label: "10-20",
  },
];

const numberInputStyles = {
  backgroundColor: "#FFFEFA",
  width: "70px",
  height: "36px",
  borderRadius: "4px",
  "& .MuiInputBase-input": {
    padding: "0",
    height: "36px",
  },
  "& .MuiInputBase-root": {
    paddingInline: "5px",
  },
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
};
