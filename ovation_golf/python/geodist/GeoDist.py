import sys
import math
import geopy

from geopy import distance
    
if len(sys.argv) < 5:
    Print("Usage of GoeDist.py: WGS84 Latitude point 1 (corner point), WGS84 Longitude point1 (corner point),WGS84 Latitude point 2, WGS84 Longitude point2")
    sys.exit(1)
    
#Get arguments
Lat1 = float(sys.argv[1])
Long1 = float(sys.argv[2])
Lat2 = float(sys.argv[3])
Long2 = float(sys.argv[4])
    
#Get the 4 points from a rectangle created with the 2 input points
RefPoint = (Lat1, Long1)
MeasPoint =(Lat2, Long2)
xPoint = (Lat1, Long2)
yPoint = (Lat2, Long1)

#Calculate Magnitudes
Magnitude = (distance.distance(RefPoint, MeasPoint).meters)
Xmag = (distance.distance(RefPoint, xPoint).meters)
Ymag = (distance.distance(RefPoint, yPoint).meters)

#calculate the sign of x and y based on the differences of the input points. This should work for all of the North America.
X = -1*math.copysign(Xmag, (Long1 - Long2))
Y = -1*math.copysign(Ymag, (Lat1 - Lat2))
ZCheck = math.sqrt(X*X+Y*Y)

#Output results
print("X(m):", X)
print("Y(m):", Y)
print("Magnitude(m):", Magnitude)
print ("check (m):", ZCheck)

#CLI example
#C:\Users\jwpet\OneDrive\Documents\Python\GeoDistance\geodist.py 40.39757522580463 -111.88905122101177 40.39861824574933 -111.88774927108423
#C:\Users\jwpet\OneDrive\Documents\Python\GeoDistance\geodist.py 40.39757522580463 -111.88905122101177 40.39863756078114 -111.89042080470175
#C:\Users\jwpet\OneDrive\Documents\Python\GeoDistance\geodist.py 40.39757522580463 -111.88905122101177 40.39651287406587 -111.89051380112514
#C:\Users\jwpet\OneDrive\Documents\Python\GeoDistance\geodist.py 40.39757522580463 -111.88905122101177 40.39682192357329 -111.88653186335979

#C:\Users\jwpet\OneDrive\Documents\Python\RoboDot\GeoDistance>geodist.py 40.39757522580463 -111.88905122101177 40.39682192357329 -111.88653186335979
#X(m): 213.88476821167757
#Y(m): -83.64839366217184
#Magnitude(m): 229.66118017280866