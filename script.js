const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const notFoundContainer = document.querySelector(".not-found-container");

//initially variables need

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");

// ek kaam or pending hai  ---> iska ye tha k initially jab aapka 
//app open hoga or if uske paas coordinates huee
// to us condition me ham getfromSessionStorage() ko call krenge
getfromSessionStorage();

function switchTab(newTab){

    if(newTab !== oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //mein pehle search wale tab pr tha,ab your weather wale tab ko visible krunga
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mein your weather wale tab me hu toh weather bhi display krna padega ,so let's check 
            //loacl storage first for coordinates , if we have saved them there
            getfromSessionStorage();
        }
    }

}

//jab user tab p click krenge to user tab open hoyega
userTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

//jab search tab p click krenge to search tab open hoyega
searchTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agr local coordinates stored nhi hai
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


//user ki location ki details fetch krega
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    //make grant Access container invisible
    grantAccessContainer.classList.remove("active");

    //make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        // ab jab data fetch ho chuka hai to loader ko hata denge
        loadingScreen.classList.remove("active");

        if(data?.name === undefined){
            throw new Error('Error aaigi haiii kai kri rya ho yu');
        }

        //or ab data ko userInfoContainer me show karwana hai to userInfoContainer ko bhi visible krana padega
        userInfoContainer.classList.add("active");

        // ab ek function likhenge jo data me se weather information nikal kar UI me put karega
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        //HOMEWORK
        userInfoContainer.classList.remove("active");
        //console.log(err);
        notFoundContainer.classList.add("active");

    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put it in UI elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    //weatherInfo.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;   ---> ye link me problem hai
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// user ki location nikalega
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HOMEWORK - show an alert for no geolocation support available
        alert('no geolocation support available');
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

//grant access button hai
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

//search form ka kaam
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

// search ki gyi city ki location ki details fetch krega

async function fetchSearchWeatherInfo(city){
    //loader ko visible kro
    loadingScreen.classList.add("active");

    //user details container or grant access container ko invisible kro
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        //loader invisible kro
        loadingScreen.classList.remove("active");

        if(data?.name === undefined){
            throw new Error('Error aaigi haiii kai kri rya ho yu');
        }

        //userInfocontainer ko visible kro
        userInfoContainer.classList.add("active");

        // data ko UI pr put kro
        renderWeatherInfo(data);

        // if((data?.name) !== undefined){
            
        //     //userInfocontainer ko visible kro
        //     userInfoContainer.classList.add("active");

        //     // data ko UI pr put kro
        //     renderWeatherInfo(data);
        // }
        // else{
        //     throw new Error("value not found")
        // }


    }
    catch(err){
        // HOMEWORK
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        //console.log(err);
        notFoundContainer.classList.add("active");
    }

}







