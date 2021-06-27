

let id='';
let category='';
let request = '';
let trailerid ='';
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
        gettrailermovie: `/movie/${id}/videos?api_key=d2ae966b0bae2a9f7dbc2a38133cb0f8&language=en-US`
    }
    if(category === 'movie') {
        fetchdata(request.getmoviedetails);
        fetchtrailerurl(request.gettrailermovie);
    } else {
        fetchdata(request.gettvdetails);
        fetchtrailerurl(request.gettrailertv);
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

        const rating = d?.vote_average*10;
        document.getElementById('posterimg').src = `${baseimageurl}${d?.poster_path}`
        document.getElementById('title').innerHTML += `${d?.original_title || d?.name || d?.title}`
        document.getElementById('chartvalue').innerHTML += `${d?.vote_average*10}%`
        document.getElementById("chart").setAttribute("data-percent", `${rating}`);
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

async function fetchtrailerurl(url){
    let d = '';
    url = baseurl + url;
    await fetch(url).then((response)=>{
			return response.json();
		}).then((data)=>{
			d = data.results;
	})
    for (i = 0; i < d.length; i++) {
        if(d[i].type === 'Trailer' && d[i],name === "Official Trailer") {
            trailerid = d[i].key;
            document.getElementById('trailerbutton').style.visibility = "visible";
            break;
        } else if(d[i].type === 'Trailer'){
            trailerid = d[i].key;
            break;
        }
            
    }
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



function showtrailer() {
    if(trailerid) {
        document.getElementById('trailer').src = `https://www.youtube.com/embed/${trailerid}?autoplay=1`
        document.getElementById('trailerbox').style.display = "flex";
    } else {
        document.getElementById('notrailer').innerHTML = "<span>No Trailer Available</span>";
        document.getElementById('notrailer').style.marginLeft = "0vw";
    }
}

function hidetrailer() {
    document.getElementById('trailer').src = ""
    document.getElementById('trailerbox').style.display = "none";
}