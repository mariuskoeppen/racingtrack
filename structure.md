RacingTrack
* track: has a track wich contains of streets

Street
* pos: has a center position
* dir: has a direction it's pointing to (really needed?)
* width: width of the street
* previous, next: knows about its two adjacent streets
* hits(vehicle): return bool if vehicle hits the walls of the street

Vehicle:
* pos: position
* vel: velocity
* acc: acceleration
* path: array of points it wants to steer towards
* gen: wich generation it belongs to
* crossover(vehicle): crossover function
* fitness: fitness evaluated upon lifetime

Population:
* pop: all vehicles in the population
