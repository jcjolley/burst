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
	 @Produces(MediaType.TEXT_HTML)
	 public String getMaze() {
		System.out.println("Starting maze generation");
                int size = 30;
		Maze m = Maze.create(size);
		System.out.println("Maze generation complete");
		String output = m.toString();
		output = output.replaceAll("\\R", "<br/>");
		output = "<style>html{line-height:50%; background:lightblue;} .square{height:10px;width:10px; float:left;} .entrance{background:pink;} .exit{background:green;} .open{background:white;} .wall{background:black;}</style><div style='width: " + size * 10 + "'><p style='letter-spacing: -3px'>" + output;	

		return output; 
	 }
}
