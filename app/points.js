export default function plotPoints(svg, path, projection){
    //points
    const aa = [-122.49, 37.79];
    const bb = [-102.39, 30.73];
    const pgh = [-79.9764, 40.4397]; // longitude, latitude
    const nyc = [-74.0059, 40.7127];

    //const data = [aa, bb];
    const data = [pgh, nyc];


    let tooltip = d3.select('.point-tooltip')
    if(!tooltip.node()){
        console.log('new tooltip')
        tooltip = d3.select('body')
            .append('div')
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .attr('class', 'point-tooltip')
    }

    //points
    const points = svg.append('g')
        .attr('class', 'fossils')

    points.selectAll('path.fossil')
        .data([{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": data[1]
            },
                "properties": {
                    "name": "Pittsburgh"
                }
            }
        ])
        .enter()
        .append("path")
        .attr('d', (d)=> {console.log(path(d)); return path(d);})
        .attr("class", "fossil")
        .attr("fill", "#900")
        .on('mouseover', (d)=> {
            console.log(d)
            const rect = d3.event.target.getBoundingClientRect()
            tooltip.text(d.properties['name'])
                .style('top', `${rect.top}px`)
                .style('left', `${rect.left}px`)
                .style("visibility", "visible")
        })
        .on("mouseout", function(){
            return tooltip
                .style("visibility", "hidden");
        })

}
