/*
 * The MIT License
 *
 * Copyright 2015 josh.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package com.jcjolley.maze;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;
import java.util.Set;
import java.util.Stack;

/**
 *
 * @author josh
 */
public class Maze {

	private Node entrance;
	private Node exit;
	private static Random rng;
	private int size;

	private Maze() {
	}

	/**
	 * Creates a well formed maze.
	 *
	 * @param size
	 * @return
	 */
	public static Maze create(int size) {
		if (rng == null) {
			rng = new Random();
		}

		Maze m = new Maze();
		m.entrance = new Node.Builder(Pos.create(0, 0)).entrance().build();
		Set<Pos> markedPositions = Sets.newHashSet(m.entrance.getPos());
		Node lastNode = m.entrance;
		m.size = size;

		//build the path from the entrance to the exit
		lastNode = createPath(lastNode, markedPositions, (int) (size * (size * .15)), size);

		//setup the exit
		lastNode.setExit(true);
		m.exit = lastNode;

		//randomly build branching paths throughout the maze	
		for (int i = 0; i < (int)(size / 10); i++) {
			m.getNodes().forEach(n -> {
				if (rng.nextInt(10) == 1 ){
					createPath(n, markedPositions,(int)(size / 3), size);
				}
			});
		}

		//connect adjacent nodes.
		connectAdjacentNodes(m, markedPositions);

		//reject and recreate the maze if it's too small.
		if (markedPositions.size() < (size * (size * .25))
			 || m.getShortestPath(m.entrance, m.exit).size() < size) {
			m = Maze.create(size);
		}

		return m;
	}

	/**
	 * Connects adjacent nodes that haven't already been connected
	 *
	 * @param m
	 * @param markedPositions
	 */
	private static void connectAdjacentNodes(Maze m, Set<Pos> markedPositions) {
		Set<Node> nodes = m.getNodes();
		EnumSet<Direction> directions = EnumSet.allOf(Direction.class);
		nodes.forEach(n -> {
			Pos p = n.getPos();
			directions.forEach(d -> {
				if (markedPositions.contains(p.go(d)) && n.getDirection(d) == null) {
					nodes.stream()
						.filter(node -> node.getPos().equals(p.go(d)))
						.findAny()
						.ifPresent(node -> n.setDirection(d, node));
				}
			});
		});
	}

	/**
	 * Creates a simple, small 5X5 maze with a straight path from (0,0) to (0,5)
	 *
	 * @return
	 */
	public static Maze createSimple() {
		Maze m = new Maze();
		m.entrance = new Node.Builder(Pos.create(0, 0)).entrance().build();
		m.size = 5;

		Node lastNode = m.entrance;
		Node current;
		for (int x = 1; x < 5; x++) {
			current = new Node.Builder(Pos.create(x, 0)).west(lastNode).build();
			lastNode = current;
		}

		lastNode.setExit(true);
		m.exit = lastNode;
		return m;
	}

	/**
	 * Creates a path starting from "lastNode" and continuing until the path has reached maxLength, or
	 * there are no directions left to add a node to.
	 *
	 * @param lastNode
	 * @param markedPositions
	 * @param maxLength
	 * @param size
	 * @return
	 */
	private static Node createPath(Node lastNode, Set<Pos> markedPositions, int maxLength, int size) {
		for (int i = 0; i < maxLength; i++) {
			Node current = addNode(lastNode, markedPositions, size);
			if (current != null) {
				lastNode = current;
			} else {
				break;
			}
		}
		return lastNode;
	}

	/**
	 * Adds a new node to last node by attempting to add a node in each possible direction
	 *
	 * @param lastNode
	 * @param marked
	 * @param size
	 * @return
	 */
	private static Node addNode(Node lastNode, Set<Pos> marked, int size) {
		List<Direction> directionsToTry = Lists.newArrayList(Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST);
		Direction direction;
		while (!directionsToTry.isEmpty()) {
			direction = directionsToTry.get(rng.nextInt(directionsToTry.size()));
			Pos newPos = lastNode.getPos().go(direction);
			if (newPos.inBounds(size) && !marked.contains(newPos)) {
				try {
					Node currentNode = new Node.Builder(newPos).build();
					lastNode.setDirection(direction, currentNode);
					marked.add(newPos);
					return currentNode;
				} catch (IllegalArgumentException e) {
					System.out.println(e.getMessage());
				}
			}

			//We couldn't add a node in the chosen direction.
			directionsToTry.remove(direction);
		}

		//There wasn't a direction to go!
		return null;
	}

	/**
	 * A depth first search that returns a set of every node in the maze
	 *
	 * @param n
	 * @param marked
	 * @return
	 */
	public Set<Node> dfs(Node n, Set<Node> marked) {
		if (!marked.contains(n)) {
			marked.add(n);
			if (n.getNorth() != null) {
				dfs(n.getNorth(), marked);
			}
			if (n.getEast() != null) {
				dfs(n.getEast(), marked);
			}
			if (n.getSouth() != null) {
				dfs(n.getSouth(), marked);
			}
			if (n.getWest() != null) {
				dfs(n.getWest(), marked);
			}
		}
		return marked;
	}

	@Override
	public String toString() {
		Set<Node> nodes = this.dfs(entrance, Sets.newHashSet());
		String maze = "+";
		Node found = null;
		for (int x = 0; x < size; x++) {
			maze += "-";
		}
		maze += "+\n";
		for (int y = size - 1; y >= 0; y--) {
			maze += "|";
			for (int x = 0; x < size; x++) {
				Pos p = Pos.create(x, y);
				for (Node n : nodes) {
					if (n.getPos().equals(p)) {
						found = n;
						break;
					}
				}
				if (found != null) {
					maze += found.toString();
					found = null;
				} else {
					maze += "X";
				}
			}

			maze += "|\n";
		}
		maze += "+";
		for (int x = 0; x < size; x++) {
			maze += "-";
		}
		maze += "+";
		return maze;
	}

	public Set<Node> getNodes() {
		Set<Node> markedNodes = Sets.newHashSet();
		return dfs(entrance, markedNodes);
	}

	public Stack<Node> getShortestPath(Node start, Node end) {
		Set<Node> nodes = getNodes();
		EnumSet<Direction> directions = EnumSet.allOf(Direction.class);
		Map<Node, Integer> dist = Maps.newHashMap();
		Map<Node, Node> prev = Maps.newHashMap();

		nodes.forEach(n -> {
			dist.put(n, Integer.MAX_VALUE);
			prev.put(n, null);
		});

		dist.put(start, 0);

		while (!nodes.isEmpty()) {

			Node u = dist.entrySet()
				.stream()
				.filter(e -> nodes.contains(e.getKey()))
				.sorted((e1, e2) -> Integer.compare(e1.getValue(), e2.getValue()))
				.map(Entry::getKey)
				.findFirst()
				.get();

			nodes.remove(u);
			if (u.equals(end)) {
				break;
			}

			directions.forEach(d -> {
				Node v = u.getDirection(d);
				if (v != null && nodes.contains(v)) {
					int alt = dist.get(u) + 1; //length of the edge is always one
					if (alt < dist.get(v)) {
						dist.put(v, alt);
						prev.put(v, u);
					}
				}
			});
		}

		Stack<Node> shortestPath = new Stack<>();
		Node u = end;
		while (prev.get(u) != null) {
			shortestPath.push(u);
			u = prev.get(u);
		}

		return shortestPath;
	}

	public Node getEntrance() {
		return entrance;
	}

	public Node getExit() {
		return exit;
	}

	public int getSize() {
		return size;
	}

}
