import api from './api'
import 'styles/style.scss' 
import d3 from 'd3'
import topojson from 'topojson'
import map from 'file!json/map'

let RECORDS = {}

api.getInterval('Jurassic').then((data)=>{
    addRecords(data.records)
}).then(()=> {
    api.getInterval('Triassic').then((data) => {
        addRecords(data.records)
        drawMap()
    })

})

function addRecords(records){
    for(let record of records){
        if (!record || !('oid' in record)){
            continue;
        }

        const oid = record.oid
        if (RECORDS[oid]){
            RECORDS[oid].push(record)
        }
        else {
            RECORDS[oid] = [record]
        }
    }
}

function findDuplicates(records){
    for (let oid in records){
        const record = records[oid]
        if(record.length > 1){
            const latlng = record.map((r, i) =>{
                return `${r.lat}, ${r.lng}`
            })
            console.log(latlng)
        }
    }
}


function drawMap(){
    var width = 1000,
    height = 1000;

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svgmap")

    var projection = d3.geo.orthographic()
        .scale(225)
        .translate([width / 2, height / 2])
        .clipAngle(90);

    var path = d3.geo.path()
        .projection(projection);

    // set projection

    svg = d3.select("#svgmap")
        .attr("width", width)
        .attr("height", height);

    d3.json(map, function(error, world) { 
        var continents = topojson.feature(world, world.objects.step).features
        svg.selectAll("path")
            .data(continents).enter()
            .append("path")
            .attr("class", "feature")
            .style("fill", "steelblue")
            .attr("d", path);
    });

}