import https from "https";
import contentful from "contentful";
import { formatDescription } from "../utils/formatDescription.js";


/**
 *
 * @param {string} userInput
 */
function getLevel(userInput) {}

/**
 * main route controller
 * */
export const main = async (req, res, error) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  let menuArguments;
  let menuLevel;
  let response;

  const provinces = ["west", "east", "North", "south", "kigali"];
  const intara = [
    "Uburengerazuba",
    "Uburasirazuba",
    "Amjyepfo",
    "Amjyaruguru",
    "kigali",
  ];

  const locations = [
    {
      province: "Uburengerazuba",
      districts: [
        { district: "Rubavu", cities: ["Rubavu", "Gisenyi"] },
        { district: "Karongi", cities: ["Kibuye"] },
           { district: "Rutsiro", cities: ["Kibuye"] },
        { district: "Rusizi", cities: ["Cyangugu"] },
      ],
    },
    {
        province: "Uburasirazuba",
      districts: [{ district: "Ngoma", cities: ["Kibungo"] }],
    },
    {
      province: "Amajyepfo",
      districts: [
        { district: "Huye", cities: ["Huye"] },
        { district: "Muhanga", cities: ["Gitarama"] },
        { district: "Nyamagabe", cities: ["Nzega"] },
        { district: "Nyaruguru", cities: ["Gikongoro"] },
      ],
    },
    {
      province: "Amajyaruguru",
      districts: [
        { district: "Musanze", cities: ["Musanze"] },
        { district: "Gicumbi", cities: ["Byumba"] },
      ],
    },
    {
      province: "Umujyi wa Kigali",
      districts: [
        // { district: "Kigali", cities: ["Kigali"] },
        { district: "Kicukiro", cities: ["Samuduha", "Nyakabanda"] },
        { district: "Nyarugenge", cities: ["Kannyogo"] },
        { district: "Gasabo", cities: ["Kigali"] },
      ],
    },
  ];
   const location = [
    {
      province: "West",
      districts: [
        { district: "Rubavu", cities: ["Rubavu", "Gisenyi"] },
        { district: "Karongi", cities: ["Kibuye"] },
        { district: "Rusizi", cities: ["Cyangugu"] },
      ],
    },
    {
        province: "East",
      districts: [{ district: "Ngoma", cities: ["Kibungo"] }],
    },
    {
 province: "South",
      districts: [
        { district: "Huye", cities: ["Huye"] },
        { district: "Muhanga", cities: ["Gitarama"] },
        { district: "Nyamagabe", cities: ["Nzega"] },
        { district: "Nyaruguru", cities: ["Gikongoro"] },
      ],
    },
    {
     province: "North",
      districts: [
        { district: "Musanze", cities: ["Musanze"] },
        { district: "Gicumbi", cities: ["Byumba"] },
      ],
    },
    {
      province: "Kigali City",
      districts: [
        // { district: "Kigali", cities: ["Kigali"] },
        { district: "Kicukiro", cities: ["Samuduha", "Nyakabanda"] },
        { district: "Nyarugenge", cities: ["Kannyogo"] },
        { district: "Gasabo", cities: ["Kigali"] },
      ],
    },
  ];


  if (text) {
    menuArguments = text.split("*");
    menuLevel = menuArguments.length;
  } else {
    menuArguments = [];
    menuLevel = 0;
  }

  if (parseInt(menuArguments[menuLevel - 1]) === 100) {
    menuArguments.splice(menuLevel - 2, 2);
    menuLevel = menuLevel - 2;
  }

  switch (menuLevel) {
    case 0:
      response = `CON Murakaza neza! Hitamo ururimi \n
                  1. Kinyarwanda \n
                  2. English \n
      `;
      break;
  
    case 1: {
      if (parseInt(menuArguments[0], 10) === 1) {
        response = "CON Hitamo intara";
        for (let i = 0; i < 5; i++) {
          response = response + `\n${i + 1}. ${locations[i].province}`;
        }
        break;
      } else {
        response = "CON Choose province";
        for (let i = 0; i < 5; i++) {
          response = response + `\n${i + 1}. ${location[i].province}`;
        }
        break;
      }
    }

    case 2: {
      if (parseInt(menuArguments[0], 10) === 1) {
        const chosenProvince = menuArguments[1];
        const districts = locations[chosenProvince - 1].districts || [];
     
        if (districts.length === 0) {
          response = "END Ibyo mwahisemo ntibikunze";
          break;
        }

        response = "CON Hitamo akarere";
        for (let i = 0; i < districts.length; i++) {
          response = response + `\n${i + 1}. ${districts[i].district}`;
        }
        break;
      } 
      else 
      {
        const chosenProvince = menuArguments[1];
        const chosenDistrict = menuArguments[2];
const districts = location[chosenProvince - 1].districts || [];
        
        response = "CON Choose the district";
         for (let i = 0; i < districts.length; i++) {
          response = response + `\n${i + 1}. ${districts[i].district}`;
        }
                break;
          }
    }
    case 3: {
      if (parseInt(menuArguments[0], 10) === 1) {
        if (parseInt(menuArguments[1], 10) === 1) {
          const chosenProvince = menuArguments[1];
          const chosenDistrict = menuArguments[2];

          const district = locations[chosenProvince - 1].districts
            ? locations[chosenProvince - 1].districts[chosenDistrict - 1]
            : undefined;

          if (!district) {
            response = "END Ibyo mwahisemo nibikunze";
            break;
          }

          if (!district) {
            response = "CON Ongera ushyirimo izina ry'akarere";
            break;
          }
          const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?q=${district.cities[0]},rw&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`;

          const weatherInfo = await new Promise((resolve, reject) => {
            https
              .get(WEATHER_API, (response) => {
                let data = "";
                response.on("data", (chunk) => (data += chunk));
                response.on("end", () => resolve(JSON.parse(data)));
              })
              .on("error", (err) => {
                return reject(err);
              });
          });

          response = `END Iteganyagihe mu karere ka ${district.district} \n
                      ${formatDescription(
                        weatherInfo.weather[0].description
                      )} \n
                      Igipimo cyubushuye cyohasi ni ${
                        weatherInfo.main.temp_min
                      }°C \n
                      Igipimo cyubushuye cyohejuru ni ${
                        weatherInfo.main.temp_max
                      }°C \n
                      Izuba rirarenga ${new Date(
                        weatherInfo.sys.sunset
                      ).getHours()}:${new Date(
            weatherInfo.sys.sunset
            ).getMinutes()} 
              `;
          break;
        }
      } else {
        const chosenProvince = menuArguments[1];
        const chosenDistrict = menuArguments[2];

        const districtData = location[chosenProvince - 1].districts
          ? locations[chosenProvince - 1].districts[chosenDistrict - 1]
          : undefined;

        if (!districtData) {
          response = "CON Enter the district's name please!";
          break;
        }

        if (parseInt(menuArguments[1], 10) === 1) {
          if (!districtData) {
            response = "CON Enter the district's name please!";
            break;
          }
          const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?q=${districtData.cities[0]},rw&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`;

          const weatherInfo = await new Promise((resolve, reject) => {
            https
              .get(WEATHER_API, (response) => {
                let data = "";
                response.on("data", (chunk) => (data += chunk));
                response.on("end", () => resolve(JSON.parse(data)));
              })
              .on("error", (err) => {
                return reject(err);
              });
          });

          response = `END Weather forecast in ${districtData.district} \n
                        The weather will mostly be ${
                          weatherInfo.weather[0].description
                        } \n
                        The lowest temperature will be ${
                          weatherInfo.main.temp_min
                        }°C \n
                        The highest temperature will be ${
                          weatherInfo.main.temp_max
                        }°C \n
                        The Sun will set at ${new Date(
                          weatherInfo.sys.sunset
                        ).getHours()}:${new Date(
            weatherInfo.sys.sunset
          ).getMinutes()} 
                `;
          break;
        } 
      }
    }
    default:
      response = "END Wrong choice!";
      break;
  }
  return res.status(200).send(response);
};
