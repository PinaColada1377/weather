const getRequestURL = 'https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json';
const nameCities = document.getElementById('cities');
const temperature = document.getElementById('temperature');
const keyAPI = "0e80fe637c11237b97cb1ba03385a2cc";


// запрос городов Беларуси с координатами
fetch (getRequestURL)
    .then(response => response.json())
    .then(data => cities(data))
    .catch(error => console.log(error));



const cities = (data) =>{
    // отрисовка городов
    const allCities = data.flatMap(el => el.regions).flatMap(el => el.cities).map(el => el.name);
    
    for (city of allCities){
        let cityDiv = document.createElement('div');
        cityDiv.innerHTML = city;
        nameCities.appendChild(cityDiv);
    }
    // по какому городу был совершён клик
    document.querySelectorAll("#cities > div").forEach(el => el.addEventListener("click", () => {
        const clickCity = el.textContent;               

        //поиск объекта  по которому кликнул пользователь, что бы извлечь широту и долготу
        const searchObjCity = (data, value) => {
            let objCity = data[0].regions, result;
            objCity.map(x => {
                const array = Object.values(x.cities);
                for (let i = 0; i < array.length; i++) {
                    if (array[i].name == value) {
                        result = array[i];
                        break;
                    }
                }
            });   
            //запрос за погодой         
            fetch (`http://api.openweathermap.org/data/2.5/weather?lat=${result['lat']}&lon=${result['lng']}&appid=${keyAPI}`)
                .then(response => response.json())
                .then(data =>  {
                    temperature.innerHTML = Math.round((data.main.temp - 273)) + '&deg;'
                })
                .catch(error => console.log(error));
        }

        searchObjCity(data, clickCity);
      }));

}

// поиск по городам
document.querySelector('#search').oninput = function () {
    const val = this.value.trim();
    const searchItems = document.querySelectorAll('#cities > div');
    if( val != ''){
        searchItems.forEach(function(elem){
            if(elem.innerText.search(val) == -1){
                elem.classList.add('hide');
            }
            else {
                elem.classList.remove('hide');
            }
        })
    }
    else {
        searchItems.forEach(function (elem){
            elem.classList.remove('hide')
        })
    }

}