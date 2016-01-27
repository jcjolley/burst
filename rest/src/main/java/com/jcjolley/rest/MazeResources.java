package com.jcjolley.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import com.jcjolley.maze.Maze;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("sp")
public class MazeResources{

    /**
     * Method handling HTTP GET requests. The returned object will be sent
     * to the client as "text/plain" media type.
     *
     * @return String that will be returned as a text/plain response.
     */
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getIt() {
        return "Got it!";
    }

	 @Path("maze")
	 @GET
	 @Produces(MediaType.TEXT_PLAIN)
	 public String getMaze() {
		System.out.println("Starting maze generation");
		Maze m = Maze.create(30);
		System.out.println("Maze generation complete");
		String output = m.toString();

		output += "\n Shortest path from entrance to exit is: " + m.getShortestPath(m.getEntrance(), m.getExit()).size();
		return output; 
	 }
}
