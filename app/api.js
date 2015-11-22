
export default {
    uri: 'https://paleobiodb.org/data1.2/specs/list.json?datainfo&rowcount&show=paleoloc&interval=',
    getInterval(interval){
        let x = this.uri + encodeURIComponent(interval)
        console.log(x)
        return fetch(this.uri + encodeURIComponent(interval))
            .then((response) => {
                if(!response.ok){
                    throw 'bad response'
                }
                return response.json()
            })
    }
}
