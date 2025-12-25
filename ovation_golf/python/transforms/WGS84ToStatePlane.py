import sys
import pyproj

from pyproj import Transformer

def wgs84ToStatePlane(StatePlaneCRS,LatIn,LongIn):

    wgs84 = pyproj.CRS('EPSG:4326')
    StatePlane = pyproj.CRS(StatePlaneCRS)

    transformer = Transformer.from_crs(wgs84,StatePlane, always_xy = True)

    X_ft, y_ft = transformer.transform(Long, Lat)

    #X = X_ft*0.0254*12 # Convert to meters
    #Y = y_ft*0.0254*12
    
    X = X_ft # Convert to meters
    Y = y_ft

    return X, Y
    
if len(sys.argv) < 4:
    Print("Usage of RobodotToStatePlane.py: State plane EPSG Number, WGS84 Latitude, WGS84 Longitude")
    sys.exit(1)
    
StatePlaneCRS = 'EPSG:'+ sys.argv[1]
Lat = float(sys.argv[2])
Long = float(sys.argv[3])

StatePlaneX, StatePlaneY = wgs84ToStatePlane(StatePlaneCRS,Lat,Long)

print("X(m):", StatePlaneX)
print("Y(m):", StatePlaneY)

#CLI example
#C:\Users\jwpet\OneDrive\Documents\Python>RoboDotToStatePlane.py 2234 41.09361 -73.39203
#X(m): 250859.11639312567
#Y(m): 181505.8478478079

#To Do generate a 32 bit exe that can be calle from labview, need 32 bit python first! use py2exe?

