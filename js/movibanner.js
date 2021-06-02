

let id='';
let category='';
let request = '';
const baseurl = 'https://api.themoviedb.org/3';
const baseimageurl = 'https://image.tmdb.org/t/p/original/'





   



function get() {
    var parameters = new URLSearchParams( window.location.search );
    var id = parameters.get( "id" )
    var category = parameters.get( "category" )
    request = {
        getmoviedetails: `/movie/${id}?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&language=en-US`,
        gettvdetails: `/tv/${id}?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&language=en-US`,
        gettrailertv: `/tv/${id}/videos?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8`,
        gettrailermovie: `/movie/${id}/videos?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8`
    }
    if(category === 'movie') {
        fetchdata(request.getmoviedetails);
    } else {
        fetchdata(request.gettvdetails);
    }

}



async function fetchdata(url) {
        url = baseurl + url;
     
        let d = '';
        await fetch(url).then((response)=>{
				return response.json();
			}).then((data)=>{
				d = data;
		})
        
           console.log(d)
       
        document.getElementById('backgroundimage').src = `${baseimageurl}${d?.backdrop_path}`;
        const colorThief = new ColorThief();
        const img = document.getElementById('backgroundimage');
        img.crossOrigin = "Anonymous";
        let c = [0,0,0]
        if (img.complete) {
             c = colorThief.getColor(img);
             document.getElementById('overlay').style.background = `rgba(${c[0]},${c[1]},${c[2]},0.6)`
        } else {
                img.addEventListener('load', function() {
                c = colorThief.getColor(img)
                document.getElementById('overlay').style.background = `rgba(${c[0]},${c[1]},${c[2]},0.6)`
            });
        }


        document.getElementById('posterimg').src = `${baseimageurl}${d?.poster_path}`
        document.getElementById('title').innerHTML += `${d?.original_title || d?.name || d?.title}`
        document.getElementById('chartvalue').innerHTML += `${d?.vote_average*10}%`
        document.getElementById("chart").setAttribute("data-percent", `${d?.vote_average*10}`);
        d?.genres.forEach(getallgenere);
        if(d.tagline) {
             document.getElementById('tagline').innerHTML += `${d?.tagline}`
        } else {
             document.getElementById('tagline').style.display = "none"
        }
       
        document.getElementById('overviewinfo').innerHTML += truncate(d?.overview,300)
        if(d?.vote_average*10 < 50)
            makechart("#ff0000","#990000");
        else 
            makechart("#009933","#004d1a");
}

function getallgenere(item, index) {
  document.getElementById("genre").innerHTML +=  item.name + ", " ; 
}

function truncate(str,n){
        return str?.length>n?str.substr(0,n-1)+"...":str;
}
function makechart(barcolor, trackcolor) {
    $(function () {
            $(".chart").easyPieChart({
            size: "80",
            barColor: barcolor,
            trackColor: trackcolor,
            scaleColor: false,
            lineWidth: 10,
            });
        });
}