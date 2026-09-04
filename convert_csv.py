#!/usr/bin/env python3
"""
Convert KSRTC CSV timetable files to JSON.
"""
import csv
import json
import re
import os

def normalize_time(t):
    """Normalize time to HH:MM format."""
    if not t:
        return "00:00"
    t = t.strip().replace('.', ':')
    # Handle decimal-style times like 8.00 -> 8:00
    parts = t.split(':')
    if len(parts) == 1:
        try:
            val = float(t)
            h = int(val)
            m = int(round((val - h) * 100))
            return f"{h:02d}:{m:02d}"
        except:
            return "00:00"
    try:
        h = int(parts[0])
        m = int(parts[1]) if len(parts) > 1 else 0
        return f"{h:02d}:{m:02d}"
    except:
        return "00:00"

def normalize_service_class(cls):
    """Map service class abbreviations to full names."""
    cls = cls.strip().upper()
    mapping = {
        'EXP': 'Express',
        'EXPRESS': 'Express',
        'ORD': 'Ordinary',
        'ORDINARY': 'Ordinary',
        'ORD.': 'Ordinary',
        'RAJAHAMSA': 'Rajahamsa',
        'AIRAVAT': 'Airavat',
        'AIRAVAT CLUB CLASS': 'Airavat Club Class',
        'VAIBHAVA': 'Vaibhava',
        'NAC SLEEPER': 'NAC Sleeper',
        'SLEEPER': 'Sleeper',
    }
    return mapping.get(cls, cls.title())

def title_case(s):
    """Title-case a string."""
    if not s:
        return s
    return ' '.join(w.capitalize() for w in s.strip().split())

def convert_csv(filepath, station_name, contact=""):
    buses = []
    
    with open(filepath, newline='', encoding='utf-8-sig', errors='replace') as f:
        content = f.read()
    
    # Join lines that were split mid-field (CSV line continuations)
    lines = content.splitlines()
    joined = []
    buffer = ''
    for line in lines:
        # Count quotes to detect split lines
        if buffer:
            buffer += ' ' + line.strip()
            if buffer.count('"') % 2 == 0:
                joined.append(buffer)
                buffer = ''
        else:
            if line.count('"') % 2 == 1:
                buffer = line
            else:
                joined.append(line)
    if buffer:
        joined.append(buffer)
    
    clean_content = '\n'.join(joined)
    reader = csv.reader(clean_content.splitlines())
    
    header_found = False
    id_counter = 1
    
    for row in reader:
        if not row or not any(r.strip() for r in row):
            continue
        
        # Skip header/title rows
        first = row[0].strip().upper()
        if first in ('SL NO', 'SL.NO', 'SLNO', ''):
            header_found = True
            continue
        if not header_found:
            continue
        
        # Try to parse SL NO as integer
        try:
            int(row[0].strip())
        except (ValueError, IndexError):
            continue
        
        if len(row) < 5:
            continue
        
        from_place = title_case(row[1]) if len(row) > 1 else ''
        to_place = title_case(row[2]) if len(row) > 2 else ''
        service_class = normalize_service_class(row[3]) if len(row) > 3 else 'Express'
        via = title_case(row[4]) if len(row) > 4 else ''
        dep_time = normalize_time(row[5]) if len(row) > 5 else '00:00'
        
        if not to_place:
            continue
        
        bus = {
            "id": id_counter,
            "from": from_place,
            "destination": to_place,
            "serviceClass": service_class,
            "via": via,
            "departureTime": dep_time
        }
        buses.append(bus)
        id_counter += 1
    
    return buses

# Station configurations
stations = [
    {
        "key": "hosadurga",
        "file": "HOSADURGA.csv",
        "station": "Hosadurga Bus Stand",
        "address": "Hosadurga, Chitradurga District",
        "contact": "7760998025",
        "division": "Chitradurga Division"
    }
]

src_dir = '/home/srujan/123'
out_dir = '/home/srujan/123/public/data'

for s in stations:
    filepath = os.path.join(src_dir, s['file'])
    buses = convert_csv(filepath, s['station'], s['contact'])
    
    result = {
        "key": s['key'],
        "station": s['station'],
        "address": s['address'],
        "contact": s['contact'],
        "division": s['division'],
        "totalBuses": len(buses),
        "buses": buses
    }
    
    out_path = os.path.join(out_dir, f"{s['key']}.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"✅ {s['key']}.json — {len(buses)} buses")

print("\nDone! All JSON files created in /data/")
