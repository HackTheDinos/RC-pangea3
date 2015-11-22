import api from './api'
import 'styles/style.scss' 
import d3 from 'd3'
// import topojsons from './topojson'
import topojsons from './geojson'
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
    const width = window.innerWidth, height = window.innerHeight;
    let isRotating = false
    let mousePos = []

    const lambda = d3.scale.linear()
        .domain([0, width])
        .range([-360, 360]);

    const phi = d3.scale.linear()
        .domain([0, height])
        .range([180, -180]);

    const projection = d3.geo.orthographic()
        .scale(300)
        .translate([width / 2, height / 2])
        .clipAngle(90);

    const path = d3.geo.path()
        .projection(projection);

    projection.rotate([82, -44])


    const mapMouseMove = () => {
        if(isRotating){
            const [x, y] = [d3.event.pageX, d3.event.pageY]
            //console.log(lambda(x),phi(y))
            projection.rotate([lambda(x), phi(y)])
            svg.selectAll("path.feature").attr("d", path);
            svg.selectAll("path.fossil").attr("d", function(d) { console.log(path(d)); return path(d); })
        }
    }

    const mapMouseDown = () => {
        d3.event.preventDefault()
        isRotating = true
    }

    const mapMouseUp = () => {
        d3.event.preventDefault()
        isRotating = false
    }


    const svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svgmap")
        .on('mousedown', mapMouseDown)
        .on('mousemove', mapMouseMove)
        .on('mouseup', mapMouseUp);

    //plotPoints(svg, path, projection);

    //svg = d3.select("#svgmap")
        //.attr("width", width)
        //.attr("height", height);

    plotPoints(svg, path, projection);
    render(map, path, svg);

    let start;
    let frame = topojsons.length;
    let locked = false;

    window.foo = () =>{
        frame++
         render(topojsons[0], path, svg)
    }

    //setInterval(window.foo, 100)
    window.foo()

}

function render(mapUrl, path, svg){
    d3.json(mapUrl, function(error, world) {
        //console.log(world.features[0].properties.TIME)
        svg.selectAll("path.feature").remove()
        const data = svg.selectAll("path.feature")
            .data(world.features, (e) => {
                return e.properties['FEATURE_ID']
            })


        data.enter()
            .append("path")
            .attr("class", "feature")
            .style("fill", "transparent")
            .style("stroke", 'grey')
            .attr("d", path)

    });

}


function plotPoints(svg, path, projection){
    //points
    const aa = [-122.49, 37.79];
    const bb = [-102.39, 30.73];
    const pgh = [-79.9764, 40.4397]; // longitude, latitude
    const nyc = [-74.0059, 40.7127];

    //const data = [aa, bb];
    const data = [pgh, nyc];

    ////const points = svg.append("g");
//
    //svg.selectAll("path")
        //.data(data).enter()
        //.append("path")
        //.attr("fill", "#900")
        //.attr("stroke", "#999")
        //.attr("d", path);

    const tooltip = svg.append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    //const points = svg.append("g");

    //points
    svg.selectAll('path.fossil')
        .data([{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": data[1]
            },
        }])
        .on('mouseover', function (d) {
            return tooltip.text("hello")
                .style("visibility", "visible");
        })
        .on("mouseout", function(){
            return tooltip.style("visibility", "hidden");
        })
        .enter()
        .append("path")
        .attr('d', function(d){console.log(path(d)); return path(d);})
        .attr("class", "fossil")
        .attr("fill", "#900")
        .attr("stroke", "#999");

}
