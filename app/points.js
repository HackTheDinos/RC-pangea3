export default {
    generateGeoJson(records){
        const geojson = []
        for (let r in records){
            const record = records[r][0]
            const geo = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [record.pln, record.pla]
                },
                    "properties": {
                        "name": record.tna
                    }
                }
            geojson.push(geo)
        }
        return geojson
    },

    plotPoints(svg, path, projection, data){

        let tooltip = d3.select('.point-tooltip')

        if(!tooltip.node()){
            tooltip = d3.select('body')
                .append('div')
                .style("position", "absolute")
                .style("z-index", "10")
                .style("opacity", "0")
                .attr('class', 'point-tooltip')
        }

        //points
        svg.select('g').remove()
        const points = svg.append('g')
            .attr('class', 'fossils')

        points.selectAll('path.fossil')
            .data(data)
            .enter()
            .append("path")
            .attr('d', (d) => {return path(d);})
            .attr("class", "fossil")
            .attr("fill", "rgba(51, 204, 255, 0.5)")
            .attr("stroke", "rgba(48, 180, 255, 0.6)")
            .on('mouseover', (d)=> {
                const rect = d3.event.target.getBoundingClientRect()
                tooltip.text(d.properties['name'])
                    .style('top', `${rect.top + 20}px`)
                    .style('left', `${rect.left + 20}px`)
                    .style("opacity", "1")
            })
            .on("mouseout", function () {
                tooltip.style("opacity", "0");
            })
            // .on("mousedown", function () {
            //     d3.select(this)
            //         .attr('class', 'point-active')
            // })
        }
}
