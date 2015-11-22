import json
import urllib2

def get_request_and_filter():
    # name, early time boundary, late time boundary (in mya)
    _FIELDS = set(['nam','lag','eag'])
    outfile = "geologic_intervals.json"

    d_json = json.load(urllib2.urlopen('https://paleobiodb.org/data1.2/intervals/list.json?scale=1&scale_level=4'))
    records = d_json['records']
    filtered_records = [{k: v for k,v in record.items() if k in _FIELDS} for record in records]

    # add midpoint in mya
    for d in filtered_records:
        d.update({ 'mid': (d['lag']+d['eag'])/2.0 })


    with open(outfile, 'w') as file_out:
        file_out.write(json.dumps(filtered_records))

if __name__ == "__main__":
    get_request_and_filter()
