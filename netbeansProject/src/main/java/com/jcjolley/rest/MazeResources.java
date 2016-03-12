package com.jcjolley.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jcjolley.maze.Maze;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.QueryParam;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("sp")
public class MazeResources {

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
	public String getMaze(@QueryParam("size") String strSize) {
		Integer size;
		if (strSize != null) {
			size = Integer.parseInt(strSize);
		} else {
			size = 30;
		}
		System.out.println("Starting maze generation");
		Maze m = Maze.create(size);
		System.out.println("Maze generation complete");
		String output = m.toHTML();
		output = output.replaceAll("\\R", "<br/>");
		output = "<style>html{line-height:50%; background:lightblue;} "
			+ ".square{height:10px;width:10px; float:left;} .entrance{background:pink;} "
			+ ".exit{background:green;} .open{background:white;} "
			+ ".wall{background:black;}"
			+ ".unseen{background:grey;}"
			+ "</style><div style='width: " + (size + 2) * 10 + "'><p style='letter-spacing: -3px'>" + output;

		return output;
	}

	@Path("jsonMaze")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getJsonMaze(@QueryParam("size") String strSize) {
		Integer size;
		if (strSize != null) {
			size = Integer.parseInt(strSize);
		} else {
			size = 30;
		}
		Maze m = Maze.create(size);
		String[][] grid = m.getGrid();
		ObjectMapper om = new ObjectMapper();
		String output = new String();
		try {
			output = om.writeValueAsString(grid);
		} catch (Exception ex) {
			//this is just so it compiles. I love bad practices...
			// TODO: something useful... ever.
		}
		return output;
	}

	@Path("numberMaze")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getNumberMaze(@QueryParam("size") String strSize) {
		Integer size;
		if (strSize != null) {
			size = Integer.parseInt(strSize);
		} else {
			size = 30;
		}
		Maze m = Maze.create(size);

		return m.toNumberString();
	}
}
