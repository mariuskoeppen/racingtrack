## Future ideas
- improve fitness function
  * full laps should vastly increase fitness
- improve way of recreating the population
  * get rid of worst (10%) of elements (exclude from reproduction)
  * keep the very best (10%) of elements (pass on to next generation)
- be able to choose different shapes of racing tracks
- improve function for determining whether a vehicle is on the right path (Vehicle.check_optimal_path)
  * inverted distance to middle of the perfect path changes fitness
- think about memory management
  * be able to delete a vehicle
  * be able to delete a street (all streets in a track create a circular reference pattern)
- time information
- force next generation button
- be able to change muation rate
- be able to change population size
- be able to create own tracks!
  * drag street points
- improve performance
  * finding the closest street to a vehicle
    * assume optimal_path_index street to be closest
    * recursively check next and previous street
    * if closer, check recursion, else reject
- have mutations towards the end rather than the beginning
- enable _force next dynasty_ and similar
