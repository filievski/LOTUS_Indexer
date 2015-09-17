import json
import csv
import re, urlparse

addon = ['0123', '4567', '89ab', 'cdef']

def urlEncodeNonAscii(b):
    return re.sub('[\x80-\xFF]', lambda c: '%%%02x' % ord(c.group(0)), b)

def iriToUri(iri):
    parts= urlparse.urlparse(iri)
    return urlparse.urlunparse(
        part.encode('idna') if parti==1 else urlEncodeNonAscii(part.encode('utf-8'))
        for parti, part in enumerate(parts)
    )

combined={}
for add in addon:
	f=open('catalogue_' + add + '.json', 'r')
	for line in f:
		data = json.loads(line)
		if len(combined)==0:
			combined=data
		else:
			for attr in data:
				if attr in combined:
					combined[attr] = combined[attr] + data[attr]
				else:
					combined[attr] = data[attr]

with open("catalogue.csv", "w") as csvfile:
	fieldnames = ["Datatype", "Frequency"]
	writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
	writer.writeheader()
	
	for attr in combined:
		print iriToUri(attr), combined[attr]
		writer.writerow({'Datatype': iriToUri(attr), 'Frequency': combined[attr]})


