const APIkey = 'd2ae966b0bae2a9f7dbc2a38133cb0f8'
const base_url = "https://image.tmdb.org/t/p/original/";


const request = {
    Trending: {
                url:`/trending/all/day?api_key=${APIkey}`,
                name: 'Trending Today',
                tabs: 'tabs',
                tab1: 'Today',
                tab2: 'This Week'
            },
    fetchpopularmovies : {
                url:`/movie/popular?api_key=${APIkey}&page=1`,
                name: `What's Popular`,
                tabs: 'tabs',
                tab1: 'Movies',
                tab2: 'On TV'
            },
   fetchtopratedmovies: {
                url:`/movie/top_rated?api_key=${APIkey}&page=1`,
                name: 'Rated Movies'
            },
    fetchratedshows: {
                url:`/tv/top_rated?api_key=${APIkey}&page=1`,
                name: 'Rated Shows'
            },
    fetchpopularshow: {
                url:`/tv/popular?api_key=${APIkey}&page=1`,
                name: 'Popular Shows'
            },
    
    
    
}

const re = {
  fetchpopularmovies: ``,
  fetchtopratedmovies: `/movie/top_rated?api_key=${APIkey}&page=1`,
  fetchratedshows: `/tv/top_rated?api_key=${APIkey}&page=1`,
  fetchpopularshows: `/tv/popular?api_key=${APIkey}&page=1`,
  fetchtvshowtrailer: `/tv/{tv_id}/similar?api_key=${APIkey}&page=1`,
  fetchupcoming: `/movie/upcoming?api_key=${APIkey}&language=en-US&page=1`,
  fetchpopularhindi: `/movie/popular?api_key=${APIkey}&page=1&with_original_language=hi`,
  fetchpopulartvhindi: `/tv/popular?api_key=${APIkey}&page=1&with_original_language=hi`,
  fetchratedhindishows: `/tv/top_rated?api_key=${APIkey}&page=1&with_original_language=hi`,
  
}



let sliders = {}


let i = 0;

function sliderInit(){
    objectLenght = Object.keys(request).length;
    if(i==objectLenght) {
            $.each(sliders, function() {
            $(this.sliderid).slick({
                        dots: true,
                        infinite: true,
                        speed: 300,
                        slidesToShow: 7,
                        slidesToScroll: 5,
                        arrows: false,
                        responsive: [
                            {
                            breakpoint: 1250,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 3,
                                infinite: true,
                                dots: true
                            }
                            },
                            {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 3,
                                infinite: true,
                                dots: true
                            }
                            },
                            {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 2
                            }
                            },
                            {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                            }
                        ]
                });

            });
    }
};



function truncate(str,n){
        return str?.length>n?str.substr(0,n-1)+"...":str;
}
let image = '';
function bannerimage() {
    objectLenght = Object.keys(request).length;
    if(i==objectLenght) {
        document.getElementById("bannerimage").innerHTML += `
                                                    <img src=${image} />
                                                    `
    }
}

async function search() {
    let v = document.getElementById("search").value;
    if(v !== '') {
        document.getElementById('searchResult').style.display='block';
        let d= ''
        const url = 'https://api.themoviedb.org/3'+`/search/multi?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&query=${v}&page=1&include_adult=false`;
        await fetch(url).then((response)=>{
				return response.json();
			}).then((data)=>{
				d = data.results;
		})
         console.log(d);
         document.getElementById('seacrhresult').innerHTML = ""
         Object.keys(d).forEach(key => {
                document.getElementById('seacrhresult').innerHTML  += `
                                                        <a style= text-decoration:none;color:white href="./moviebanner.html?id=${d[key]?.id}&category=${d[key].first_air_date ? 'show' : 'movie'}">
                                                        <div class="search">
                                                            <img 
                                                            src=${base_url+d[key].poster_path || base_url+d[key].backdrop_path }
                                                            loading = 'lazy'
                                                            />
                                                            <h3>${truncate(d[key]?.original_title,26) || truncate(d[key]?.title,26) || truncate(d[key]?.name,26) || ''}</h3>
                                                            <p></p>
                                                        </div>
                                                        </a>
                                                        `
        });
        
    } 
}

async function getdata(value) {
            url = 'https://api.themoviedb.org/3'+value.url;
            let d = {};
            await fetch(url).then((response)=>{
				return response.json();
			}).then((data)=>{
				d = data.results;
			})
            let c = "rowslide"+i;
            let r = "row" + i;
            i= i+1;
            objectLenght = Object.keys(d).length;
            if(value.name === 'Trending Today') {
                image = base_url+d[Math.floor(Math.random() * objectLenght)]?.backdrop_path || d[Math.floor(Math.random() * objectLenght)]?.poster_path;
            }
            document.getElementById("rows").innerHTML  += `
                                                         <div class="row" id="row">
                                                            <div id="name">
                                                                <span class="heading">${value.name}</span>
                                                            </div>
                                                                <div class="rowslide slider ${c}" id=${c}></div>
                                                        </div>
                                                        `
             Object.keys(d).forEach(key => {
                document.getElementById(c).innerHTML  += `
                                                        <a style= text-decoration:none;color:white href="./moviebanner.html?id=${d[key]?.id}&category=${d[key].first_air_date ? 'show' : 'movie'}"><div class="onemovie">
                                                            <img 
                                                            src=${base_url}${d[key].poster_path}
                                                            />
                                                            <h3>${truncate(d[key]?.original_title,26) || truncate(d[key]?.title,26) ,truncate(d[key]?.name,26) || ''}</h3>
                                                            <p></p>
                                                        </div></a>
                                                        `
            });
            sliders[i] = {'sliderid':`.${c}`};
            sliderInit();  
            bannerimage();
}

async function get() {
   Object.keys(request).forEach(key => {
        getdata(request[key]);
   }); 
}


async function g() {
    url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&language=en-US'
			await fetch(url).then((response)=>{
				return response.json();
			}).then((data)=>{
				d = data.genres;
				console.table(data.genres[0]);
			})
			
			document.getElementById("row").innerHTML  = d[1].name;

        return;
}