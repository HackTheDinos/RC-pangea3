import json
import urllib2

def get_specimens():
    infile = './geologic_intervals.json'
    with open(infile, 'r') as file_in:
        json_intervals = json.loads(file_in.read())

    for record in json_intervals:
        name = record['nam']
        outfile = './specimen_jsons/specimens_{}.json'.format( name.replace(' ','_') )

        record_json = json.load(urllib2.urlopen('https://paleobiodb.org/data1.2/specs/list.json?datainfo&rowcount&show=paleoloc&interval={}'.format( name.replace(' ','%20') )))

        with open(outfile, 'w') as file_out:
            file_out.write(json.dumps(record_json))

if __name__ == "__main__":
    get_specimens()
