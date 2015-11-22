
export default {
    uri: 'https://paleobiodb.org/data1.2/colls/summary.json?level=2&interval=',
    getInterval(interval){
        return fetch(this.uri + encodeURIComponent(interval))
            .then((response) => {
                if(!response.ok){
                    throw 'bad response'
                }
                return response.json()
            })
    }
}
