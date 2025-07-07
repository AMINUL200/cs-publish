import React, { useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

const MaltyDropdown = () => {
  const [openHealthMenu, setOpenHealthMenu] = useState(false);
  const [openScienceMenu, setOpenScienceMenu] = useState(false);
  const [openAMSMenu, setOpenAMSMenu] = useState(false)
  const [openScience1, setOpenScience1] = useState(false)
  const [openIITK, setOpenIITK] = useState(false)
  const [openASSAM, setOpenASSAM] = useState(false)
  const [openMedicine, setOpenMedicine] = useState(false)
  const [openINDIA, setOpenINDIA] = useState(false)
  const [openBIOTECHNOLOGY, setOenBIOTECHNOLOGY] = useState(false)

  const menuData = {
    categories: [
      {
        name: "Science",
        id: "science",
        subcategories: [
          {
            name: "Applied Mathematics And Statistics",
            id: "ams",
            journals: [
              "Journal of Organic Chemistry",
              "Journal of Nature Management"
            ]
          },
          {
            name: "Science-1",
            id: "science1",
            journals: ["No Journal"]
          },
          {
            name: "IITK",
            id: "iitk",
            journals: ["Index of Food Science"]
          },
          {
            name: "ASSAM",
            id: "assam",
            journals: ["No Journals"]
          }
        ]
      },
      {
        name: "Health",
        id: "health",
        subcategories: [
          {
            name: "Medicine",
            id: "medicine",
            journals: ["Earth and Planetary Science Journal"]
          },
          {
            name: "INDIA",
            id: "india",
            journals: ["No Journals"]
          },
          {
            name: "BIOTECHNOLOGY",
            id: "biotechnology",
            journals: ["No Journals"]
          }
        ]
      }
    ],
    uncategorized: ["No Category"]
  };
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const renderSubcategories = (subcategories, parentId) => {
    return subcategories.map((subcategory) => (
      <Menu
        key={`${parentId}-${subcategory.id}`}
        placement="left-start"
        open={openMenus[`${parentId}-${subcategory.id}`] || false}
        handler={() => toggleMenu(`${parentId}-${subcategory.id}`)}
        allowHover
        offset={15}
      >
        <MenuHandler className="flex items-center justify-between">
          <MenuItem>
            <div className="flex items-center justify-between w-full group">
              <span className="group-hover:text-[#f29400] py-2">
                {subcategory.name}
              </span>
              <ChevronUpIcon
                strokeWidth={2.5}
                className={`h-3.5 w-3.5 transition-transform ${openMenus[`${parentId}-${subcategory.id}`] ? "rotate-90" : ""
                  }`}
              />
            </div>
          </MenuItem>
        </MenuHandler>
        <MenuList>
          {subcategory.journals ? (
            subcategory.journals.map((journal, jIndex) => (
              <MenuItem key={`${subcategory.id}-journal-${jIndex}`}>
                <span className="hover:text-[#f29400] py-2">{journal}</span>
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <span className="hover:text-[#f29400] py-2">No Journals</span>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    ));
  };


  return (
    <Menu>
      <MenuHandler>
        <Button>Journals</Button>
      </MenuHandler>
      <MenuList>
        <Menu
          placement="left-start"
          open={openScienceMenu}
          handler={setOpenScienceMenu}
          allowHover
          offset={15}
        >
          <MenuHandler className="flex items-center justify-between">
            <MenuItem >
              <div className="flex items-center justify-between w-full group">
                <span className="group-hover:text-[#f29400] py-2">Science</span>
                <ChevronUpIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 transition-transform ${openScienceMenu ? "rotate-90" : ""}`}
                />
              </div>
            </MenuItem>
          </MenuHandler>
          <MenuList>
            <Menu
              placement="left-start"
              open={openAMSMenu}
              handler={setOpenAMSMenu}
              allowHover
              offset={15}
            >
              <MenuHandler className="flex items-center justify-between">
                <MenuItem >
                  <div className="flex items-center justify-between w-full group">
                    <span className="group-hover:text-[#f29400] py-2"> Applied Mathematics And Statistics</span>
                    <ChevronUpIcon
                      strokeWidth={2.5}
                      className={`h-3.5 w-3.5 transition-transform ${openAMSMenu ? "rotate-90" : ""}`}
                    />
                  </div>
                </MenuItem>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <span className="hover:text-[#f29400] py-2">  Journal of Organic Chemistry</span>
                </MenuItem>
                <MenuItem>
                  <span className="hover:text-[#f29400] py-2">  Jounal of Nature Management</span>
                </MenuItem>

              </MenuList>
            </Menu>
            <Menu
              placement="left-start"
              open={openScience1}
              handler={setOpenScience1}
              allowHover
              offset={15}
            >
              <MenuHandler className="flex items-center justify-between">
                <MenuItem >

                  <div className="flex items-center justify-between w-full group">
                    <span className="group-hover:text-[#f29400] py-2"> Science-1</span>
                    <ChevronUpIcon
                      strokeWidth={2.5}
                      className={`h-3.5 w-3.5 transition-transform ${openScience1 ? "rotate-90" : ""}`}
                    />
                  </div>
                </MenuItem>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <span className="hover:text-[#f29400] py-2"> No Journal</span>
                </MenuItem>


              </MenuList>
            </Menu>
            <Menu
              placement="left-start"
              open={openIITK}
              handler={setOpenIITK}
              allowHover
              offset={15}
            >
              <MenuHandler className="flex items-center justify-between">
                <MenuItem className="">

                  <div className="flex items-center justify-between w-full group">
                    <span className="group-hover:text-[#f29400] py-2"> IITK</span>
                    <ChevronUpIcon
                      strokeWidth={2.5}
                      className={`h-3.5 w-3.5 transition-transform ${openIITK ? "rotate-90" : ""}`}
                    />
                  </div>
                </MenuItem>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <span className="hover:text-[#f29400] py-2"> Index of Food Science</span>
                </MenuItem>


              </MenuList>
            </Menu>
            <Menu
              placement="left-start"
              open={openASSAM}
              handler={setOpenASSAM}
              allowHover
              offset={15}
            >
              <MenuHandler className="flex items-center justify-between">
                <MenuItem className="">

                  <div className="flex items-center justify-between w-full group">
                    <span className="group-hover:text-[#f29400] py-2"> ASSAM</span>
                    <ChevronUpIcon
                      strokeWidth={2.5}
                      className={`h-3.5 w-3.5 transition-transform ${openASSAM ? "rotate-90" : ""}`}
                    />
                  </div>
                </MenuItem>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <span className="hover:text-[#f29400] py-2"> No Journals </span>
                </MenuItem>
              </MenuList>
            </Menu>
          </MenuList>
        </Menu>
        <Menu
          placement="left-start"
          open={openHealthMenu}
          handler={setOpenHealthMenu}
          allowHover
          offset={15}
        >
          <MenuHandler className="flex items-center justify-between">
            <MenuItem>

              <div className="flex items-center justify-between w-full group">
                <span className="group-hover:text-[#f29400] py-2"> Health</span>
                <ChevronUpIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 transition-transform ${openHealthMenu ? "rotate-90" : ""}`}
                />
              </div>
            </MenuItem>
          </MenuHandler>
          <MenuList>
            <Menu
              placement="left-start"
              open={openMedicine}
              handler={setOpenMedicine}
              allowHover
              offset={15}
            >
              <MenuHandler className="flex items-center justify-between">
                <MenuItem className="">
                  <div className="flex items-center justify-between w-full group">
                    <span className="group-hover:text-[#f29400] py-2"> Medicine</span>
                    <ChevronUpIcon
                      strokeWidth={2.5}
                      className={`h-3.5 w-3.5 transition-transform ${openMedicine ? "rotate-90" : ""}`}
                    />
                  </div>
                </MenuItem>
              </MenuHandler>
              <MenuList>
                <MenuItem>

                  <span className="hover:text-[#f29400] py-2"> Earth and Planetary Science Journal  </span>
                </MenuItem>

              </MenuList>
            </Menu>
            <Menu
              placement="left-start"
              open={openINDIA}
              handler={setOpenINDIA}
              allowHover
              offset={15}
            >
              <MenuHandler className="flex items-center justify-between">
                <MenuItem className="">
                  <div className="flex items-center justify-between w-full group">
                    <span className="group-hover:text-[#f29400] py-2"> INDIA</span>
                    <ChevronUpIcon
                      strokeWidth={2.5}
                      className={`h-3.5 w-3.5 transition-transform ${openINDIA ? "rotate-90" : ""}`}
                    />
                  </div>
                </MenuItem>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <span className="hover:text-[#f29400] py-2">No Journals </span>
                </MenuItem>

              </MenuList>
            </Menu>
            <Menu
              placement="left-start"
              open={openBIOTECHNOLOGY}
              handler={setOenBIOTECHNOLOGY}
              allowHover
              offset={15}
            >
              <MenuHandler className="flex items-center justify-between">
                <MenuItem className="">

                  <div className="flex items-center justify-between w-full group">
                    <span className="group-hover:text-[#f29400] py-2"> BIOTECHNOLOGY</span>
                    <ChevronUpIcon
                      strokeWidth={2.5}
                      className={`h-3.5 w-3.5 transition-transform ${openBIOTECHNOLOGY ? "rotate-90" : ""}`}
                    />
                  </div>
                </MenuItem>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <span className="hover:text-[#f29400] py-2">No Journals </span>
                </MenuItem>

              </MenuList>
            </Menu>
          </MenuList>
        </Menu>
        <MenuItem>
          <span className="hover:text-[#f29400] py-2">No Category </span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default MaltyDropdown;