
export default {
    uri: 'https://paleobiodb.org/data1.1/colls/summary.json?level=2&interval=',
    getInterval(interval){
        return fetch(this.uri + interval)
            .then((response) => {
                if(!response.ok){
                    throw 'bad response'
                }
                return response.json()
            })
    }
}