const city = document.querySelector('#city'),
form = document.querySelector('form'),
container = document.querySelector('.container'),
display = document.querySelector('.display'),
temp = document.querySelector('#temp'),
humidity = document.querySelector('#humidity'),
submit= document.querySelector('#submit'),
country = document.querySelector('#country'),
timezone = document.querySelector('#timezone'),
currentWeather = document.querySelector('#currentWeather')

submit.addEventListener('click',()=>{
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=356175ed70e843412fd02901b636a817`).then(res=>(res.json())).then(data=>allData(data))

    const allData = (data)=>{
        const tempOutput = Math.floor(data.main.temp-273.15)
        temp.innerHTML =`${tempOutput}°C`
        humidity.innerHTML =`${ data.main.humidity}%`
        timezone.innerHTML = `${data.timezone}`
        currentWeather.innerHTML = `${data.weather[0].main}`
        country.innerHTML = `${data.sys.country}`
        if(country.innerHTML === 'NG'){
            return country.innerHTML= 'Nigeria'
        } else if (country.innerHTML==='GB'){
            return country.innerHTML='England'
        }else{country.innerHTML}
   
        
        console.log(data)
    }
    
        container.style.display = 'block'
        

})



form.addEventListener('submit',(e)=>{
    e.preventDefault()
})

city.addEventListener('input', ()=>{
    display.innerHTML = city.value
})